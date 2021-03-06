const environment = process.env.NODE_ENV || 'development'
if(environment === "development") {
  const Bottleneck = require("bottleneck")
};

const fetch = require('node-fetch');
const db = require('../../db')

const admin = require("firebase-admin");

const heroesRef = db.collection('heroes')
const matchesRef = db.collection('matches')
const townsRef = db.collection('towns')
const usersRef = db.collection('users')
const itemsRef = db.collection('items')

//import schemas
const newTown = require('../../schemas/newTown')
const newTownQuest = require('../../schemas/newTownQuest')
const levelXPArray = require('../../schemas/levelXpArray')
const itemsList = require('../../schemas/itemsList')

exports.test = (req, res) => {
  res.send({'test': true})
}

let enableDoubleConnection = false

if(enableDoubleConnection){
  console.log('*************DOUBLE CONNECTION ACTIVE***************')
  const dbTest = require('../../dbTest')
  const heroesRef_test = dbTest.collection('heroes')
  const matchesRef_test = dbTest.collection('matches')
  const townsRef_test = dbTest.collection('towns')
  const usersRef_test = dbTest.collection('users')
}

async function getHeroesFromDB(){
  return await heroesRef.get()
  .then(snapshot => {
    let returnData = {}
    console.log('[debug] Pulling cached heroes')
    snapshot.forEach(doc => {
      console.log('[debug] found cached heroes doc', doc.id)
      returnData = doc.data()
    })
    return returnData
  })
}

exports.createBackup = async (req, res) => {
  
  const limiter = new Bottleneck({
    maxConcurrent: 5,
    minTime: 500
  });

  async function copyHeroes() {
    heroesRef.get()
    .then(snapshot => {
      if(snapshot.empty) console.log('[backup] no heroes found')
      else {
        snapshot.forEach(async doc => {
          let id = doc.id
          let data = doc.data()
  
          const result = await limiter.schedule(() => {
            heroesRef_test.doc(id).set(data).then( result => {
              console.log('[backup] heroesID: ' + id + ' complete')
              return true
            })
            .catch(e => console.log('[backup] error copying heroesID: ' + id + ' :' + e))
          });
        })
      }
    })
  }

  async function copyTowns(){
    let count = 0
    townsRef.get()
      .then(snapshot => {
        if(snapshot.empty) console.log('[backup] no towns found')
        else {
          snapshot.forEach(async doc => {
            let id = doc.id
            let data = doc.data()

            const result = await limiter.schedule(() => {
              townsRef_test.doc(id).set(data).then( result => {
                console.log('[backup] townsID: ' + id + ' copy complete')
                count += 1
                return
              })
              .catch(e => console.log('[backup] error copying towns: ' + e))
            });
          })
          return count
        }
      })
  }

  async function copyMatches(){
    let count = 0
    matchesRef.get()
      .then(snapshot => {
        if(snapshot.empty) console.log('[backup] no matches found')
        else {
          snapshot.forEach(async doc => {
            let id = doc.id
            let data = doc.data()

            const result = await limiter.schedule(() => {
              matchesRef_test.doc(id).set(data).then( result => {
                console.log('[backup] matchesID: ' + id + ' copy complete')
                count += 1
                return
              })
              .catch(e => console.log('[backup] error copying matches: ' + e))
            });
          })
          return count
        }
      })
  }

  async function copyUsers(){
    let count = 0
    usersRef.get()
      .then(snapshot => {
        if(snapshot.empty) console.log('[backup] no users found')
        else {
          snapshot.forEach(async doc => {
            let id = doc.id
            let data = doc.data()

            const result = await limiter.schedule(() => {
              usersRef_test.doc(id).set(data).then( result => {
                console.log('[backup] usersID ' + id + ' copy complete')
                count += 1
                return true
              })
              .catch(e => console.log('[backup] error copying users: ' + e))
            });
          })
        }
      })
    
    return count
  }

  let copiedTownsCount = await copyTowns()
  let copiedHeroesCount = await copyHeroes()
  let copiedUsersCount = await copyUsers()
  //dont really need to copy matches
  //let copiedMatchesCount = await copyMatches()

  res.send({
    'success': true,  
    'users': copiedUsersCount
  })
}

exports.editAllTowns = async (req, res) => {
  let totalCount = 0
  townsRef.get()
    .then(snapshot => {
      if(snapshot.empty) console.log('[editAllTowns] no towns found')
      else {
        snapshot.forEach(doc => {
          let townID = doc.id
          let town = doc.data()

          //add changes here

          let changeFlag = true
          town.active.forEach(quest => {
            quest.modifiers = []
          })

          //end changes
          if(changeFlag){
            townsRef.doc(townID).set(town).then( result => {
              console.log('[editAllTowns] townsID: ' + townID + ' edit complete')
            })
            .catch(e => console.log('[editAllTowns] error copying towns: ' + e))
          }
        })
      }
    })
    .then(
      res.send({'status': 'Editing all towns'})
    )
}

