'use strict'
const db = require('../db')
var usersRef = db.collection('users')
var OD = require('./openDotaController')

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

exports.getUserBySteamID = (req, res) => {

}

exports.getAllUsers = function (req, res) {
  // console.log('hitting get all users in api')
  var query = usersRef.get()
    .then(snapshot => {
      let userArr = []
      snapshot.forEach(userDoc => {
        let userData = userDoc.data()

        userArr.push(userData)
      });
      // console.log(userArr)
      res.send({ "users": userArr })
    })
    .catch(err => {
      console.log('Error getting users', err);
    });
}
