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
      townQuest.id = playerID + '-' + i
      townQuest.hero = allHeroes[Math.floor(Math.random() * allHeroes.length)]
      townArray.push(townQuest)
    }

    let town = { ...newTown }
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

  let processExistingTown = async (townData) => {
    
  }

  let returnTown = {}
  townsRef.where('playerID','==', parseInt(playerID)).get()
  .then(async (snapshot) => {
    if(snapshot.empty){
      returnTown = await createNewTown(playerID)
      res.send(returnTown)
    } else {
      snapshot.forEach(doc => {
        let returnData = doc.data()
        console.log('[town] found existing town for '  + playerID)
        res.send(returnData)
      }) 
    }
  })
}