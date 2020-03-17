import React, { useEffect, useState} from 'react' 
import TurbodotaContext from './TurbodotaContext'
import axios from 'axios'

export default function Page({children}){
  const [selectedUser, setSelectedUser] = useState({});
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

  const value={selectedUser, setSelectedUser, heroesList}

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