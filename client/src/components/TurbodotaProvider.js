import React, { useEffect, useState} from 'react' 
import TurbodotaContext from './TurbodotaContext'
import axios from 'axios'

export default function Page({children}){
  const [selectedUser, setSelectedUser] = useState({});
  const [userID, setUserID] = useState('')
  const [heroesList, setHeroesList] = useState([])
  const [steamUser, setSteamUser] = useState({})
  const [authorizedUser, setAuthorizedUser] = useState(false)

  useEffect(() => {
    async function getHeroes(){
      try {
        axios.get(`/api/heroes`)
        .then(res => {
          let content = res.data;
          setHeroesList(content)
        })
        .catch(e => {
          console.log(e)
        })
        
      } catch(e) {console.error(e)}
    }
    getHeroes()
  }, [])

  useEffect(() => {
    async function getSteamUser(){
      try {
        axios.get(`/api/steamUser`)
        .then(res => {
          let content = res.data;
          //console.log(content)
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
        try {
          axios.get(`/api/players/${id}`)
          .then(res => {
            let content = res.data;
            // console.log(content.matchStats)
            setSelectedUser(content)
          })
          .catch(e => {
            console.log(e)
          })
        } catch(e) {console.error(e)}
      }
    }
    getUserByID(userID)
  }, [userID])

  // useEffect(() => {
  //   console.log('user id set: ', userID)
  // }, [userID])

  //check authorized user
  const checkAuthorizedUser = (selectedUser, steamUser) => {
    if(!!selectedUser.userStats && !!selectedUser.userStats.profile.steamid && !!steamUser.id) {
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
  
  const value={selectedUser, setSelectedUser, userID, setUserID, heroesList, steamUser, authorizedUser}

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