exports.addQuestToTown = async (req, res) => {
  let playerID = req.params.steamID
  let allHeroes = await getHeroesFromDB()
  allHeroes = allHeroes.herolist

  // allHeroes.forEach((hero, index) => {
  //   console.log(index, ': ', hero.name)
  // })

  townsRef.where('playerID', '==', parseInt(playerID)).get()
    .then(snapshot => {
      if(snapshot.empty) console.log('empty')
      else {
        snapshot.forEach(doc => {
          // console.log(doc.data())
          let townID = doc.id
          let town = doc.data()

          let editFlag = false
          
          //add randomized new quest
          let townQuest = { ...newTownQuest }
          // console.log(townData.totalQuests)
          townQuest.id = (town.totalQuests + 1)
          //townQuest.hero = allHeroes[72]
  
          townQuest.hero = allHeroes[Math.floor(Math.random() * allHeroes.length)]
          editFlag = true
          town.active.push(townQuest)

          if(editFlag){
            townsRef.doc(townID).set(town).then(result => {
              console.log(result, '[debug] Added quest for user ' + townID)
            })
          }
        })
      }
    })
  
  res.send({'status': 'Added new quest', 'playerID': playerID})
}

exports.completeQuests = async (req, res) => {

  console.log('received')
  let playerID = req.params.steamID
  console.log('playerID: ', playerID)
  
  console.log('req.body', req.body)

  let completeQuestList = {}
  let empty = false
  if(req.body.constructor === Object && Object.keys(req.body).length === 0){
    empty = true
    completeQuestList = {
      'complete': []
    }
    res.send({'playerID': playerID, 'quests': completeQuestList, 'newTown': null})
  } else {
    completeQuestList = req.body
  }

  let town = {}
  console.log('completeQuestList in controller: ', completeQuestList)
  if(!empty){
    townsRef.where('playerID', '==', parseInt(playerID)).get()
    .then(snapshot => {
      if(snapshot.empty) console.log('empty')
      else {
        snapshot.forEach(doc => {
          // console.log(doc.data())
          let townID = doc.id
          town = doc.data()

          let editFlag = false
          
          town.active.forEach(quest => {
            if(completeQuestList.complete.includes(quest.id.toString())){
              console.log('editing ', quest.id, ' to complete')
              editFlag = true
              quest.completed = true
              quest.completedMatchID = 5320344512
              if(!quest.attempts.includes(5320344512)) quest.attempts.push(5320344512)
            } else {
              console.log('no matches for ', quest.id)
            }
          })

          if(editFlag){
            townsRef.doc(townID).set(town).then(result => {
              console.log(result, 'completed quests for playerID ' + townID)
            })
          }

          res.send({'playerID': playerID, 'quests': completeQuestList, 'newTown': town})
        })
      }
    })
  }
}

exports.addFieldsToAllTowns = async (req, res) => {

  console.log('Received request to add new fields to all towns.')

  townsRef.get()
    .then(snapshot => {
      if(snapshot.empty) console.log('empty')
      else {
        snapshot.forEach(doc => {

          let townID = doc.id
          let town = doc.data()

          //New Fields to Add to Towns
          town.level = {}
          if(!town.shop) town.shop = []
          if(!town.modifiers) town.modifiers = []
          if(!town.items) town.items = []       

          //Update Existing Towns in Database
          townsRef.doc(townID).set(town).then(result => {
            console.log(result, '[debug] Added fields for town: ' + townID)
          })
        })
      }
    })
  
  res.send({'status': 'Added new fields to all towns.'})
}

exports.completeQuestWithFakeMatch = async (req, res) => {
  let playerID = req.params.steamID
  let questID = req.params.questID
  console.log('Completing quest ' + questID +' with fake match for user ' + playerID)
  
  res.send({'status': 'Received request to add new fields to all towns'})
}
 
exports.rebuildItemsCollection = async (req, res) => {
  await itemsRef.get()
    .then(snapshot => {
      if(snapshot.empty) console.log('[rebuildItems] no items found')
      else {
        snapshot.forEach(item => {
          item.ref.delete()
        })
      }
    })
  
  itemsList.forEach(async item => {
    let itemID = item.id.toString()
    let res = await itemsRef.doc(itemID).set(item)
    .then(ref => {
      console.log('[rebuildItems] itemID: ' + item.id + ' added')
    })
    .catch(e => console.log('[rebuildItems] error adding item: ' + e))
    console.log('response after adding item #', item.id, ': ', res)
  })  

  //EDIT TOWNS SHOPS WITH REBUILT ITEMS COLLECTION
  townsRef.get()
    .then(snapshot => {
      if(snapshot.empty) console.log('[rebuildItems] no towns found')
      else {
        snapshot.forEach(doc => {
          let townID = doc.id
          let town = doc.data()

          //cleanup - one time - rewrite if we need to run this again
          town.shop = []
          town.inventory = []
          delete town.items

          itemsList.forEach(item => {
            town.shop.push(item)
          })

          changeFlag = true

          //end changes
          if(changeFlag){
            townsRef.doc(townID).set(town).then( result => {
              console.log('[rebuildItems] townsID: ' + townID + ' edit complete, shop rebuilt')
            })
            .catch(e => console.log('[rebuildItems] error editing town shop: ' + e))
          }
        })
      }
    })
  
  res.send({'status': 'Rebuilt items collection'})

}