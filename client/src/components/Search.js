import React, { useState, useEffect, useContext } from 'react';
import '../App.css';
import axios from 'axios'
import { Pane, Text, Heading, SearchInput, ThemeProvider, defaultTheme, majorScale } from 'evergreen-ui'
import { Button } from 'semantic-ui-react'

import logo from '../assets/turbologo.png';
import { useHistory } from "react-router-dom";
import TurbodotaContext from './TurbodotaContext'
import UserData from './UserData';
import SearchResults from './SearchResults'

function Home() {
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState([])
  let history = useHistory()
  const {selectedUser, setSelectedUser}= useContext(TurbodotaContext);

  const processSearch = async (inputText) => {
    setSearchText(inputText)
  }

  const handleUserSelect = (player) => {
    setSelectedUser(player)
    setSearchResults([])
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
      paddingY={majorScale(4)}
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
        display='flex'
        alignItems='center'
        justifyContent='center'
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
          // value={searchText}
          // onChange={e => {
          //   console.log(e.target.value)
          // }}
        />
        {/* <Button
          onClick={e => {
            processSearch(searchText)
          }}
        >
          Search
        </Button> */}
      </Pane>
      {/* { selectedUser ? 
        <UserData/>
      :
        ''
      } */}
      { searchResults.length > 0 ? 
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
