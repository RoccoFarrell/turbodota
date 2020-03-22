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
    Header
} from 'semantic-ui-react'
import './UserData.css';

function UserData() {
    const {selectedUser, setSelectedUser, userID, setUserID} = useContext(TurbodotaContext);

    const userData = selectedUser
    let location = useLocation()

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
                    <Card id="playerCard">
                        <Image src={userData.userStats.profile.avatarfull} wrapped ui={false} />
                        <Card.Content>
                            <Card.Header>ID: {userData.userStats.profile.account_id}</Card.Header>
                            <Card.Meta>
                                <span>MMR Estimate: {userData.userStats.mmr_estimate.estimate}</span>
                            </Card.Meta>
                            <Card.Description>
                                <p>Kills: {userData.totals.kills}</p>
                                <p>Deaths: {userData.totals.deaths}</p>
                                <p>Assists: {userData.totals.assists}</p>
                                <p>Games: {userData.totals.games}</p>
                            </Card.Description>
                            </Card.Content>
                            <Card.Content extra>
                            <a>
                                <Icon name='save' />
                                {userData.matchStats.length} Matches
                            </a>
                        </Card.Content>
                    </Card>
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
