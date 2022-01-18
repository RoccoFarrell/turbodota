//const https = require('https')
const fetch = require('node-fetch');
const db = require('../db')
const admin = require("firebase-admin");
// const firebase = admin.app();
const matchesRef = db.collection('matches')
const match = require('../controllers/matchController')

function winOrLoss (slot, win) {
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

async function processPlayerInfo(matchStats) {
  let totals = {'kills': 0, 'deaths': 0, 'assists': 0, 'wins':0, 'losses':0}

  let allHeroesGames = {}

  for(let i = 0; i < matchStats.length; i++) {

    //check if hero slot is 0, indicating bad match data
    if(matchStats[i].hero_id === 0 || matchStats[i].hero_id === '0') i++

    //sum all KDA
    totals.kills += matchStats[i].kills
    totals.deaths += matchStats[i].deaths
    totals.assists += matchStats[i].assists

    //sum total wins
    if(winOrLoss(matchStats[i].player_slot, matchStats[i].radiant_win) === true){
      totals.wins += 1
    } else {
      totals.losses += 1
    }

    let heroID = matchStats[i].hero_id

    if(allHeroesGames[heroID] === undefined){
      allHeroesGames[heroID] = {
        games: 0,
        wins: 0,
        losses: 0,
        kills: 0,
        deaths: 0,
        assists: 0,
        partysize: {
          1: {
            games: 0,
            wins: 0,
            losses: 0,
            kills: 0,
            deaths: 0,
            assists: 0
          }, 
          2: {
            games: 0,
            wins: 0,
            losses: 0,
            kills: 0,
            deaths: 0,
            assists: 0
          },
          3: {
            games: 0,
            wins: 0,
            losses: 0,
            kills: 0,
            deaths: 0,
            assists: 0
          },
          4: {
            games: 0,
            wins: 0,
            losses: 0,
            kills: 0,
            deaths: 0,
            assists: 0
          },
          5: {
            games: 0,
            wins: 0,
            losses: 0,
            kills: 0,
            deaths: 0,
            assists: 0
          },
          99: {
            games: 0,
            wins: 0,
            losses: 0,
            kills: 0,
            deaths: 0,
            assists: 0
          }
        }
      }
    }

    allHeroesGames[heroID].games += 1
    allHeroesGames[heroID].kills += matchStats[i].kills
    allHeroesGames[heroID].deaths += matchStats[i].deaths
    allHeroesGames[heroID].assists += matchStats[i].assists

    let tempPartySize = matchStats[i].party_size
    if(tempPartySize === null) tempPartySize = 99
    // console.log("temp party size: ", tempPartySize , matchStats[i])
    allHeroesGames[heroID].partysize[tempPartySize].games += 1
    allHeroesGames[heroID].partysize[tempPartySize].kills += matchStats[i].kills
    allHeroesGames[heroID].partysize[tempPartySize].deaths += matchStats[i].deaths
    allHeroesGames[heroID].partysize[tempPartySize].assists += matchStats[i].assists

    if(winOrLoss(matchStats[i].player_slot, matchStats[i].radiant_win) === true){
      allHeroesGames[heroID].wins += 1
      allHeroesGames[heroID].partysize[tempPartySize].wins += 1
    } else {
      allHeroesGames[heroID].losses += 1
      allHeroesGames[heroID].partysize[tempPartySize].losses += 1
    }
  }

  totals.games =(matchStats.length)
  let avgObj = {'kills': (totals.kills / matchStats.length).toFixed(2), 'deaths': (totals.deaths / matchStats.length).toFixed(2), 'assists': (totals.assists / matchStats.length).toFixed(2)}

  return ({"averages": avgObj, "totals": totals, "allHeroRecord": allHeroesGames})
}

exports.fetchHeroes = async function (req, res) {
  // console.log(req.query)
  let heroesRef = db.collection('heroes')

  heroesRef.get()
  .then(snapshot => {
    try{
      let returnJson = {}
      if(snapshot.empty){
        console.log('no results in heroes')
        let heroesList = fetch('https://api.opendota.com/api/heroes', {
          method: 'get',
          headers: { 'Content-Type': 'application/json' },
        })
        .then(data => data.json())
        .then((json) => {
          // console.log('search results: ', json[0])
          let storeObj = {
            'herolist': json,
            'lastUpdated': (Date.now() / 1000).toFixed(0)
          }

          heroesRef.add(storeObj).then(ref => {
            console.log('Added document with ID: ', ref.id);
          });
          returnJson = json
        });
      } else {
        console.log('[/heroes] Pulling cached heroes')
        snapshot.forEach(doc => {
          console.log('[/heroes] found cached heroes doc', doc.id)
          let returnData = doc.data()
          returnJson = returnData['herolist']
        })
      }

    res.send(returnJson)
    }
    catch(e){ console.error(e)}
  })
}

exports.searchUser = async function (req, res) {
  // console.log(req.query)
  let userStats = await fetch('https://api.opendota.com/api/search?q=' + req.query.searchString, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' },
  })
  .then(data => data.json())
  .then((json) => {
    // console.log('search results: ', json)
    res.send(json)
  });
}

async function fetchUserData (userID) {
  console.log('[EXTERNAL] fetching user data for ', userID)
  return await fetch('https://api.opendota.com/api/players/' + userID, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' },
  })
  .then(data => data.json())
  .then((json) => {
    // console.log('user data complete', json)
    return json
  })
  .catch(e => {
    console.error(e)
  });
}

exports.queryFirebase = async function (req, res) {
  let usersRef = db.collection('users')
  let returnObj = {
    keys: [],
    values: []
  }
  usersRef.where('profile.account_id','==', 65110965).get()
    .then(snapshot => {
      if(snapshot.empty){
        res.send({'nothin': true})
      } else {
        snapshot.forEach(doc => {
          console.log(doc.id)
          returnObj.keys.push(doc.id)
          returnObj.values.push(doc.data())
        })
        res.send(returnObj)
      }
    })
}

exports.getUserStatsfromOD = async function (req, res) {
  let usersRef = db.collection('users')
  let userID = req.params.dotaID
  let userStats = {}

  let userExists = await usersRef.where('profile.account_id','==', parseInt(userID)).get()
  .then(snapshot => {
    if(snapshot.empty){
      return false
    } else {
      // console.log('[gusfod] found userID: ' + userID)
      snapshot.forEach(doc => {
        let returnData = doc.data()
        // console.log(doc.id, returnData)
        userStats = returnData
      })
      return true
    }
  })
  
  console.log('[gusfod] user with id ' + userID + ' exists: ' + userExists)
  if(userExists === false) {
    console.log('[gusfod] pulling new user data from OD')
    userStats = await fetchUserData(userID)
    userStats.lastUpdated = Date.now()
    usersRef.doc(userID).set(userStats).then(ref => {
      console.log('[gusfod] Added userID ' + userID);
    });
  }

  let matchStats = await match.fetchMatches(req.params.dotaID)

  let calcObj =  await processPlayerInfo(matchStats)
  let returnObj = {"userStats": userStats, "matchStats": matchStats, "averages": calcObj.averages, "totals": calcObj.totals, "calculations": calcObj}

  res.send(returnObj)
}