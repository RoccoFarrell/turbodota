import React, { useState, useEffect, useContext } from 'react';
import '../App.css';
import axios from 'axios'
import { Container, Image, Input, Header } from 'semantic-ui-react'
import './Search.css';

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
    <Container id="container">
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
        <Input id="userInput"
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
        <Header size='500px'>
          Search a player or steam ID to get started!
        </Header>
      }
    </Container>
  );
}

export default Home;
