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

const getHeroesNew = async () => {
  try {
    let results = []
    await axios.get(`https://api.opendota.com/api/constants/heroes`)
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

const getItems = async () => {
  try {
    let results = []
    await axios.get(`https://api.opendota.com/api/constants/items`)
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

const getUsers = async () => {
  try {
    let results = []
    await axios.get(`/api/users`)
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

const getMatchesByHeroForPlayer = async (dotaID, heroID) => {
  try {
    let results = {}
    await axios.get(`/api/players/${dotaID}/matchesByHero/${heroID}`)
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

// const getUserBySteamID

export default {
  searchByString: searchByString,
  getHeroes: getHeroes,
  getHeroesNew: getHeroesNew,
  getItems: getItems,
  getTown: getTown,
  getUserByDotaID: getUserByDotaID,
  getUsers: getUsers,
  getMatchesByHeroForPlayer: getMatchesByHeroForPlayer
}