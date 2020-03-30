const fetch = require('node-fetch');
const db = require('../db')
const admin = require("firebase-admin");
const matchesRef = db.collection('matches')

const match = require('../controllers/matchController')

const newTown = {
  playerID: '',
  gold: 0,
  xp: 0,
  totalQuests: 0,
  active: [],
  completed: []
}

const newTownQuest =  {
  id: 0,
  hero: {},
  active: true,
  completed: false,
  completedMatchID: null,
  startTime: new Date(),
  endTime: null,
  conditions: [],
  attempts: [],
  bounty: {
    xp: 100,
    gold: 100
  }
}

let heroesRef = db.collection('heroes')
async function getHeroesFromDB(){
  return await heroesRef.get()
  .then(snapshot => {
    let returnData = {}
    console.log('[ghfdb] Pulling cached heroes')
    snapshot.forEach(doc => {
      console.log('[ghfdb] found cached heroes doc', doc.id)
      returnData = doc.data()
    })
    return returnData
  })
}

async function editExistingTown(playerID, town){
  let townsRef = db.collection('towns')

  console.log('editing existing town: ', town)
  let returnTown = await recalculateExistingTown(town)

  townsRef.doc(playerID).set(returnTown).then(ref => {
    console.log('[editTown] Edited town for user ' + playerID);
  })
  .catch(e => {console.error(e)})

  return returnTown
}

const createNewTown = async (playerID) => {
  let townArray = []
  const townsRef = db.collection('towns')

  let allHeroes = await getHeroesFromDB()
  allHeroes = allHeroes.herolist

  for(i = 0; i < 3; i++){
    let townQuest = { ...newTownQuest }
    townQuest.id = i
    townQuest.hero = allHeroes[Math.floor(Math.random() * allHeroes.length)]
    townArray.push(townQuest)
  }

  let town = { ...newTown }
  town.totalQuests = 3
  town.playerID = parseInt(playerID)
  town.active = townArray

  townsRef.doc(playerID).set(town).then(ref => {
    console.log('[town] Added new town for user ' + playerID);
  })
  .catch(e => {
    console.log('Error adding town: ', e)
  })

  //console.log(town)
  return town
}

const recalculateExistingTown = async (townData) => {
  let oldestQuestTime = 0
  let questHeroIDs = []

  //loop through all actives, get all quest IDs, and oldest
  townData.active.forEach((quest, index) => {
    // console.log(quest,index)
    questHeroIDs.push(quest.hero.id)
    if(index == 0) oldestQuestTime = quest.startTime._seconds
    if(index > 0) {
      if(oldestQuestTime > quest.startTime._seconds) oldestQuestTime = quest.startTime._seconds
    }
  })

  //loop through all completed, get all quest IDs, and oldest
  townData.completed.forEach((quest, index) => {
    // console.log(quest,index)
    questHeroIDs.push(quest.hero.id)
    if(index == 0) oldestQuestTime = quest.startTime._seconds
    if(index > 0) {
      if(oldestQuestTime > quest.startTime._seconds) oldestQuestTime = quest.startTime._seconds
    }
  })

  let checkMatches = await match.fetchMatches(townData.playerID, oldestQuestTime)

  let winOrLoss = (slot, win) => {
    if (slot > 127){
        if (win === false){
            return true
        }
        else return false
    }
    else {
        if (win === false){
            return false
        }
        else return true
    }
  }

  console.log(checkMatches.length + ' matches played since oldest quest start time (active and completed)')
  
  townData.active.forEach(quest => quest.attempts = [])
  townData.completed.forEach(quest => quest.attempts = [])

  checkMatches.forEach(match => {
    let matchResult = winOrLoss(match.player_slot, match.radiant_win)
    // console.log('match ID ' + match.match_id + ': '+ matchResult)
    if(questHeroIDs.includes(match.hero_id)){
      if(matchResult){
        console.log('user ' + townData.playerID + ': quest complete for heroID ' + match.hero_id)

        townData.active.filter(quest => quest.hero.id == match.hero_id).forEach(completedQuest => {
          townData.active.forEach(savedQuest => {
            if(savedQuest.id == completedQuest.id && savedQuest.completed !== true) {
              savedQuest.completed = true
              savedQuest.completedMatchID = match.match_id
              savedQuest.attempts.push(completedQuest.id)
            }
          })
        })

        townData.completed.filter(quest => quest.hero.id == match.hero_id).forEach(completedQuest => {
          townData.completed.forEach(savedQuest => {
            if(savedQuest.id == completedQuest.id) {
              console.log('found completed match attempt loss, pushing' + completedQuest.completedMatchID + 'on to ' + savedQuest.id + ' attempts')
              savedQuest.attempts.push(completedQuest.completedMatchID)
            }
          })
        })
        
      } else {
        // console.log('quest attempted and failed for heroID ' + match.hero_id)
        townData.active.filter(quest => quest.hero.id == match.hero_id).forEach(quest => {
          quest.attempts.push(match.match_id)
        })

        townData.completed.filter(quest => quest.hero.id == match.hero_id).forEach(quest => {
          quest.attempts.push(match.match_id)
        })
      }
    }
  })

  townData.totalQuests = townData.active.length + townData.completed.length
  
  return townData  
}

