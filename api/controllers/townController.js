const fetch = require('node-fetch');
const db = require('../db')
const admin = require("firebase-admin");
const matchesRef = db.collection('matches')

const newTown = {
  playerID: '',
  active: [],
  completed: []
}

const newTownQuest =  {
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

exports.getTownForUser = async function (req, res) {
  let usersRef = db.collection('users')
  let townsRef = db.collection('towns')
  
  let allHeroes = await getHeroesFromDB()
  // console.log(allHeroes)
  allHeroes = allHeroes.herolist

  let playerID = req.params.steamID

  let createNewTown = (playerID) => {
    let townArray = []
    for(i = 0; i < 3; i++){
      let townQuest = { ...newTownQuest }
      townQuest.heroID = allHeroes[Math.floor(Math.random() * allHeroes.length)]
      townArray.push(townQuest)
    }

    let town = { ...newTown }
    town.playerID = playerID
    town.active = townArray
    //console.log(town)
    return town
  }

  let processExistingTown = async (townData) => {
    
  }

  let townExists = await townsRef.where('playerID','==', parseInt(playerID)).get()
  .then(snapshot => {
    if(snapshot.empty){
      return false
    } else {
      snapshot.forEach(doc => {
        let returnData = doc.data()
      })
      return returnData
    }
  })

  console.log('townExists: ', townExists)

  let returnTown = {}
  if(townExists){
    processExistingTown(townExists)
  } else {
    returnTown = createNewTown(playerID)
  }
  
  // console.log('[gusfod] user with id ' + userID + ' exists: ' + userExists)

  // if(userExists === false) {
  //   console.log('[gusfod] pulling new user data from OD')
  //   userStats = await fetchUserData(userID)
  //   userStats.lastUpdated = Date.now()
  //   usersRef.doc(userID).set(userStats).then(ref => {
  //     console.log('[gusfod] Added userID ' + userID);
  //   });
  // }

  // let matchStats = await fetchMatchesForUser(req.params.steamID)

  // let calcObj =  await processPlayerInfo(matchStats)
  // let returnObj = {"userStats": userStats, "matchStats": matchStats, "averages": calcObj.averages, "totals": calcObj.totals, "calculations": calcObj}

  res.send(returnTown)
}