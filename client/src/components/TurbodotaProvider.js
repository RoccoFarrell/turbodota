import React, { useEffect, useState} from 'react' 
import axios from 'axios';
import TurbodotaContext from './TurbodotaContext'

//Custom hook
function useSetlists() {
  const [setlists, setSetlists] = useState({
    type: "",
    itemsPerPage: 0,
    page: 0,
    total: 0,
    setlist: []
  });

  useEffect(() => {
    console.log('Mounting or updating')
    async function fetchData() {
      axios.get(`http://localhost:4000/bands/umphreys.json`)
      .then(res => {
        let content = res.data;
        console.log(content)
        setSetlists(content)
      })
    }
    fetchData()
  }, [])
  return setlists
}

export default function Page({children}){
  const setlistObj = useSetlists();

  return (
    <TurbodotaContext.Provider
      value={{
        setlistObj
      }}
    >
        <div className="page">{children}</div>
    </TurbodotaContext.Provider>
  )
}