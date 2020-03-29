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
  attempts: []
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

async function editTown(){
  let townsRef = db.collection('towns')

  townsRef.doc(playerID).set(town).then(ref => {
    console.log('[town] Added new town for user ' + playerID);
  })
}

const createNewTown = async (playerID) => {
  let townArray = []
  const townsRef = db.collection('towns')

  let allHeroes = await getHeroesFromDB()
  allHeroes = allHeroes.herolist

  for(i = 0; i < 3; i++){
    let townQuest = { ...newTownQuest }
    townQuest.id = playerID + '-' + i
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

const processExistingTown = async (townData) => {
  let oldestQuestTime = 0
  let questHeroIDs = []
  townData.active.forEach((quest, index) => {
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

  console.log(checkMatches.length + ' matches played since oldest match')
  checkMatches.forEach(match => {
    let matchResult = winOrLoss(match.player_slot, match.radiant_win)
    // console.log('match ID ' + match.match_id + ': '+ matchResult)
    if(questHeroIDs.includes(match.hero_id)){
      if(matchResult){
        console.log('quest complete for heroID ' + match.hero_id)

        townData.active.filter(quest => quest.hero.id == match.hero_id).forEach(completedQuest => {
          townData.active.forEach(savedQuest => {
            if(savedQuest.id == completedQuest.id && savedQuest.completed !== true) {
              savedQuest.completed = true
              savedQuest.completedMatchID = match.match_id
            }
          })
        })
        
      } else {
        console.log('quest attempted and failed for heroID ' + match.hero_id)
        townData.active.filter(quest => quest.hero.id == match.hero_id).forEach(quest => {
          quest.attempts.push(match.match_id)
        })
      }
    }
  })
  
  return townData  
}

exports.getTownForUser = async function (req, res) {
  let usersRef = db.collection('users')
  let townsRef = db.collection('towns')
  
  let playerID = req.params.steamID

  // let createNewTown = (playerID) => {
  //   let townArray = []
  //   for(i = 0; i < 3; i++){
  //     let townQuest = { ...newTownQuest }
  //     townQuest.id = playerID + '-' + i
  //     townQuest.hero = allHeroes[Math.floor(Math.random() * allHeroes.length)]
  //     townArray.push(townQuest)
  //   }

  //   let town = { ...newTown }
  //   town.playerID = parseInt(playerID)
  //   town.active = townArray

  //   townsRef.doc(playerID).set(town).then(ref => {
  //     console.log('[town] Added new town for user ' + playerID);
  //   })
  //   .catch(e => {
  //     console.log('Error adding town: ', e)
  //   })

  //   //console.log(town)
  //   return town
  // }

  // let processExistingTown = async (townData) => {
  //   let oldestQuestTime = 0
  //   let questHeroIDs = []
  //   townData.active.forEach((quest, index) => {
  //     // console.log(quest,index)
  //     questHeroIDs.push(quest.hero.id)
  //     if(index == 0) oldestQuestTime = quest.startTime._seconds
  //     if(index > 0) {
  //       if(oldestQuestTime > quest.startTime._seconds) oldestQuestTime = quest.startTime._seconds
  //     }
  //   })
  //   let checkMatches = await match.fetchMatches(townData.playerID, oldestQuestTime)

  //   let winOrLoss = (slot, win) => {
  //     if (slot > 127){
  //         if (win === false){
  //             return true
  //         }
  //         else return false
  //     }
  //     else {
  //         if (win === false){
  //             return false
  //         }
  //         else return true
  //     }
  //   }

  //   console.log(checkMatches.length + ' matches played since oldest match')
  //   checkMatches.forEach(match => {
  //     let matchResult = winOrLoss(match.player_slot, match.radiant_win)
  //     // console.log('match ID ' + match.match_id + ': '+ matchResult)
  //     if(questHeroIDs.includes(match.hero_id)){
  //       if(matchResult){
  //         console.log('quest complete for heroID ' + match.hero_id)
  //         townData.active.filter(quest => quest.hero.id == match.hero_id).forEach(match => {
  //           console.log(match)
  //           match.completed = true
  //         })
          
  //       } else {
  //         console.log('quest attempted and failed for heroID ' + match.hero_id)
  //       }
  //     }
  //   })
    
  //   return townData  
  // }

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
        let returnData = await processExistingTown(existingTown)
        res.send(returnData)
      }) 
    }
  })
}

exports.completeQuest = async function (req, res) {
  const steamID = req.params.steamID
  let townsRef = db.collection('towns')
  let allHeroes = await getHeroesFromDB()
  allHeroes = allHeroes.herolist

  const incomingTownData = req.body

  console.log('completing quest')
  console.log('incoming town data: ', incomingTownData)

  let townData = incomingTownData.townData
  let action = incomingTownData.action

  if(action == 'completeQuest'){
    let townQuest = { ...newTownQuest }
    // console.log(townData.totalQuests)
    townQuest.id = townData.playerID + '-' + (townData.totalQuests + 1)
    townQuest.hero = allHeroes[Math.floor(Math.random() * allHeroes.length)]
    townData.active.push(townQuest)

    townData.gold += 100
    townData.xp += 100
  }

  townsRef.doc(townData.playerID.toString()).set(townData)
  .then(snapshot => {
    if(snapshot.empty) console.log('no user found')
    else console.log('user found')
    console.log(snapshot)
    // let townData = snapshot.data()
    // townData.active.filter()
  })
  .catch(e => console.log(e))

  res.send(townData)
}