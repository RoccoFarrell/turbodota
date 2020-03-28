const fetch = require('node-fetch');
const db = require('../db')
const admin = require("firebase-admin");
const matchesRef = db.collection('matches')

function calculateAdvancedMetrics(matchStats) { 
  let keys = []
  Object.keys(matchStats).forEach(key => {
    keys.push(key)
  })
  // console.log(keys)

  let aggregatedMatchStats = []

  function calculateWardRank(player_slot) {
    // matchStats.players.forEach(player => {
    // })
    return []
  }

  matchStats.players.forEach(player => {  
    aggregatedMatchStats.push({
      player_slot: player.player_slot,
      ward_rank: calculateWardRank(player.player_slot)
    })
  })

  return aggregatedMatchStats
}

async function processMatch (match) {
  let matchID = match.match_id.toString()
  console.log('[processMatch] processing for matchID: ' + matchID)

  //set lastUpdated
  match.lastUpdated = Date.now()

  //calculate advanced stats
  match.calculated = calculateAdvancedMetrics(match)

  //set parsedFlag
  if(match.players[0].damage_targets === null){
    match.isMatchParsed = false
  } else {
    match.isMatchParsed =  true
  }

  return match
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

  let processedMatchStats = await processMatch(matchStats)

  //add to DB
  matchesRef.doc(processedMatchStats.match_id.toString()).set(processedMatchStats).then(ref => {
    console.log('[umop] Processed and added matchID ' + matchID);
  });
        
}

async function fetchMatches(userID, startDate) {
  console.log('[matches] fetching matches for user ', userID)
  
  let url = ''
  if(!!startDate){
    startDate = new Date(startDate * 1000)
    console.log('[matches] start date present in query, fetching matches after ', startDate.toLocaleString())
    let rightNow = new Date()
    
    let t_diff = rightNow.getTime() - startDate.getTime()

    let d_diff = Math.floor(t_diff / (1000 * 3600 * 24)) + 1; 
    // console.log('days: ', Math.floor(d_diff))

    url = 'https://api.opendota.com/api/players/' + userID + '/matches?significant=0&game_mode=23' + '&date=' + d_diff
  } else {
    console.log('[matches] no start date, fetching all matches for user '+ userID)
    url = 'https://api.opendota.com/api/players/' + userID + '/matches?significant=0&game_mode=23'
  } 
  
  return await fetch(url, {
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

exports.fetchMatches = fetchMatches

exports.fetchMatchesForUser = async function (req, res) {
  console.log('fetch matches for user')
  let userID = req.params.steamID
  let matches = await fetchMatches(userID, req.query.date)
  res.send(matches)
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
      snapshot.forEach(async (doc) => {
        let returnData = doc.data()
        // console.log(doc.id, returnData)

        //process match stats
        let processedMatchStats = await processMatch(returnData)

        //no add to db since already in db
        matchStats = processedMatchStats
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
    .then(async (json) => {
      // console.log(json)

      //process match stats
      let processedMatchStats = await processMatch(json)
      //console.log(processedMatchStats)
      //console.log("matchid: ", processedMatchStats.match_id)

      //add to DB
      matchesRef.doc(processedMatchStats.match_id.toString()).set(processedMatchStats).then(ref => {
        console.log('[processMatch] Processed and added matchID ' + matchID);
      });
      
      return processedMatchStats
    });
  }

  // calculate ALL the match stats right here bro
  res.send(matchStats)
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


