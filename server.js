// Turbo Doto
// Copyright No Salt Studios 2021

const express = require('express')
const dotenvcfg = require('dotenv').config()
const app = express()
const port = process.env.PORT || 8081
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const environment = process.env.NODE_ENV || 'development'

//passport stuff
//const fs = require('fs')
const passport = require('passport')
const session = require('express-session')
const SteamStrategy = require('./lib/passport-steam').Strategy
const { v4: uuid } = require('uuid')
const FileStore = require('session-file-store')(session);

const apicache = require('apicache')

console.log('Running in env ' + environment)
// console.log(process.env)

app.use(bodyParser.urlencoded({ extended: true }))
// app.use(require('connect-history-api-fallback')())
app.use(bodyParser.json())
app.use(cors())

//only in dev env
console.log('Env: ' + environment)
if(environment === 'development'){
  const logger = require('morgan');
  app.use(logger('dev'));
  // console.log('Caching API calls')
  // //implement cache
  // let cache = apicache.middleware
  // apicache.getPerformance
  // apicache.options({ debug: true })
  // app.use(cache('5 minutes'))
}

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Steam profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.use(session({
  secret: 'amazing turbo secret invoker',
  name: 'turbodotaSessionID',
  user: {},
  store: new FileStore(),
  genid: (req) => {
    console.log('Inside the session middleware')
    console.log('req.sessionID inside genid:', req.sessionID)
    return uuid() // use UUIDs for session IDs
  },
  resave: false,
  saveUninitialized: true
}));

// Use the SteamStrategy within Passport.
//   Strategies in passport require a `validate` function, which accept
//   credentials (in this case, an OpenID identifier and profile), and invoke a
//   callback with a user object.
passport.use(new SteamStrategy({
    returnURL: (environment == 'development' ? 'http://localhost:3000/auth/steam/return' : 'https://www.turbodota.com/auth/steam/return'),
    realm: (environment == 'development' ? 'http://localhost:3000/' : 'https://www.turbodota.com/'),
    apiKey: 'EE3C24BAF27E921B77EFF80F9DBB969D'
  },
  function(identifier, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Steam profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Steam account with a user record in your database,
      // and return that user instead.
      //console.log('identifier inside strategy: ', identifier, profile)
      profile.identifier = identifier;
      return done(null, profile);
    });
}));

// app.use((req, res, next) => {
//   console.log('req: ', req.session)
//   next()
// })

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')))

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

//testing
// create the homepage route at '/'
app.get('/sessiontest', (req, res) => {
  console.log('Inside the homepage callback function')
  console.log(req.sessionID)
  res.send(`You hit home page!\n`)
})

//express router
const routes = require('./api/routes/appRoutes')
const { nextTick } = require('process')
routes(app)

//Serve non-API requests to static dir

app.get('*', (req, res) => {
  console.log('received request not to API')
  if(environment !== 'development'){
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
  } else {
    res.sendStatus(404);
  }
});

app.use(function(req, res){
  console.log('sending 404')
  res.sendStatus(404);
});

app.listen(port)

console.log('RESTful API online at ' + port)
