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

exports.test = (req, res) => {
  res.send({'test': true})
}

let enableDoubleConnection = false

if(enableDoubleConnection){
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
  // matchesRef.get()
  // .then(snapshot => {
  //   if(snapshot.empty) console.log('[backup] no matches found')
  //   else {
  //     snapshot.forEach(doc => {
  //       let id = doc.id
  //       let data = doc.data()
  //       matchesRef_test.doc(id).set(data).then( result => {
  //         console.log('[backup] matchesID: ' + id + ' copy complete')
  //       })
  //       .catch(e => console.log('[backup] error copying matches: ' + e))
  //     })
  //   }
  // })

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
  // usersRef.get()
  // .then(snapshot => {
  //   if(snapshot.empty) console.log('[backup] no users found')
  //   else {
  //     snapshot.forEach(doc => {
  //       let id = doc.id
  //       let data = doc.data()
  //       usersRef_test.doc(id).set(data).then( result => {
  //         console.log('[backup] usersID ' + id + ' copy complete')
  //       })
  //       .catch(e => console.log('[backup] error copying users: ' + e))
  //     })
  //   }
  // })

  let copiedTownsCount = await copyTowns()
  let copiedHeroesCount = await copyHeroes()
  let copiedUsersCount = await copyUsers()
  let copiedMatchesCount = await copyMatches()

  res.send({
    'success': true,  
    'users': copiedUsersCount
  })
}

exports.editAllTowns = async (req, res) => {
  townsRef.get()
    .then(snapshot => {
      if(snapshot.empty) console.log('[editAllTowns] no towns found')
      else {
        snapshot.forEach(doc => {
          let townID = doc.id
          let town = doc.data()

          let totalCount = 0
          //add changes here

          town.townStats = {}
          town.townStats.nonTownGames = 0
          
          // town.completed.forEach(quest => {

          // })

          // town.active.forEach(quest => {
          //   quest.id = totalCount
          //   totalCount++
          //   quest.bounty = {
          //     xp: 100,
          //     gold: 100
          //   }
          // })

          // town.totalQuests = town.active.length + town.completed.length

          //end changes
          townsRef.doc(townID).set(town).then( result => {
            console.log('[editAllTowns] townsID: ' + townID + ' edit complete')
          })
          .catch(e => console.log('[editAllTowns] error copying towns: ' + e))
        })
      }
    })
  
  res.send({'status': 'Edit all request received'})
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
          townQuest.hero = allHeroes[72]
  
          // townQuest.hero = allHeroes[Math.floor(Math.random() * allHeroes.length)]
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

  let completeQuestList = req.body

  console.log(completeQuestList)

  townsRef.where('playerID', '==', parseInt(playerID)).get()
    .then(snapshot => {
      if(snapshot.empty) console.log('empty')
      else {
        snapshot.forEach(doc => {
          // console.log(doc.data())
          let townID = doc.id
          let town = doc.data()

          let editFlag = false
          
          town.active.forEach(quest => {
            console.log(quest.id)
            console.log(completeQuestList.complete)
            if(completeQuestList.complete.includes(quest.id.toString())){
              editFlag = true
              quest.completed = true
              quest.completedMatchID = 5320344512
              if(!quest.attempts.includes(5320344512)) quest.attempts.push(5320344512)
            } else {
              console.log('no matches')
            }
          })

          if(editFlag){
            townsRef.doc(townID).set(town).then(result => {
              console.log(result, 'completed quests for playerID ' + townID)
            })
          }
        })
      }
    })
  
  res.send({'playerID': playerID, 'quests': completeQuestList})
}