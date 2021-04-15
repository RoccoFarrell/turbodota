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
  level: {},
  townStats: {
    nonTownGames: 0
  },
  active: [],
  completed: [],
  skipped: [],
  inventory: [],
  shop: [],
  modifiers: [],
  lastModified: new Date(),
  dateCreated: new Date()
}

const newTownQuest =  {
  id: 0,
  hero: {},
  active: true,
  completed: false,
  skipped: false,
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

const levelXPArray = [
  '0',
  '200',
  '400',
  '700',
  '1000',
  '1500',
  '2000',
  '2500',
  '3000',
  '4000',
  '5000',
  '6000',
  '7000',
  '8000',
  '9000',
  '100000'
]

let heroesRef = db.collection('heroes')
let itemsRef = db.collection('items')

async function getItemsFromDB(){
  let totalItemsCount = 0

  return await itemsRef.get()
  .then(snapshot => {
    let returnData = []
    console.log('[items] Pulling all items from db')
    snapshot.forEach(doc => {
      totalItemsCount++
      console.log('[items] Found item #', totalItemsCount, ': ', doc.id)
      returnData.push(doc.data())
    })
    return returnData
  })
}

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

  console.log('editing existing town: ', town.playerID)
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

  //loop through all actives, get all quest IDs, and oldest
  townData.active.forEach((quest, index) => {
    // console.log(quest,index)
    if(index == 0) oldestQuestTime = quest.startTime._seconds
    if(index > 0) {
      if(oldestQuestTime > quest.startTime._seconds) oldestQuestTime = quest.startTime._seconds
    }
  })

  //loop through all completed, get all quest IDs, and oldest
  townData.completed.forEach((quest, index) => {
    //Hardcoded time from April 3rd 2021 at 9:05AM to fix legacy endTime issues
    if (quest.endTime < 1617455102) quest.endTime = null

    if(index == 0) oldestQuestTime = quest.startTime._seconds
    if(index > 0) {
      if(oldestQuestTime > quest.startTime._seconds) oldestQuestTime = quest.startTime._seconds
    }
  })

  //order matches by start time
  let checkMatches = await match.fetchMatches(townData.playerID, oldestQuestTime)
  checkMatches = checkMatches.sort((a, b) => {
    if(a.start_time < b.start_time) return -1
    if(a.start_time > b.start_time) return 1
    return 0
  })

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

  townData.active.forEach(quest => quest.attempts = [])
  townData.completed.forEach(quest => quest.attempts = [])
  townData.townStats.nonTownGames = 0
  townData.townStats.totalTownGames = 0

  checkMatches.forEach(match => {
    let matchResult = winOrLoss(match.player_slot, match.radiant_win)
    let townAttempt = false
    townData.townStats.totalTownGames += 1

    townData.active.forEach((quest, index) => {
      if(match.start_time > quest.startTime._seconds && quest.hero.id == match.hero_id){
        if(!quest.completed){
          townAttempt = true
          if(matchResult == true){
            quest.completed = true
            //add half hour to match start time to get end time... ?
            quest.endTime = match.start_time + match.duration
            quest.completedMatchID = match.match_id
            quest.attempts.push(match.match_id)
          } else {
            quest.attempts.push(match.match_id)
          }
        } else {
          //if((match.start_time + match.duration) <= quest.endTime && (!match.match_id in quest.attempts)) {
          if((match.start_time + match.duration) <= quest.endTime){
            townAttempt = true
            quest.attempts.push(match.match_id)
          }
        }
      }
    })

    townData.completed.forEach((quest, index) => {
      if(match.start_time > quest.startTime._seconds && quest.hero.id == match.hero_id){
        if(matchResult == true){
          // if(quest.completed === false) quest.completed = true
          if(!!quest.endTime && (quest.startTime._seconds < match.start_time && match.start_time < quest.endTime)) {
            townAttempt = true
            quest.attempts.push(match.match_id) 
          }
          else if(quest.endTime === null) {
            //why is quest end time null if completed
            //console.warn('townController warning: quest end time for completed quest null ')
            quest.completedMatchID = match.match_id
            quest.endTime = match.start_time + match.duration
            quest.attempts.push(match.match_id)
            townAttempt = true
          } else {
            // console.log('townController warning - duplicate hero quests per chance? => ' + match.match_id, quest.id)
            // wat
            //console.log('townController warning - match with quest hero outside of quest time range  => ' + match.match_id, quest.id)
            townAttempt = false
          }
        } else {
          //quest end time null needs to be removed, we removed from the line below
          //-----------------------------------------------------------------------
          //console.log('lost match as hero after quest started')
          if(quest.endTime > match.start_time) {
            quest.attempts.push(match.match_id)
            townAttempt = true
          }
          else if(quest.endTime === null && quest.startTime._seconds < match.start_time) {
            quest.attempts.push(match.match_id)
            townAttempt = true
            //why is quest end time null if completed
            //console.warn('townController warning: quest end time for completed quest still null, still adding attempt ')
          } else {
            //console.log('broken ', 'qID: ', quest.id, 'qStart_ts: ', quest.startTime._seconds, 'qEnd_ts: ', quest.endTime, 'mStart_ts: ', match.start_time, 'mID: ', match.match_id)
          }

          //console.log('did this get marked as a town attempt?', townAttempt)
        }
      }
    })

    townData.skipped.forEach((quest, index) => {
      if(quest.attempts.includes(match.match_id)) {
        townAttempt = true
      }
    })
    
    if(townAttempt === false){
      townData.townStats.nonTownGames += 1
    }
  })

  if(!townData.skipped) townData.skipped = []

  townData.totalQuests = townData.active.length + townData.completed.length + townData.skipped.length
  townData.lastModified = new Date()

  //calculate total attempts
  let questAttemptMatchIDs = []
  townData.active.forEach(quest => quest.attempts.forEach(attempt => questAttemptMatchIDs.push(attempt)))
  console.log('attempts after active: ' + questAttemptMatchIDs.length)
  townData.completed.forEach(quest => quest.attempts.forEach(attempt => questAttemptMatchIDs.push(attempt)))
  console.log('attempts after completed: ' + questAttemptMatchIDs.length)
  townData.skipped.forEach(quest => quest.attempts.forEach(attempt => questAttemptMatchIDs.push(attempt)))
  console.log('attempts after skipped: ' + questAttemptMatchIDs.length)

  //dedupes
  let uniqueMatchIDs = [...new Set(questAttemptMatchIDs)];

  console.log('attempts after dedupe: ' + uniqueMatchIDs.length)
  townData.townStats.totalAttemptGames = uniqueMatchIDs.length
  townData.townStats.totalQuestAttempts = questAttemptMatchIDs.length

  //calculate level
  let index = levelXPArray.findIndex(xp => xp > townData.xp)
  townData.level.value = index
  townData.level.xpThisLevel = levelXPArray[index - 1]
  townData.level.xpNextLevel = levelXPArray[index] 

  //populate shop with items
  if(!townData.shop) townData.shop = []
  let items = await getItemsFromDB()
  items.forEach(item => {
    let itemInShop = false
    townData.shop.forEach(shopItem => {
       if(item.id === shopItem.id) itemInShop = true
    })
    if(itemInShop === false) townData.shop.push(item)
  })

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
        let returnTown = await editExistingTown(playerID, existingTown)
        res.send(returnTown)
      }) 
    }
  })
}

