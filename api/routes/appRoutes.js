'use strict'

module.exports = function (app) {
  const auth = require('../controllers/authController')
  const od = require('../controllers/openDotaController')
  const user = require('../controllers/userController')
  const town = require('../controllers/townController')
  const match = require('../controllers/matchController')

  const environment = process.env.NODE_ENV || 'development'

  // console.log(debug)
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

  app.route('/api/players/:steamID/matches')
    .get(match.fetchMatchesForUser)

  app.route('/api/players/:steamID')
    .get(od.getUserStatsfromOD)

  app.route('/api/matches/:matchID')
    .get(match.fetchMatchByID)

  app.route('/api/queryFirebase')
    .get(od.queryFirebase)

  app.route('/api/request/:matchID')
    .post(match.parseMatchRequest)

  app.route('/api/towns/:steamID')
    .post(town.completeQuest)
    .get(town.getTownForUser)

  app.route('/api/towns')
    .get(town.getAllTowns)

  if(environment === 'development'){
    const debug = require('../controllers/debugControllers/overallController.js')
    app.route('/api/debug/test')
      .get(debug.test)

    app.route('/api/debug/createBackup')
      .get(debug.createBackup)

    app.route('/api/debug/editAllTowns')
      .get(debug.editAllTowns)

    app.route('/api/debug/towns/:steamID/addQuest')
      .get(debug.addQuestToTown)

    app.route('/api/debug/towns/:steamID/complete')
      .post(debug.completeQuests)
  }
}
