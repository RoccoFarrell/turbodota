'use strict'
const fetch = require('node-fetch');
const db = require('../db')
var usersRef = db.collection('users')
var OD = require('./openDotaController')

let environment = process.env.NODE_ENV
if(environment) console.log(environment)
exports.updateUser = function (req, res) {
  // console.log('req.params')
  // console.log(req.params)
  // console.log('req.body')
  // console.log(req.body)

  var query = usersRef.where('firebaseid', '==', req.params.uid).get()
    .then(snapshot => {
      snapshot.forEach(userDoc => {
        userDoc.ref.update(req.body).then(ref => {

          // let userObj = req.body
          // OD_userinfo = OD.fetchUserByID(req.params.uid)

          console.log('Updated document with ID: ', ref.id);
          res.status(201)
          res.send({"status":"complete"})
        });
      });
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
}

exports.getAllUsers = function (req, res) {
  // console.log('hitting get all users in api')
  var query = usersRef.get()
    .then(snapshot => {
      let userArr = []
      snapshot.forEach(userDoc => {
        let userData = userDoc.data()
        if(!!userData.profile) userArr.push(userData)
      });
      // console.log(userArr)
      res.send({ "users": userArr })
    })
    .catch(err => {
      console.log('Error getting users', err);
    });
}

exports.searchBySteamID = async function (steamID) {
  let userStats = {}
  let userExists = false

  userExists = await usersRef.where('profile.steamid','==', steamID.toString()).get()
  .then(snapshot => {
    if(snapshot.empty){
      return false
    } else {
      console.log('[getUserBySteamID] found steamID: ' + steamID)
      snapshot.forEach(doc => {
        let returnData = doc.data()
        // console.log(doc.id, returnData)
        userStats = returnData
      })
      return userStats.profile.account_id
    }
  })

  return userExists
}

exports.getUserBySteamID = async function (req, res) {
  let usersRef = db.collection('users')
  let steamID = req.params.steamID
  let userStats = {}

  let userExists = await usersRef.where('profile.steamid','==', steamID.toString()).get()
  .then(snapshot => {
    if(snapshot.empty){
      return false
    } else {
      console.log('[getUserBySteamID] found steamID: ' + steamID)
      snapshot.forEach(doc => {
        let returnData = doc.data()
        // console.log(doc.id, returnData)
        userStats = returnData
      })
      return true
    }
  })

  if(userExists){
    res.send(userStats)
  } else res.send({'message':'no DB user found for id ' + steamID})
}

exports.linkBySteamID = async function (req, res) {
  let usersRef = db.collection('users')
  let steamID = req.params.steamID
  let userStats = {}

  console.log('[user] - SQL query for steamID ' + steamID)
  userStats = await fetch('https://api.opendota.com/api/explorer?sql=SELECT+%2A+FROM+players+WHERE+steamid+like+%27%25'+ steamID + '%25%27+LIMIT+1', {
    method: 'get',
    headers: { 'Content-Type': 'application/json' },
  })
  .then(data => data.json())
  .then((json) => {
    // console.log('search results: ', json)
    res.send(json)
  });

  // let userExists = await usersRef.where('profile.steamid','==', parseInt(userID)).get()
  // .then(snapshot => {
  //   if(snapshot.empty){
  //     return false
  //   } else {
  //     // console.log('[gusfod] found userID: ' + userID)
  //     snapshot.forEach(doc => {
  //       let returnData = doc.data()
  //       // console.log(doc.id, returnData)
  //       userStats = returnData
  //     })
  //     return true
  //   }
  // })

  // //05-05-21
  // //below needs to be rewritten to search steamID on OD and return dotaID
  // console.log('[gusfod] user with id ' + userID + ' exists: ' + userExists)
  // // if(userExists === false) {
  // //   console.log('[gusfod] pulling new user data from OD')
  // //   userStats = await fetchUserData(userID)
  // //   userStats.lastUpdated = Date.now()
  // //   usersRef.doc(userID).set(userStats).then(ref => {
  // //     console.log('[gusfod] Added userID ' + userID);
  // //   });
  // // }

  // let matchStats = await match.fetchMatches(req.params.steamID)

  // let calcObj =  await processPlayerInfo(matchStats)
  // let returnObj = {"userStats": userStats, "matchStats": matchStats, "averages": calcObj.averages, "totals": calcObj.totals, "calculations": calcObj}

  // res.send(returnObj)
}