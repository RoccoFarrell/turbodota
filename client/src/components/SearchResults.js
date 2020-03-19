import React from 'react';
import {
  Card,
  Image
} from 'semantic-ui-react'
import './SearchResults.css';

export default function SearchResults(props) {

  let searchResults = props.searchResults
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
    <Card.Group id="cardGroup"
      itemsPerRow={4}
    >
      {!!searchResults ? 
      searchResults.filter(result => result.last_match_time !== undefined).map(player => (
        <Card id="card"
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
      )) : ''}
    </Card.Group>
  )
}

