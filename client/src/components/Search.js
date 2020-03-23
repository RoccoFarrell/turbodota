import React, { useState, useEffect, useContext } from 'react';
import '../App.css';
import axios from 'axios'
import { Container, Image, Input, Header, Search } from 'semantic-ui-react'
import './Search.css';

import logo from '../assets/turbologo.png';
import { useHistory } from "react-router-dom";
import TurbodotaContext from './TurbodotaContext'
import SearchResults from './SearchResults'

function Home() {
  const [searchText, setSearchText] = useState('')
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

  const dummyResults = [
    {
      account_id: 65110965,
      personaname: "The Dog Petter",
      avatarfull: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/6f/6f8292e77e9ae4384e0028668c7b7b0049bd1ee5_full.jpg",
      last_match_time: "Test"
    },
    {
      account_id: 80636612,
      personaname: "DINO IS HERE TO RAWR",
      avatarfull: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/77/77815904fc01d5a5106ac6e15dbee55b03ff8f03_full.jpg",
      last_match_time: "Test"
    },
    {
      account_id: 125251142,
      personaname: "MeP Notorious",
      avatarfull: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/cf/cfb9bb1fda977764934d256ff462e79117781653_full.jpg",
      last_match_time: "Test"
    },
    {
      account_id: 34940151,
      personaname: "Slippypeppy",
      avatarfull: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/cd/cd0698fec9ad59f69648ea6c26c326a06ae55e95_full.jpg",
      last_match_time: "Test"
    },
    {
      account_id: 68024789,
      personaname: "MeP Dubby",
      avatarfull: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/a3/a3321d3442c5091fdd560ac74bd69ca166fb102d_full.jpg",
      last_match_time: "Test"
    }
  ]

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
    <Container id="container" style={{ height: 'fit-content'}}>
      <Container id="imageContainer">
        <Image 
          src={logo} 
          alt='turbologo'
        />
      </Container>
      <Container id="textContainer">
        <Header id="title">TurboDota</Header>
        <Header id="description">The Tracker for Turbo</Header>
      </Container>
      <Container id="inputContainer">
        <Input
          //id="userInput"
          style = {{ width: '100%'}}
          icon='search'
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
        <Container fluid style={{ width: '100%', display: 'flex', flexDirection:'column', alignItems: 'center', justifyContent: 'center', padding: '4em'}}>
          <Header size='large'>
            Popular Players by MMR
          </Header>
          <SearchResults
            searchResults = { dummyResults }
            handleUserSelect = { handleUserSelect }
          />
        </Container>
      }
    </Container>
  );
}

export default Home;