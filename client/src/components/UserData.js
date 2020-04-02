import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useHistory } from "react-router-dom";
import TurbodotaContext from './TurbodotaContext'
import SingleMatch from './SingleMatch/SingleMatch'
import UserHeroTable from './UserHeroTable/UserHeroTable'
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
import './UserData.css';
import UserMatchHistory from './UserMatchHistory/UserMatchHistory';
import underConstruction from '../assets/construction.png';
import turboTownIcon from '../assets/turbotown.png';
import axios from 'axios'

function UserData() {
    const {selectedUser, setSelectedUser, userID, setUserID} = useContext(TurbodotaContext);
    const [townData, setTownData] = useState({})

    const userData = selectedUser
    let location = useLocation()
    let history = useHistory()

    useEffect(() => {
        if (userID === undefined || userID === ''){
            setUserID(location.pathname.split('/users/')[1])
        } else {
            console.log('userID: ', userID, 'userData: ', userData, 'selectedUser: ', selectedUser)
        }
    }, [])

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

    useEffect(() => {
        console.log(selectedUser)

    }, [selectedUser])

    function winOrLoss (slot, win) {
        if (slot > 127){
            if (win === false){
                return true
            }
            else return false
        }
        else {
            if (win === false){
                return false
            }
            else return true
        }
    }

    const calcWinLoss = (lastTen) => {
        let wins = 0
        let losses = 0
        lastTen.forEach(match => {
            if(winOrLoss(match.player_slot, match.radiant_win)) wins++
            else losses++
        })

        return(<div>
            <Statistic size='mini' color='green'> 
                <Statistic.Value>{wins}</Statistic.Value>
                <Statistic.Label style={{ fontSize: '12px'}}>Wins</Statistic.Label>
            </Statistic>
            <Statistic size='mini' color='red'> 
                <Statistic.Value>{losses}</Statistic.Value>
                <Statistic.Label style={{ fontSize: '12px'}}>Losses</Statistic.Label>
            </Statistic>
        </div>)
    }

    const panes = [
        {
          menuItem: 'Matches',
          pane: {
            key: 'pane1',
            attached: false,
            content: 
                (
                    <div>
                        
                        { !!userData.matchStats ? (
                            <div>
                                <div className = {'flexContainer'} style={{ flexDirection: 'column', justifyContent:'center'}}>
                                    <Header as='h2'>Last 10 Games</Header>
                                    <Header as='h3' style={{ marginTop: '0em' }}>{ calcWinLoss(userData.matchStats.slice(0,10)) }</Header>
                                </div>
                                <UserMatchHistory
                                    matchStats = { userData.matchStats }
                                />
                                
                            </div>  
                            )
                         : ''}
                    </div>
                ) 
          }
        },
        {
          menuItem: 'Heroes',
          pane: {
                key: 'pane2',
                attached: false,
                content: 
                    (
                        <div>
                            <Header as='h2'>All Heroes Played</Header>
                            { !!userData.calculations ? (
                            <UserHeroTable
                                heroStats = { userData.calculations.allHeroRecord }
                            />
                            ) : '' }
                        </div>
                    )
          } 
        }
      ]
    
    const handleRouteChange = (route) => {
        console.log('changing route')
        history.push("/users/" + userID + '/' + route)
    }

    return (
        <Container id="container">
            { !!userData.userStats ? (
                <Container id="results">
                    <div
                        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Card.Group style={{ width: '100%' }}>
                            <Card style={{ width: '200px', padding: '1em'}}>
                                <Image style={{ width: '150px'}} src={userData.userStats.profile.avatarfull} wrapped ui={false} />
                                <h2>{ userData.userStats.profile.personaname }</h2>
                                <Card.Header>ID: {userData.userStats.profile.account_id}</Card.Header>
                                <Card.Meta>
                                    <span>MMR Estimate: {userData.userStats.mmr_estimate.estimate}</span>
                                </Card.Meta>
                            </Card>
                            { !!townData.completed && !!townData.active && townData.townStats ? (
                            <Card id="playerCard3">
                            
                                <Card.Content>
                                    <Card.Header>Turbo Town</Card.Header>
                                    <Card.Meta>
                                        Can you be mayor?
                                    </Card.Meta>
                                    
                                    <Card.Description>
                                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                            <img width='300px' src={turboTownIcon}/>
                                            
                                                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'baseline', marginTop: '1.5em'}}>
                                                    <Statistic size={ townData.active.filter(quest => quest.completed === true).length > 0 ? 'large' : 'mini'} color='yellow'> 
                                                        <Statistic.Value>{ townData.active.filter(quest => quest.completed === true).length }</Statistic.Value>
                                                    <Statistic.Label style={{ fontSize: '12px'}}>{ townData.active.filter(quest => quest.completed === true).length === 1 ? 'Quest Complete' : 'Quests Complete'}</Statistic.Label>
                                                    </Statistic>
                                                    <Statistic size='mini' color='purple'> 
                                                        <Statistic.Value>{ townData.active.length }</Statistic.Value>
                                                        <Statistic.Label style={{ fontSize: '12px'}}>Active Quests</Statistic.Label>
                                                    </Statistic>
                                                    <Statistic size='mini' color='green' style={{ marginTop: '0px'}}> 
                                                        <Statistic.Value>{ townData.completed.length }</Statistic.Value>
                                                        <Statistic.Label style={{ fontSize: '12px'}}>Completed Quests</Statistic.Label>
                                                    </Statistic>
                                                </div>
                                            
                                            <Button color='orange' style={{ marginTop: '1em' }} onClick={ () => {handleRouteChange('town')} }> View Your Turbo Town </Button>`
                                        </div>
                                    </Card.Description>
                                    
                                </Card.Content>
                                <Card.Content extra>
                                    <a>
                                        <Icon name='magic' />
                                        { townData.townStats.totalTownGames } Total Town Games
                                    </a>
                                </Card.Content>
                                
                            </Card>
                            ): '' }
                            <Card id="playerCard" style={{ width: '300px'}}>
                                {/* <Image style={{ width: '300px'}} src={userData.userStats.profile.avatarfull} wrapped ui={false} /> */}
                                <Card.Content >
                                    <Card.Header>Overall Stats</Card.Header>
                                    <Card.Meta>
                                        All Turbo Games
                                    </Card.Meta>
                                    <Card.Description style={{ marginTop: '2em'}}>
                                        <Container style = {{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'baseline'}}>
                                            <Statistic size='mini' color='green'> 
                                                <Statistic.Value>{userData.totals.kills.toLocaleString()}</Statistic.Value>
                                                <Statistic.Label>Kills</Statistic.Label>
                                            </Statistic>
                                            <Statistic size='mini' color='red'> 
                                                <Statistic.Value>{userData.totals.deaths.toLocaleString()}</Statistic.Value>
                                                <Statistic.Label>Deaths</Statistic.Label>
                                            </Statistic>
                                            <Statistic size='mini' color='grey'> 
                                                <Statistic.Value>{userData.totals.assists.toLocaleString()}</Statistic.Value>
                                                <Statistic.Label>Assists</Statistic.Label>
                                            </Statistic>
                                        </Container>
                                        <Container style = {{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'baseline'}}>
                                            <Statistic size='mini' color='grey'> 
                                                <Statistic.Value>{userData.totals.games.toLocaleString()}</Statistic.Value>
                                                <Statistic.Label>Games</Statistic.Label>
                                            </Statistic>
                                            <Statistic size='mini' color='green'> 
                                                <Statistic.Value>{userData.totals.wins.toLocaleString()}</Statistic.Value>
                                                <Statistic.Label>Wins</Statistic.Label>
                                            </Statistic>
                                            <Statistic size='mini' color='red'> 
                                                <Statistic.Value>{userData.totals.losses.toLocaleString()}</Statistic.Value>
                                                <Statistic.Label>Losses</Statistic.Label>
                                            </Statistic>
                                        </Container>
                                    </Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    <a>
                                        <Icon name='save' />
                                        {(userData.matchStats.length)} Matches
                                    </a>
                                </Card.Content>
                            </Card>
{/*                             
                            <Card id="playerCard2">
                                <Card.Content>
                                    <Card.Header><Icon name='gem' />Top Picks and Bans for You</Card.Header>
                                    <Card.Meta>
                                        <span>Calculating for MMR ~{userData.userStats.mmr_estimate.estimate}</span>
                                    </Card.Meta>
                                    <Card.Description>
                                        <div className={'flexContainer'}>
                                            <Image 
                                                src={underConstruction} 
                                                width={200}
                                                alt='under construction'
                                                id='constructionImg'
                                            />
                                            <h2>Under Construction ... Coming soon!</h2>
                                        </div>
                                    </Card.Description>
                                    </Card.Content>
                                    <Card.Content extra>
                                    <a>
                                        <Icon name='save' />
                                        {(userData.matchStats.length)} Matches
                                    </a>
                                </Card.Content>
                            </Card>
                             */}

                        </Card.Group>
                    </div>
                    <div className={'tabView'}>
                        <Tab menu={{ secondary: true, pointing: true }} panes={panes} renderActiveOnly={false} />
                    </div>
                </Container>
            )
            :
                ''
            }
            
        </Container>
    )
}

export default UserData;
