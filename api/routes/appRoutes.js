'use strict'

module.exports = function (app) {
  const auth = require('../controllers/authController')
  const od = require('../controllers/openDotaController')
  const user = require('../controllers/userController')
  const town = require('../controllers/townController')

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

  app.route('/api/request/:matchID')
    .post(od.parseMatchRequest)

  app.route('/api/towns/:steamID')
    .get(town.getTownForUser)
}
