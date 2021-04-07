import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useHistory } from "react-router-dom";
import TurbodotaContext from '../TurbodotaContext'
import axios from 'axios'
import {
    Container,
    Card,
    Icon,
    Image,
    Header,
    Statistic,
    Tab,
    Button,
    Progress
} from 'semantic-ui-react'
import './TownHome.css';

import Quests from './Quests/Quests'

import goldIcon from '../../assets/gold.png';
import xpIcon from '../../assets/xp.png';

function TownHome() {
  const {selectedUser, setSelectedUser, userID, setUserID} = useContext(TurbodotaContext);
  const [enableReset, setEnableReset] = useState(false)
  const [townData, setTownData] = useState({})

  const userData = selectedUser
  // console.log(userData)
  let location = useLocation()
  let history = useHistory()

  useEffect(() => {
    if (userID === undefined || userID === ''){
        let parsedUserID = location.pathname.split('/users/')[1].split('/')[0]
        console.log(parsedUserID)
        setUserID(parsedUserID)
    } else {
        console.log('userID: ', userID, 'userData: ', userData, 'selectedUser: ', selectedUser)
    }
  }, [])

  useEffect(() => {
    console.log('selectedUser: ', selectedUser)
    console.log('townData: ', townData)
  }, [selectedUser])

  useEffect(() => {
    async function getTownData(){
        try {
            axios.get(`/api/towns/${userID}`)
            .then(res => {
                let content = res.data;
                console.log('townData: ', content)
                // let returnDmg = calculateHeroDamage(matchOverview, content)
                setTownData(content)
            })
        
        } catch(e) {console.error(e)}
    }
    if(userID !== undefined && userID !== '') getTownData()
  }, [userID])

  const profilePicture = () => {
    return userData.userStats ? <Image style={{ marginRight: '1em' }} src={userData.userStats.profile.avatarfull} rounded /> : <div></div>
  }

  const handleTownDataChange = (townData) => {
    setTownData(townData)
  }

  const handleRouteChange = (route) => {
    console.log('changing route')
    if(route) history.push("/users/" + userID + '/' + route)
    else history.push("/users/" + userID)
}

  const panes = [
    {
      menuItem: 'Active',
      render: () => (
        <Container className={'flexRow'} fluid>
          { !!townData.active ? 
              <Quests 
                townData={townData}
                questGroup='active'
                handleTownDataChange={handleTownDataChange}
              />
          : '' }
        </Container>
        ),
    },
    {
      menuItem: 'Completed',
      render: () => (
        <Container className={'flexRow'} fluid>
          { !!townData.active ? 
              <Quests 
                townData={townData}
                questGroup='completed'
                handleTownDataChange={handleTownDataChange}
              />
          : '' }
        </Container>
        ),
    },
    {
      menuItem: 'Skipped',
      render: () => (
        <Container className={'flexRow'} fluid>
          { !!townData.active ? 
              <Quests 
                townData={townData}
                questGroup='skipped'
                handleTownDataChange={handleTownDataChange}
              />
          : '' }
        </Container>
        ),
    },
  ]

  return (
      <Container id="container">
          <Container id="topUserInfo">
            <Card fluid color='blue' id="topUserRow">
              <div id="nameRow">
                {profilePicture()}
                <div style={{ alignSelf: "center", paddingLeft: "1em" }}>
                  { !!selectedUser.userStats ? (
                    <div>
                      <h2><strong style={{ fontStyle: 'bold', color: '#2185d0'}}> { selectedUser.userStats.profile.personaname }</strong> </h2>
                      <h3>Level 2</h3>
                      <a href={"https://www.dotabuff.com/players/" + selectedUser.userStats.profile.account_id }>Dotabuff</a>
                    </div>
                  ) : ''}
                  {/* <h4>ONLY THE BEST CAN BECOME <strong style={{ fontStyle: 'bold', color: 'red'}}>MAYOR OF TURBO TOWN</strong></h4> */}
                </div>
              </div>
              <div style={{ flex: 1 }}>
              </div>
              { !!townData.active ?
              <div className="flexRow" style={{ flex: "0 1 30%"}}>
                  <div>
                    <Statistic.Group size="mini" widths='one'>
                      <Statistic horizontal>
                        <Statistic.Value>
                          { townData.townStats.totalTownGames }
                        </Statistic.Value>
                        <Statistic.Label className="tinyText">Town Games</Statistic.Label>
                      </Statistic>
                      <Statistic horizontal>
                        <Statistic.Value>
                          { townData.townStats.nonTownGames }
                        </Statistic.Value>
                        <Statistic.Label className="tinyText">Non-quest Games</Statistic.Label>
                      </Statistic>
                      <Statistic horizontal>
                        <Statistic.Value>
                          { townData.townStats.totalAttemptGames }
                        </Statistic.Value>
                        <Statistic.Label className="tinyText">Quest Attempts</Statistic.Label>
                      </Statistic>
                    </Statistic.Group>
                  </div>
                <div>
                  <Statistic.Group widths='one' size="tiny">
                    <Statistic size="mini">
                      <Statistic.Value>
                        <Image src={goldIcon} width="20px" className='circular inline' />
                        { townData.gold }
                      </Statistic.Value>
                      <Statistic.Label>Gold</Statistic.Label>
                    </Statistic>
                    <Statistic size="mini">
                      <Statistic.Value>
                        <Image src={xpIcon} width="20px" className='circular inline' />
                        { townData.xp }
                      </Statistic.Value>
                      <Statistic.Label>XP</Statistic.Label>
                    </Statistic>
                  </Statistic.Group>
                </div>

              </div>
              : '' }
              <div>
                <Button color='blue' style={{ marginTop: '1em' }} onClick={ () => {handleRouteChange()} }> User Stats </Button>
              </div>
            </Card>

          </Container>
          
          { enableReset ? (
            <div>
              <h3>OH HO YOU FOUND ME</h3>
              <Button>Reset Town</Button>
            </div>
          ) : ''}
          <Container id="progressContainer">
            <Progress percent={90} progress color='blue' active>
              XP to Next Level
            </Progress>
          </Container>
          <Container id="questContainer">
            <h2>Quests</h2>
           <Tab menu={{ secondary: true }} panes={panes} />
          </Container>
          
          {/* <Container className={'flexRow'} fluid>
            { !!townData.active ? 
                <Quests 
                  townData={townData}
                  questGroup='active'
                  handleTownDataChange={handleTownDataChange}
                />
            : '' }
          </Container> */}
      </Container>
  )
}

export default TownHome;
