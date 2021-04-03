import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from "react-router-dom";
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
    Button
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

  const handleTownDataChange = (townData) => {
    setTownData(townData)
  }

  return (
      <Container id="container">
          { !!selectedUser.userStats ? (
              <h2>Welcome <strong style={{ fontStyle: 'bold', color: 'green'}}> { selectedUser.userStats.profile.personaname }</strong> </h2>
          ) : ''}
          <h2>ONLY THE BEST CAN BECOME <strong style={{ fontStyle: 'bold', color: 'red'}}>MAYOR OF TURBO TOWN</strong></h2>
          { enableReset ? (
            <div>
              <h3>OH HO YOU FOUND ME</h3>
              <Button>Reset Town</Button>
            </div>
          ) : ''}

          <Container fluid>
            { !!townData.active ?
              <div className={'flexRow'}>
                <Statistic.Group widths='one'>
                  <Statistic>
                    <Statistic.Value>
                      <Image src={goldIcon} className='circular inline' />
                      { townData.gold }
                    </Statistic.Value>
                    <Statistic.Label>Gold</Statistic.Label>
                  </Statistic>
                  <Statistic>
                    <Statistic.Value>
                      <Image src={xpIcon} className='circular inline' />
                      { townData.xp }
                    </Statistic.Value>
                    <Statistic.Label>XP</Statistic.Label>
                  </Statistic>
                </Statistic.Group>
                <Statistic.Group widths='one'>
                  <Statistic>
                    <Statistic.Value>
                      { townData.townStats.totalTownGames }
                    </Statistic.Value>
                    <Statistic.Label>Total Town Games</Statistic.Label>
                  </Statistic>
                  <Statistic>
                    <Statistic.Value>
                      { townData.townStats.nonTownGames }
                    </Statistic.Value>
                    <Statistic.Label>Non Town Games</Statistic.Label>
                  </Statistic>
                  <Statistic>
                    <Statistic.Value>
                      { townData.townStats.totalAttemptGames }
                    </Statistic.Value>
                    <Statistic.Label>Total Attempts</Statistic.Label>
                  </Statistic>
                </Statistic.Group>
              </div>
              : '' }
          </Container>
          
          <Container className={'flexRow'} fluid>
            { !!townData.active ? 
                <Quests 
                  townData={townData}
                  handleTownDataChange={handleTownDataChange}
                />
            : '' }
          </Container>
      </Container>
  )
}

export default TownHome;
