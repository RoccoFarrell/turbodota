import React, { useState, useEffect, useContext } from 'react';
import '../App.css';
import axios from 'axios'
import { Container, Image, Input, Header } from 'semantic-ui-react'

import logo from '../assets/turbologo.png';
import { useHistory } from "react-router-dom";
import TurbodotaContext from './TurbodotaContext'
import SearchResults from './SearchResults'

function Home() {
  const [searchText, setSearchText] = useState('MeP Dubby')
  const [searchResults, setSearchResults] = useState([])
  let history = useHistory()
  const { setUserID } = useContext(TurbodotaContext);

  const processSearch = async (inputText) => {
    setSearchText(inputText)
  }

  const handleUserSelect = (player) => {
    setUserID('')
    history.push("/users/" + player.account_id)
  }

  useEffect(() => {
    async function searchUser(){
      try {
        axios.get(`/api/search?searchString=${searchText}`)
        .then(res => {
          let content = res.data;
          setSearchResults(content)
        })
        .catch(e => {
          console.log(e)
        })
        
      } catch(e) {console.error(e)}
    }

    if(searchText !== ''){
      searchUser()
    }
  }, [searchText])

  return (
    <Container style={{
      height:'100vh',
      width:'100%',
      display:"flex",
      alignItems:"center",
      justifyContent:"flexBegin",
      border:"default",
      background:'tint2',
      flexDirection:'column',
      overflow:'auto',
      paddingY:'16px'
    }}>
      <Container style={{
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          width:"250px"
      }}>
        <Image 
          src={logo} 
          alt='turbologo'
        />
      </Container>
      <Container style={{
        display:'flex',
        alignItems:"center",
        justifyContent:"center",
        flexDirection:'column',
        width:'100%',
        margin:'12px'
      }}>
        <Header style={{
          fontSize:"70px",
          height:"75px",
          fontFamily:'inherit',
          padding:"4px"
        }}>
            TurboDota
        </Header>
        <Header style={{
          fontSize:"25px",
          fontFamily:"inherit"
        }}>
          The Tracker for Turbo
        </Header>
      </Container>
      <Container style={{ 
        width:"90%",
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        margin:'8px'
       }}>
        <Input style={{ width:"100%" }}
          placeholder="Search by name or steam ID" 
          onKeyPress={e => {
            if(e.key === 'Enter') processSearch(e.target.value)
          }}
        />
      </Container>
      { searchResults.length > 0 ? 
        <SearchResults
          searchResults = { searchResults }
          handleUserSelect = { handleUserSelect }
        />
      : 
        <Header
          size='500px'
        >
          Search a player or steam ID to get started!
        </Header>
      }
    </Container>
  );
}

export default Home;
