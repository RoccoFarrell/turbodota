//const https = require('https')
const fetch = require('node-fetch');
const db = require('../db')
const admin = require("firebase-admin");
// const firebase = admin.app();
const matchesRef = db.collection('matches')

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

async function processMatch (match) {
  let matchID = match.match_id.toString()
  console.log('[processMatch] processing for matchID: ' + matchID)

  //set lastUpdated
  match.lastUpdated = Date.now()

  //set parsedFlag
  if(match.players[0].damage_targets === null){
    match.isMatchParsed = false
  } else {
    match.isMatchParsed =  true
  }
  
  matchesRef.doc(matchID).set(match).then(ref => {
    console.log('[processMatch] Processed and added matchID ' + matchID);
    return true
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
  let matchID = req.params.matchID
  let matchStats = {}

  let matchExists = await matchesRef.where('match_id','==', parseInt(matchID)).get()
  .then(snapshot => {
    if(snapshot.empty){
      return false
    } else {
      // console.log('[fmbi] found matchID: ' + matchID)
      snapshot.forEach(doc => {
        let returnData = doc.data()
        // console.log(doc.id, returnData)
        matchStats = returnData
      })
      return true
    }
  })
  
  console.log('[fmbi] match with id ' + matchID + ' exists: ' + matchExists)

  if(matchExists === false) {
    console.log('[fmbi] pulling new match data from OD')
    matchStats = await fetch('https://api.opendota.com/api/matches/' + req.params.matchID, {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(data => data.json())
    .then((json) => {
      // console.log(json)
      return json
    });

    await processMatch(matchStats)
  }

  // calculate ALL the match stats right here bro
  res.send(matchStats)
}

async function updateMatchOnParse (jobID_obj, matchID){
  let jobID = jobID_obj.job.jobId
  let parseComplete = false 
  let count = 0
  console.log('[umop] parse with jobID ' + jobID)

  async function wait(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }

  while(parseComplete === false){
    await wait(3000)

    let parseDone = await fetch('https://api.opendota.com/api/request/' + jobID, {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(data => data.json())
    .then((json) => {
      return json
    });

    if(parseDone === null) parseComplete = true
  }

  console.log('[umop] pulling new match data from OD')
  matchStats = await fetch('https://api.opendota.com/api/matches/' + matchID, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' },
  })
  .then(data => data.json())
  .then((json) => {
    return json
  });

  await processMatch(matchStats)
}

exports.parseMatchRequest = async function (req, res) {
  let jobID = await fetch('https://api.opendota.com/api/request/' + req.params.matchID, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
  })
  .then(data => data.json())
  .then((json) => {
    // console.log(json)
    return json
  });

  res.send(jobID)
  updateMatchOnParse(jobID, req.params.matchID)
}