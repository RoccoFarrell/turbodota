//const https = require('https')
const fetch = require('node-fetch');
const db = require('../db')
const admin = require("firebase-admin");
const firebase = admin.app();

async function processPlayerInfo(matchStats) {
  let totals = {'kills': 0, 'deaths': 0, 'assists': 0}
  for(let i = 0; i < matchStats.length; i++) {
    totals.kills += matchStats[i].kills
    totals.deaths += matchStats[i].deaths
    totals.assists += matchStats[i].assists
  }

  totals.games =(matchStats.length)
  let avgObj = {'kills': (totals.kills / matchStats.length).toFixed(2), 'deaths': (totals.deaths / matchStats.length).toFixed(2), 'assists': (totals.assists / matchStats.length).toFixed(2)}

  return ({"averages": avgObj, "totals": totals})
}

exports.fetchHeroes = async function (req, res) {
  // console.log(req.query)
  let heroesRef = db.collection('heroes')

  heroesRef.get()
  .then(snapshot => {
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
          'lastUpdated': Date.now()
        }

        heroesRef.add(storeObj).then(ref => {
          console.log('Added document with ID: ', ref.id);
        });
        res.send(json)
      });
    } else {
      console.log('[/heroes] Pulling cached heroes')
      snapshot.forEach(doc => {
        console.log('[/heroes] found cached heroes doc', doc.id)
        let returnData = doc.data()
        res.json(returnData['herolist'])
      })
    }
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

async function fetchMatchesForUser (userID) {
  console.log('[fmfu] fetching matches for user ', userID)
  return await fetch('https://api.opendota.com/api/players/' + userID + '/matches?significant=0&game_mode=23', {
    method: 'get',
    headers: { 'Content-Type': 'application/json' },
  })
  .then(data => data.json())
  .then((json) => {
    //console.log('matches data complete', json)
    return json
  })
  .catch(e => {
    console.error(e)
  });
}

async function fetchUserData (userID) {
  console.log('[fud] fetching user data for ', userID)
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
  let userID = req.params.steamID
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

  let matchStats = await fetchMatchesForUser(req.params.steamID)

  let calcObj =  await processPlayerInfo(matchStats)
  let returnObj = {"userStats": userStats, "matchStats": matchStats, "averages": calcObj.averages, "totals": calcObj.totals}

  res.send(returnObj)
}

exports.fetchMatchByID = async function (req, res) {
  let matchStats = await fetch('https://api.opendota.com/api/matches/' + req.params.matchID, {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
  })
  .then(data => data.json())
  .then((json) => {
    return json
  });

  res.send(matchStats)
}