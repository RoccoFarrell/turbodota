import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from "react-router-dom";
import TurbodotaContext from './TurbodotaContext'
import SingleMatch from './SingleMatch'
import UserHeroTable from './UserHeroTable/UserHeroTable'
import {
    Container,
    Card,
    Icon,
    Image,
    Header,
    Statistic
} from 'semantic-ui-react'
import './UserData.css';

function UserData() {
    const {selectedUser, setSelectedUser, userID, setUserID} = useContext(TurbodotaContext);

    const userData = selectedUser
    let location = useLocation()

    //03-23-20
    //Need to change userData.calculations to actually return the calculated array right out of the api rather than calculating in UserHeroTable.js
    console.log(userData.calculations)

    useEffect(() => {
        if (userID === undefined || userID === ''){
            console.log('userID is undefined')
            console.log('userID: ', userID, 'userData: ', userData, 'selectedUser: ', selectedUser)
            setUserID(location.pathname.split('/users/')[1])
        } else {
            console.log('userID: ', userID, 'userData: ', userData, 'selectedUser: ', selectedUser)
        }
    }, [])

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
                                    <Card.Description>
                                        <Container style = {{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
                                            <Statistic > 
                                                <Statistic.Label>Kills</Statistic.Label>
                                                <Statistic.Value>{userData.totals.kills.toLocaleString()}</Statistic.Value>
                                            </Statistic>
                                            <Statistic> 
                                                <Statistic.Label>Deaths</Statistic.Label>
                                                <Statistic.Value>{userData.totals.deaths.toLocaleString()}</Statistic.Value>
                                            </Statistic>
                                        </Container>
                                        <Container style = {{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
                                            <Statistic> 
                                                <Statistic.Label>Assists</Statistic.Label>
                                                <Statistic.Value>{userData.totals.assists.toLocaleString()}</Statistic.Value>
                                            </Statistic>
                                            <Statistic> 
                                                <Statistic.Label>Games</Statistic.Label>
                                                <Statistic.Value>{userData.totals.games.toLocaleString()}</Statistic.Value>
                                            </Statistic>
                                        </Container>
                                        <Container style = {{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
                                            <Statistic> 
                                                <Statistic.Label>Wins</Statistic.Label>
                                                <Statistic.Value>{userData.totals.wins.toLocaleString()}</Statistic.Value>
                                            </Statistic>
                                            <Statistic> 
                                                <Statistic.Label>Losses</Statistic.Label>
                                                <Statistic.Value>{userData.totals.losses.toLocaleString()}</Statistic.Value>
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
                                        {/* { Object.keys(userData.calculations.allHeroRecord).map(item => (
                                            <p>{userData.calculations.allHeroRecord[item].games}</p>
                                        ))} */}
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
                    <Header as='h2'>All Heroes Played</Header>
                    <UserHeroTable
                        heroStats = { userData.calculations.allHeroRecord }
                    />
                    <Header as='h2'>Last 10 Games</Header>
                    <Card.Group itemsPerRow={1}>
                        {userData.matchStats.map((match) => (
                            <SingleMatch 
                            key = {match.match_id}
                            matchData={match}/>
                        ))}
                    </Card.Group>
                </Container>
            )
            :
                ''
            }
            
        </Container>
    )
}

export default UserData;
