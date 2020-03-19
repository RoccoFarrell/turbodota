import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from "react-router-dom";
import TurbodotaContext from './TurbodotaContext'
import SingleMatch from './SingleMatch'
import {
    Container,
    Card,
    Icon,
    Image,
    Header
} from 'semantic-ui-react'

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
        <Container style={{ width: '100%', padding: '20px' }}>
            { !!userData.userStats ? (
                <Container style={{ width: '100%' }}>
                    <Card style={{ width: '20%', marginLeft: '0.5em'}}>
                        <Image width='200px' src={userData.userStats.profile.avatarfull} wrapped ui={false} />
                        <Card.Content>
                            <Card.Header>ID: {userData.userStats.profile.account_id}</Card.Header>
                            <Card.Meta>
                                <span className='date'>MMR Estimate: {userData.userStats.mmr_estimate.estimate}</span>
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
