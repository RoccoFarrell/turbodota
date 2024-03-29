'use strict'
const passport = require('passport')

module.exports = function (app) {
  const auth = require('../controllers/authController')
  const od = require('../controllers/openDotaController')
  const user = require('../controllers/userController')
  const town = require('../controllers/townController')
  const match = require('../controllers/matchController')

  const environment = process.env.NODE_ENV || 'development'

  // Simple route middleware to ensure user is authenticated.
  //   Use this route middleware on any resource that needs to be protected.  If
  //   the request is authenticated (typically via a persistent login session),
  //   the request will proceed.  Otherwise, the user will be redirected to the
  //   login page.
  function ensureAuthenticated(req, res, next) {
    console.log('ensureAuthenticated')
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/');
  }

  //routes
  //user endpoints
  app.route('/api/auth/:uid')
    .get(auth.userCheck)

  app.route('/api/user/:uid')
    .post(user.updateUser)

  app.route('/api/users/')
    .get(user.getAllUsers)

  app.route('/api/users/bySteamID/:steamID')
    .get(user.getUserBySteamID)

  app.route('/api/users/:steamID/link')
    .get(user.linkBySteamID)

  app.route('/api/steamUser')
  .get(user.returnSteamUser)
      
  app.route('/api/players/:dotaID/matches')
    .get(match.fetchMatchesForUser)
  
  app.route('/api/players/:dotaID/matchesByHero/:heroID')
    .get(match.fetchMatchesByHeroForUser)

  //gets users stats by Dota ID 
  app.route('/api/players/:dotaID')
    .get(od.getUserStatsfromOD)

  //match endpoints
  app.route('/api/matches/:matchID')
    .get(match.fetchMatchByID)

  app.route('/api/request/:matchID')
    .post(match.parseMatchRequest)
  
  //general endpoints
  app.route('/api/search')
    .get(od.searchUser)

  app.route('/api/heroes')
    .get(od.fetchHeroes)

  //---------------------------
  //town endpoints
  app.route('/api/towns/:steamID')
    .post(town.modifyQuest)
    .get(town.getTownForUser)

  app.route('/api/towns')
    .get(town.getAllTowns)

  app.route('/api/towns/:steamID/purchaseItem/:itemID')
    .post(town.purchaseItemFromShop)

  //---------------------------
  //auth endpoints
  app.get('/account', ensureAuthenticated, function(req, res){
    res.render('account', { user: req.user });
  });
  
  app.get('/auth/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
  
  // GET /auth/steam
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  The first step in Steam authentication will involve redirecting
  //   the user to steamcommunity.com.  After authenticating, Steam will redirect the
  //   user back to this application at /auth/steam/return
  app.get('/auth/steam',
    passport.authenticate('steam', { failureRedirect: '/' }),
    function(req, res) {
      res.redirect('/');
    });
  
  // GET /auth/steam/return
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  If authentication fails, the user will be redirected back to the
  //   login page.  Otherwise, the primary route function function will be called,
  //   which, in this example, will redirect the user to the home page.
  app.get('/auth/steam/return',
      function(req, res, next) {
        req.url = req.originalUrl;
        next();
    }, 
    passport.authenticate('steam', { failureRedirect: '/' }),
    async function(req, res) {
      //console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
      console.log(`req.user: ${JSON.stringify(req.user)}`)
      let account_id = await user.searchBySteamID(req.user.id)
      if(account_id) {
        res.redirect('/users/' + account_id + '/town/home');
      } else {
        res.redirect('/');
      }
    });
  
  if(environment === 'development'){
    console.log('debug controller active')
    const debug = require('../controllers/debugControllers/overallController.js')

    //debug routes
    app.route('/api/debug/test')
      .get(debug.test)

    app.route('/api/debug/createBackup')
      .post(debug.createBackup)

    app.route('/api/debug/editAllTowns')
      .post(debug.editAllTowns)

    app.route('/api/debug/towns/:steamID/addQuest')
      .get(debug.addQuestToTown)

    app.route('/api/debug/towns/:steamID/complete')
      .post(debug.completeQuests)
    
    app.route('/api/debug/towns/:steamID/completeQuestWithFakeMatch/:questID')
      .get(debug.completeQuestWithFakeMatch)

    app.route('/api/debug/towns/addNewFields')
      .get(debug.addFieldsToAllTowns)

    app.route('/api/debug/items/rebuildItems')
      .post(debug.rebuildItemsCollection)
    
    app.route('/api/queryFirebase')
      .get(od.queryFirebase)
  }
}
