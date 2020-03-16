import React from 'react';
import { Pane, Text, Heading, SearchInput, ThemeProvider, defaultTheme, majorScale } from 'evergreen-ui'
import {
  Card,
  Image
} from 'semantic-ui-react'

export default function SearchResults(props) {

  let searchResults = props.searchResults
  console.log(searchResults)
  let handleUserSelect = props.handleUserSelect


  const formatDate = (inputDate) => {
    let dateString = ''
    if(inputDate === undefined || inputDate === ''){
      dateString = ''
    } else {
      let tempDate = new Date(inputDate)
      dateString = tempDate.toLocaleDateString()
    }

    return dateString
    
  } 

  return (
    <Card.Group 
      itemsPerRow={6}
      style={{ margin: '1em', width: '90%'}}
    >
      {searchResults.map(player => (
          <Card
            width='100%'
            key={player.account_id}
            onClick={() => {
              handleUserSelect(player)
            }}
          >
            <Card.Content>
              <Image 
                src={player.avatarfull}
                floated='left'
                size='mini'
              />
              <Card.Header>{player.personaname}</Card.Header>
              <Card.Description>Last Played: {formatDate(player.last_match_time)}</Card.Description>

            </Card.Content>
          </Card>
      ))}
    </Card.Group>
  )
}

