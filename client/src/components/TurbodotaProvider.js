import React, { useEffect, useState} from 'react' 
import TurbodotaContext from './TurbodotaContext'
import axios from 'axios'

export default function Page({children}){
  const [selectedUser, setSelectedUser] = useState({});
  const [userID, setUserID] = useState('')
  const [heroesList, setHeroesList] = useState([])

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
    async function getUserByID(id) {
      if(id.length > 3 && (id !== '' || id !== undefined) ){
        console.log(id)
        try {
          axios.get(`/api/players/${id}`)
          .then(res => {
            let content = res.data;
            content.matchStats = content.matchStats.slice(0,19)
            console.log(content.matchStats)
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

  useEffect(() => {
    console.log('user id set: ', userID)
  }, [userID])

  const value={selectedUser, setSelectedUser, userID, setUserID, heroesList}

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