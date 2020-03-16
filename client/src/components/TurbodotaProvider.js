import React, { useEffect, useState} from 'react' 
import TurbodotaContext from './TurbodotaContext'

export default function Page({children}){
  const [selectedUser, setSelectedUser] = useState({});
  const value={selectedUser, setSelectedUser}

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