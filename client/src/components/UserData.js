import React, { useState, useEffect, useContext } from 'react';
import { Pane, Text, Heading, SearchInput, ThemeProvider, defaultTheme, majorScale } from 'evergreen-ui'
import { useLocation } from "react-router-dom";
import axios from 'axios'
import TurbodotaContext from './TurbodotaContext'
import SingleMatch from './SingleMatch'
import {
    Card,
    Button,
    Icon,
    Image,
    Header
} from 'semantic-ui-react'

function UserData() {
    const {selectedUser, setSelectedUser} = useContext(TurbodotaContext);
    const [userData, setUserData] = useState({});

    let location = useLocation()
    async function searchUser(id){
        try {
            axios.get(`/api/players/${id}`)
            .then(res => {
                let content = res.data;
                content.matchStats = content.matchStats.slice(0,9)
                console.log(content)
                setUserData(content)
            })
        } catch(e) {console.error(e)}
    }

    //in the event you just navigate directly to /users/:id
    // needs to be fixed \/ \/ \/ 

    // useEffect(() => {
    //     console.log(location.pathname.indexOf('/users/'))
    //     if(!!location.pathname && location.pathname.indexOf('/users/') > -1){
    //         console.log('searching for ' + location.pathname.split('/users/')[1])
    //         searchUser(location.pathname.split('/users/')[1])
    //     }
    // }, [])

    useEffect(() => {
        if (selectedUser.account_id !== undefined) searchUser(selectedUser.account_id)
    }, [selectedUser])

    return (
        <Pane
        width='100%'
        padding={majorScale(5)}
        >
            {userData.userStats ? (
                <Pane
                width='100%'
                >
                    <Card style={{ width: '20%', marginLeft: '0.5em'}}>
                        <Image width='200px' src={selectedUser.avatarfull} wrapped ui={false} />
                        <Card.Content>
                            <Card.Header>ID: {selectedUser.account_id}</Card.Header>
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
                </Pane>
            )
            :
                ''
            }
            
        </Pane>
    )
}

export default UserData;
