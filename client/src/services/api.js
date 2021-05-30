// api.js
import axios from 'axios'

import { handleResponse, handleError } from './response'

axios.defaults.headers.get['Accept'] = 'application/json'
axios.defaults.headers.post['Accept'] = 'application/json'

const searchByString = async (searchText) => {
  try {
    let results = []
    await axios.get(`/api/search?searchString=${searchText}`)
    .then(res => {
      let content = res.data;
      results = content
    })
    .catch(e => {
      console.log(e)
    })
    return results
  } catch(e) {console.error(e)}
}

const getHeroes = async () => {
  try {
    let results = []
    await axios.get(`/api/heroes`)
    .then(res => {
      let content = res.data;
      results = content
    })
    .catch(e => {
      console.log(e)
    })
    return results
  } catch(e) {console.error(e)}
}

const getTown = async (userID) => {
  try {
    let results = {}
    await axios.get(`/api/towns/${userID}`)
    .then(res => {
        let content = res.data;
        console.log('content: ', content)
        results = content
    })
    return results
  } catch(e) {console.error(e)}
}

const getUserByDotaID = async (dotaID) => {
  try {
    let results = {}
    await axios.get(`/api/players/${dotaID}`)
    .then(res => {
      let content = res.data;
      results = content
    })
    .catch(e => {
      console.log(e)
    })
    return results
  } catch(e) {console.error(e)}
}

export default {
  searchByString: searchByString,
  getHeroes: getHeroes,
  getTown: getTown,
  getUserByDotaID: getUserByDotaID
  //getItems: params => axios.get('/api/items', { params }),
  //createItem: item => axios.post('/api/items', item),
  // etc.
}