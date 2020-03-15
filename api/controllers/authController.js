'use strict'
const db = require('../db')
var usersRef = db.collection('users')

exports.userCheck = function (req, res) {
  // console.log('req.params')
  // console.log(req.params)
  // console.log(req.headers)

  var query = usersRef.where('firebaseid', '==', req.params.uid).get()
      .then(snapshot => {
        // console.log(snapshot.size)
        if(snapshot.size === 0){
          console.log('No such user');

          let newUser = {
            'firebaseid': req.params.uid,
            'usertype': 'user',
          }
  
          db.collection('users').add(newUser).then(ref => {
            console.log('Added document with ID: ', ref.id);
            res.send(ref)
          });
        }
        else {
          snapshot.forEach(doc => {
            // console.log('found user' + doc.data().firebaseid)
            // console.log(doc.id, '=>', doc.data());
            res.send(doc.data())
          });       
        }
      })
      .catch(err => {
        console.log('Error: could not get user document', err);
        next(err)
      });
}