exports.getTownForUser = async function (req, res) {
  let usersRef = db.collection('users')
  let townsRef = db.collection('towns')
  
  let playerID = req.params.steamID

  let returnTown = {}
  townsRef.where('playerID','==', parseInt(playerID)).get()
  .then(async (snapshot) => {
    if(snapshot.empty){
      console.log('[town] creating new town for ' + playerID)
      returnTown = await createNewTown(playerID)
      res.send(returnTown)
    } else {
      snapshot.forEach(async doc => {
        let existingTown = doc.data()
        console.log('[town] found existing town for '  + existingTown)
        let returnTown = await recalculateExistingTown(existingTown)
        res.send(returnTown)
      }) 
    }
  })
}

exports.completeQuest = async function (req, res) {
  const playerID = req.params.steamID
  let townsRef = db.collection('towns')
  let allHeroes = await getHeroesFromDB()
  allHeroes = allHeroes.herolist

  const editTownData = req.body

  console.log('completing quest')
  console.log('incoming edit town data: ', editTownData)

  let action = editTownData.action

  if(action == 'completeQuest'){
    let completedQuest = editTownData.quest

    console.log(playerID)
    townsRef.where('playerID', '==', parseInt(playerID)).get()
      .then(snapshot => {
        if(snapshot.empty){ 
          res.send({'status': 'failed', 'message' : 'Couldn\'t find player ' + playerID})
        } 
        else {
          snapshot.forEach(async doc => {
            let townID = doc.id
            let town = doc.data()
            console.log(completedQuest)
            
            town.active.filter(q => q.id == completedQuest.id).forEach(q => {
              console.log('found match: ', q)
              town.completed.push(q)

              //add randomized new quest
              let townQuest = { ...newTownQuest }
              // console.log(townData.totalQuests)
              townQuest.id = (town.totalQuests + 1)
              townQuest.hero = allHeroes[Math.floor(Math.random() * allHeroes.length)]
              
              town.active.push(townQuest)

              town.xp += q.bounty.xp
              town.gold += q.bounty.gold
            })

            town.active = town.active.filter(q => q.id != completedQuest.id)
            
            let returnTown = await editExistingTown(townID, town)

            res.send(returnTown)
          })
        }
      })


  } else {
    res.send({'status': 'failed'})
  }
}

exports.getAllTowns = async function (req, res) {
  let townsRef = db.collection('towns')

  async function getAllTowns(){
    let snapshot = await townsRef.get()

    if(snapshot.empty) console.log("[towns] Couldn't find any towns")
    else {
      for(i=0; i < snapshot.size ; i++){
        let returnArr = []
        // console.log('size: ', snapshot.size, snapshot)
        let docs = snapshot.docs
        await Promise.all(docs.map(async doc => {
          let dbTownData = doc.data()
          let returnTown = await recalculateExistingTown(dbTownData)
          townsRef.doc(returnTown.playerID.toString()).set(returnTown)
            .then(result => {
              console.log('store town results for ' + returnTown.playerID + ' after recalculate')
            })
          returnArr.push(doc.data())
        }))

        return returnArr
    }
    }

  }
  
  let allTowns = await getAllTowns()

  // console.log('allTowns: ', allTowns)
  res.send(allTowns)
}