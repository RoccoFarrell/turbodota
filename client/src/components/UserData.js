import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from "react-router-dom";
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
    Tab
} from 'semantic-ui-react'
import './UserData.css';
import UserMatchHistory from './UserMatchHistory/UserMatchHistory';
import underConstruction from '../assets/construction.png';

function UserData() {
    const {selectedUser, setSelectedUser, userID, setUserID} = useContext(TurbodotaContext);

    const userData = selectedUser
    let location = useLocation()

    useEffect(() => {
        if (userID === undefined || userID === ''){
            // console.log('userID is undefined')
            // console.log('userID: ', userID, 'userData: ', userData, 'selectedUser: ', selectedUser)
            // console.log('userID: ', userID)
            setUserID(location.pathname.split('/users/')[1])
        } else {
            console.log('userID: ', userID, 'userData: ', userData, 'selectedUser: ', selectedUser)
        }
    }, [])

    const panes = [
        {
          menuItem: 'Matches',
          pane: {
            key: 'pane1',
            attached: false,
            content: 
                (
                    <div>
                        <Header as='h2'>Last 10 Games</Header>
                        { !!userData.matchStats ? (
                            <UserMatchHistory
                                matchStats = { userData.matchStats }
                            />
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

    return (
        <Container id="container">
            { !!userData.userStats ? (
                <Container id="results">
                    <div
                        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Card.Group style={{ width: '100%' }}>
                            <Card id="playerCard">
                                <Image src={userData.userStats.profile.avatarfull} wrapped ui={false} />
                                <Card.Content>
                                    <Card.Header>ID: {userData.userStats.profile.account_id}</Card.Header>
                                    <Card.Meta>
                                        <span>MMR Estimate: {userData.userStats.mmr_estimate.estimate}</span>
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
                                        {(userData.matchStats.length)+1} Matches
                                    </a>
                                </Card.Content>
                            </Card>
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
                                        {(userData.matchStats.length)+1} Matches
                                    </a>
                                </Card.Content>
                            </Card>
                            <Card id="playerCard3">
                                <Card.Content>
                                    <Card.Header>ID: {userData.userStats.profile.account_id}</Card.Header>
                                    <Card.Meta>
                                        <span>MMR Estimate: {userData.userStats.mmr_estimate.estimate}</span>
                                    </Card.Meta>
                                    <Card.Description>
                                        Test more stats
                                    </Card.Description>
                                    </Card.Content>
                                    <Card.Content extra>
                                    <a>
                                        <Icon name='save' />
                                        {(userData.matchStats.length)+1} Matches
                                    </a>
                                </Card.Content>
                            </Card>
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