exports.modifyQuest = async function (req, res) {
  const playerID = req.params.steamID
  let townsRef = db.collection('towns')
  let allHeroes = await getHeroesFromDB()
  allHeroes = allHeroes.herolist

  const editTownData = req.body

  // console.log('completing quest')
  console.log('incoming edit town data: ', editTownData)

  let action = editTownData.action

  if(action == 'completeQuest'){
    let completedQuest = editTownData.quest

    console.log(playerID)
    townsRef.where('playerID', '==', parseInt(playerID)).get()
      .then(snapshot => {
        if(snapshot.empty){
          res.status(404) 
          res.send({'status': 'failed', 'message' : 'Couldn\'t find player ' + playerID})
        } 
        else {
          snapshot.forEach(async doc => {
            let townID = doc.id
            let town = doc.data()
            console.log(completedQuest)
            
            town.active.filter(q => q.id == completedQuest.id).forEach(q => {
              console.log('found match: ', q)
              q.completed = true
              q.endTime = Math.round(((new Date().getTime())/1000))
              town.completed.push(q)

              //add randomized new quest
              let townQuest = { ...newTownQuest }
              // console.log(townData.totalQuests)
              townQuest.id = (town.totalQuests + 1)

              //check to make sure new hero quest isnt same hero as completed quest
              townQuest.hero = allHeroes[Math.floor(Math.random() * allHeroes.length)]
              if(townQuest.hero.id === q.hero.id) townQuest.hero = allHeroes[Math.floor(Math.random() * allHeroes.length)]
              
              town.active.push(townQuest)

              town.xp += q.bounty.xp

              //gold modifier
              //if town.modifiers[] contains the hand of midas mod, new equation 
              //town.gold += q.bounty.gold * 2
              town.gold += q.bounty.gold
            })

            town.active = town.active.filter(q => q.id != completedQuest.id)
            
            let returnTown = await editExistingTown(townID, town)

            res.send(returnTown)
          })
        }
      })


  } else
  if(action == 'skipQuest'){
    console.log('got skip')
    let skipQuest = editTownData.quest

    // console.log(playerID)
    townsRef.where('playerID', '==', parseInt(playerID)).get()
      .then(snapshot => {
        if(snapshot.empty){ 
          res.send({'status': 'failed', 'message' : 'Couldn\'t find player ' + playerID})
        } 
        else {
          snapshot.forEach(async doc => {
            let townID = doc.id
            let town = doc.data()

            if(town.gold < 300){
              res.send({'status': 'failed', 'message': 'Not enough gold'})
            } else
            {
              if(!town.skipped) town.skipped = []
            
              town.active.filter(q => q.id == skipQuest.id).forEach(q => {
                console.log('found match to skip: ', q)
                q.endTime = Math.round(((new Date().getTime())/1000))
                q.skipped = true
                town.skipped.push(q)
  
                //add randomized new quest
                let townQuest = { ...newTownQuest }
                // console.log(townData.totalQuests)
                townQuest.id = (town.totalQuests + 1)
                townQuest.hero = allHeroes[Math.floor(Math.random() * allHeroes.length)]
                
                town.active.push(townQuest)
  
                //skipped quest hard coded amount
                town.gold -= 300
              })
  
              town.active = town.active.filter(q => q.id != skipQuest.id)
              
              let returnTown = await editExistingTown(townID, town)
  
              res.send(returnTown)
            }

          })
        }
      })
  }
  else {
    res.status(404)
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

          //oil and pepper appetizer
          //shouldnt recalc every town every fetch
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

//shop functions
exports.purchaseItemFromShop = async function (req, res) {
  /*
      if you are purchasing an item
      decrement shop item quantity - 1
      decrement gold - (cost of item)
      add inventory item quantity + 1 (add obj if not exist in inventory)
  */
  const playerID = req.params.steamID
  const purchaseItemID = parseInt(req.params.itemID)
  let townsRef = db.collection('towns')
  let returnObj = {}

  await townsRef.where('playerID', '==', parseInt(playerID)).get()
    .then(snapshot => {
      if(snapshot.empty) console.log('empty')
      else {
        snapshot.forEach(doc => {
          // console.log(doc.data())
          let townID = doc.id
          let town = doc.data()

          let editFlag = false

          town.shop.forEach(itemInShop => {          
            if(itemInShop.id === purchaseItemID){
              console.log(itemInShop.id, purchaseItemID)
              if(town.gold >= itemInShop.cost && town.xp >= itemInShop.xpRequirement && itemInShop.quantity > 0){
                if(town.inventory.filter(item => item.id === itemInShop.id).length === 0){
                  console.log('purchase shop item id ' + purchaseItemID + ' not in inventory yet')
                  //decrement shop quantity
                  itemInShop.quantity -= 1
  
                  //decrement gold
                  town.gold -= itemInShop.cost
  
                  //add inventory item
                  let inventoryItem = itemInShop
                  inventoryItem.quantity = 1
                  town.inventory.push(itemInShop)

                  //write new town
                  editFlag = true
                  returnObj = {'success': true, 'status': 'Added item to inventory', 'playerID': playerID, 'itemID': purchaseItemID, 'newTown': town }
                } else {
                  console.log('purchase shop item id ' + purchaseItemID + ' already in inventory')
                  //decrement shop quantity
                  itemInShop.quantity -= 1
  
                  //decrement gold
                  town.gold -= itemInShop.cost
  
                  let foundIndex = town.inventory.findIndex(item => item.id === purchaseItemID)
                  town.inventory[foundIndex].quantity += 1

                  //write new town
                  editFlag = true
                  returnObj = {'success': true, 'status': 'Added +1 quantity', 'playerID': playerID, 'itemID': purchaseItemID, 'newTown': town }
                }
              } else {
                returnObj = {'success': false, 'status': 'Not enough gold or xp or items', 'playerID': playerID, 'itemID': purchaseItemID, 'newTown': town }
              }
            }
          })

          if(editFlag){
            townsRef.doc(townID).set(town).then(result => {
              console.log(result, '[debug] Added quest for user ' + townID)
            })
          }
        })
      }
    })
  
  res.send(returnObj)

}