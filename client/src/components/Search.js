import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from "react-router-dom";
import { Container, Image, Input, Header } from 'semantic-ui-react'

import '../App.css';
import './Search.css';

import logo from '../assets/turbologo.png';

import TurbodotaContext from './TurbodotaContext'
import SearchResults from './SearchResults'
import api from '../services/api'

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
    console.log(player)
    history.push("/users/" + player.account_id + "/town/home")
  }

  const dummyResults = [
    {
      account_id: 65110965,
      personaname: "The Dog Petter",
      avatarfull: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/6f/6f8292e77e9ae4384e0028668c7b7b0049bd1ee5_full.jpg",
      last_match_time: "Test"
    },
    {
      account_id: 423076846,
      personaname: "Toph",
      avatarfull: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg",
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
    },
    {
      account_id: 67762413,
      personaname: "Dubbya T",
      avatarfull: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/30/30f30ebab1ffcd2f8fca4c42c292ae5a517d8230_full.jpg",
      last_match_time: "Test"
    },
    {
      account_id: 113003047,
      personaname: "Type 1 Diabetes",
      avatarfull: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/3e/3edcc029122084bb4478cf8d774b71a5f17e2402_full.jpg",
      last_match_time: "Test"
    },
    {
      account_id: 32756728,
      personaname: "Bobby Backshots",
      avatarfull: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/19/1907b6ce5fbfae8ba0d9952ef190276ac6b57f0f_full.jpg",
      last_match_time: "Test"
    }    
  ]

  useEffect(() => {
    async function searchUser(){
      let results = await api.searchByString(searchText)
      if(results) setSearchResults(results)
    }

    if(searchText !== ''){
      searchUser()
    }
  }, [searchText])

  return (
    <Container id="container" style={{ height: 'max-content'}}>
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
