import React, { useState, useEffect, useContext } from 'react';
import '../App.css';
import axios from 'axios'
import { Pane, Text, Heading, SearchInput, ThemeProvider, defaultTheme, majorScale } from 'evergreen-ui'
import logo from '../assets/turbologo.png';
import { useHistory } from "react-router-dom";
import TurbodotaContext from './TurbodotaContext'
import UserData from './UserData';
import SearchResults from './SearchResults'

import {
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment,
  Card,
} from 'semantic-ui-react'

function Home() {
  const [searchText, setSearchText] = useState('DINO IS HERE TO RAWR')
  const [searchResults, setSearchResults] = useState([])
  let history = useHistory()
  const {selectedUser, setSelectedUser}= useContext(TurbodotaContext);

  const processSearch = async (inputText) => {
    setSearchText(inputText)
  }

  const handleUserSelect = (player) => {
    setSelectedUser(player)
    // history.push("/searchResults")
  }

  useEffect(() => {
    async function searchUser(){
      try {
        axios.get(`/api/search?searchString=${searchText}`)
        .then(res => {
          let content = res.data;
          console.log(content[0]);
          setSearchResults(content)
        })
        .catch(e => {
          console.log(e)
        })
        
      } catch(e) {console.error(e)}
    }

    if(searchText !== ''){
      console.log('effect text: ', searchText)
      searchUser()
    }
  }, [searchText])

  return (
    <Pane
      height='100vh'
      width='100%'
      // margin={majorScale(2)}
      display="flex"
      alignItems="center"
      justifyContent="flexBegin"
      border="default"
      background='tint2'
      flexDirection='column'
      overflow='auto'
    >
      <Pane>
        <img 
          src={logo} 
          alt='turbologo'
          width={250}
        />
      </Pane>
      <Pane
        display='flex'
        alignItems="center"
        justifyContent="center"
        flexDirection='column'
        width='100%'
        margin={majorScale(3)}
      >
        <Heading
          fontSize={70}
          height={75}
          fontFamily='inherit'
          padding={majorScale(1)}
        >
            TurboDota
        </Heading>
        <Text
          fontSize={25}
          fontFamily='inherit'
        >
          The Tracker for Turbo
        </Text>
      </Pane>
      <Pane
        width='90%'
        margin={majorScale(2)}
      >
        <SearchInput 
          placeholder="Search by name or steam ID" 
          width="100%" 
          // onChange={event => {
          //   processSearch(event.target.value)
          // }}
          onKeyPress={e => {
            // console.log(e.key)
            //e.preventDefault()
            if(e.key === 'Enter') processSearch(e.target.value)
          }}
          //value={searchText}
        />
      </Pane>
      { selectedUser ? 
        <UserData/>
      :
        console.log("BUSTED")
      }
      { searchResults.length !== 0 ? 
        <SearchResults
          searchResults = { searchResults }
          handleUserSelect = { handleUserSelect }
        />
      : 
        <Text
          size={500}
        >
          Search a player or steam ID to get started!
        </Text>
      }
    </Pane>
  );
}

export default Home;
