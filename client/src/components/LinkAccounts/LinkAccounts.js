import React, { useState, useEffect, useContext } from 'react';
import '../../App.css';
import axios from 'axios'
import { 
  Container, 
  Image, 
  Input, 
  Header, 
  Icon,
  Segment,
  Button,
  Card
} from 'semantic-ui-react'
import './LinkAccounts.css';

import logo from '../../assets/turbologo.png';
import { useHistory } from "react-router-dom";
import TurbodotaContext from '../TurbodotaContext'
import SearchResults from '../SearchResults'
import steam_logo from '../../assets/steam_logo.png'
import square_logo from '../../assets/squareLogo.png';

function Home() {
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState([])
  let history = useHistory()
  const { setUserID, steamUser, setSteamUser } = useContext(TurbodotaContext);
  
  const processSearch = async (inputText) => {
    setSearchText(inputText)
  }

  const handleUserSelect = (player) => {
    setUserID('')
    console.log(player)
    history.push("/users/" + player.account_id + "/town/home")
  }

  const linkSteamID = async (steamID) => {
    console.log('linking steam ID: ', steamID)

    if(!!steamID && (steamID !== '' && steamID !== '0')){
      try {
          axios.get(`/api/users/${steamID}/link`)
          .then(res => {
              let content = res.data;
              console.log(content)
              //handleTownDataChange(content)
          })
      } catch(e) {console.error(e)}
    }
  }

  // async function getUserByID(id) {
  //   if(id.length > 3 && (id !== '' || id !== undefined) ){
  //     try {
  //       axios.get(`/api/players/${id}`)
  //       .then(res => {
  //         let content = res.data;
  //         // console.log(content.matchStats)
  //         setSelectedUser(content)
  //       })
  //       .catch(e => {
  //         console.log(e)
  //       })
  //     } catch(e) {console.error(e)}
  //   }
  // }

  // useEffect(() => {
  //   getUserByID(userID)
  // }, [steamUser])

  return (
    <Container id="container" style={{ height: 'max-content'}}>
      <Container id="textContainer">
        <Header id="title">Link Your Accounts!</Header>
        {/* <Segment>Link your Steam Account</Segment> */}
        <Button color='green' onClick={ () => {linkSteamID(steamUser.id)} }> Create My Town </Button>
      </Container>
      <Container>
        <div className={'linkAccountsFlexRow'}>
          <div className={'linkAccountsProfile'}>
            <div>
              { !!steamUser.id && !!steamUser.displayName ? (
                <div>
                  <Header as='h2'>
                    
                      
                      {/*  */}
                  </Header>
                  <Card>
                  <Image circular src={steamUser.photos[2].value} wrapped ui={false}/>
                  <Card.Content>
                    <Card.Header>{ steamUser.displayName.toString() }</Card.Header>
                    <Card.Meta>
                      <span>{ steamUser.id.toString() }</span>
                    </Card.Meta>
                    <Card.Description>
                      <div> { steamUser._json.loccountrycode + ' - ' + steamUser._json.locstatecode }</div>
                      <div> Since { new Date(steamUser._json.timecreated * 1000).toLocaleDateString("en-US") }</div>
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <Image size='mini' src={steam_logo} style={{ marginRight: '1em'}}/>
                    <span>Steam ID</span>
                  </Card.Content>
                </Card>
                </div>
              ):''}
            </div>
            {/* <div className = {'linkAccountsFlexRow'} style={{ marginTop: '1em', width: '100%'}}>
              
            </div> */}
            
          </div>
          <div>
            <Icon name='linkify' size='huge' color='yellow'/>
          </div>
          <div className={'linkAccountsProfile'}>
            <Card>
              <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped ui={false} />
              <Card.Content>
                <Card.Header>Matthew</Card.Header>
                <Card.Meta>
                  <span className='date'>Joined in 2015</span>
                </Card.Meta>
                <Card.Description>
                  Matthew is a musician living in Nashville.
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <Image size='mini' src={square_logo} style={{ marginRight: '1em'}}/>
                <span>Dota ID</span>
              </Card.Content>
            </Card>
          </div>
        </div>
      </Container>
    </Container>
  );
}

export default Home;
