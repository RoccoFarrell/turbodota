import React, { useEffect, useState} from 'react' 
import TurbodotaContext from './TurbodotaContext'
import axios from 'axios'

import api from '../services/api'

export default function Page({children}){
  const [selectedUser, setSelectedUser] = useState({});
  const [userID, setUserID] = useState('')
  const [heroesList, setHeroesList] = useState([])
  const [gameItemsList, setGameItemsList] = useState([])
  const [steamUser, setSteamUser] = useState({})
  const [authorizedUser, setAuthorizedUser] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function getHeroes(){
      setLoading(true)
      let results = await api.getHeroes()
      if(results) setHeroesList(results)
      setLoading(false)
    }
    getHeroes()
  }, [])

  useEffect(() => {
    async function getItems(){
      var arr = []
      setLoading(true)
      let results = await api.getItems()
      if(results){
        for (var key in results) {
          let tempObj = results[key]
          tempObj.objName = key
          arr.push(tempObj)
        }
        setGameItemsList(arr)
      }
      setLoading(false)
    }
    getItems()
    
  }, [])

  useEffect(() => {
    async function getSteamUser(){
      try {
        axios.get(`/api/steamUser`)
        .then(res => {
          let content = res.data;
          console.log('steamUser in application: ', content)
          setSteamUser(content)
        })
        .catch(e => {
          console.log(e)
        })
        
      } catch(e) {console.error(e)}
    }
    getSteamUser()
  }, [])

  useEffect(() => {
    async function getUserByID(id) {
      if(id.length > 3 && (id !== '' || id !== undefined) ){
        setLoading(true)
        let results = await api.getUserByDotaID(id)
        if(results) setSelectedUser(results)
        setLoading(false)
      }
    }
    getUserByID(userID)
  }, [userID])

  // useEffect(() => {
  //   console.log('user id set: ', userID)
  // }, [userID])

  //check authorized user
  const checkAuthorizedUser = (selectedUser, steamUser) => {
    if(!!selectedUser.userStats && !!selectedUser.userStats.profile && !!selectedUser.userStats.profile.steamid && !!steamUser.id) {
      if(selectedUser.userStats.profile.steamid == steamUser.id) setAuthorizedUser(true)
      else setAuthorizedUser(false)
    }
    else setAuthorizedUser(false)
  }

  //check authorized user
  useEffect(() => {
    //console.log(selectedUser)
    //setUser(selectedUser)
    checkAuthorizedUser(selectedUser, steamUser)
  }, [selectedUser])
  
  const value={selectedUser, setSelectedUser, userID, setUserID, heroesList, gameItemsList, steamUser, authorizedUser, loading, setLoading}

  return (
    <TurbodotaContext.Provider
      value={
        value
      }
    >
        <div>{children}</div>
    </TurbodotaContext.Provider>
  )
}