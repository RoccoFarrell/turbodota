// Turbo Doto
// Copyright No Salt Studios 2020

const express = require('express')
const dotenvcfg = require('dotenv').config()
const app = express()
const port = process.env.PORT || 8081
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const logger = require('morgan');
const environment = process.env.NODE_ENV || 'development'

const apicache = require('apicache')

console.log('Running in env ' + environment)
// console.log(process.env)

app.use(bodyParser.urlencoded({ extended: true }))
// app.use(require('connect-history-api-fallback')())
app.use(bodyParser.json())
app.use(cors())
app.use(logger('dev'));

//only in dev env
console.log('Env: ' + environment)
if(environment === 'development'){
  // console.log('Caching API calls')
  // //implement cache
  // let cache = apicache.middleware
  // apicache.getPerformance
  // apicache.options({ debug: true })
  // app.use(cache('5 minutes'))
}

const routes = require('./api/routes/appRoutes')
routes(app)

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')))

//Serve non-API requests to static dir
if(environment !== 'development'){
  app.get('*', (req, res) => {
    console.log('received request not to API')
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
  });
}

app.use(function(req, res){
  res.sendStatus(404);
});

app.listen(port)

console.log('RESTful API online at ' + port)
