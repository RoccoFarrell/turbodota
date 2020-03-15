import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios'
import { Pane, Text, Heading, SearchInput, ThemeProvider, defaultTheme, majorScale } from 'evergreen-ui'
import logo from './assets/turbologo.png';



function App() {
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const textTheme = {
    typography: {
      fontFamilies: {
        display: '"K2D", sans-serif',
        ui: '"K2D", sans-serif',
        mono: '"K2D", sans-serif'
      }
    },
    ...defaultTheme
  }

  const processSearch = async (inputText) => {
    // console.log('search: ', inputText)
    setSearchText(inputText)
  }

  useEffect(() => {
    async function searchUser(){
      try {
        axios.get(`/api/search?searchString=${searchText}`)
        .then(res => {
          let content = res.data;
          setSearchResults(content)
        })
        
      } catch(e) {console.error(e)}
    }

    if(searchText !== ''){
      console.log('effect text: ', searchText)
      searchUser()
    }
  }, [searchText])

  return (
    <ThemeProvider
      value={textTheme}
    >
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
              TurboDota.io
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
        { searchResults.length !== 0 ? 
          <Pane>
            {searchResults.map(player => (
              <Pane
                key={player.account_id}
              >
                {player.personaname}
              </Pane>
            ))}
          </Pane>
        : 
          <Text
            size={500}
          >
            Search a player or steam ID to get started!
          </Text>
        }
      </Pane>

    </ThemeProvider>

  );
}

export default App;
