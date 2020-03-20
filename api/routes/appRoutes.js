'use strict'

module.exports = function (app) {
  var auth = require('../controllers/authController')
  var od = require('../controllers/openDotaController')
  var user = require('../controllers/userController')

  /*
  app.route('/').get(function (req, res) {
    res.send('Welcome')
  })
  */
  app.route('/api/auth/:uid')
    .get(auth.userCheck)

  app.route('/api/user/:uid')
    .post(user.updateUser)

  app.route('/api/search')
    .get(od.searchUser)

  app.route('/api/users/')
    .get(user.getAllUsers)

  app.route('/api/heroes')
    .get(od.fetchHeroes)

  app.route('/api/players/:steamID')
    .get(od.getUserStatsfromOD)

  app.route('/api/matches/:matchID')
    .get(od.fetchMatchByID)

  app.route('/api/queryFirebase')
    .get(od.queryFirebase)
}
