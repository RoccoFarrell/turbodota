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

exports.returnSteamUser = async function(req, res) {
  let user = req.user

  console.log('user in returnSteamUser: ', user, 'bool val: ', !!user)
  if(!!user){
    let result = await searchDBBySteamID(user.id)
    console.log('search by steam ID in returnSteamUser: ', result)
    user.dotaID = result 
  }
  
  res.send(user)
}

async function searchDBBySteamID(steamID) {
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

exports.searchBySteamID = async function (steamID) {
  return await searchDBBySteamID(steamID)
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
}