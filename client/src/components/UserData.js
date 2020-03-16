import React, { useState, useEffect, useContext } from 'react';
import { Pane, Text, Heading, SearchInput, ThemeProvider, defaultTheme, majorScale } from 'evergreen-ui'
import { useHistory } from "react-router-dom";
import axios from 'axios'
import TurbodotaContext from './TurbodotaContext'
import SingleMatch from './SingleMatch'
import {
    Card,
    Button
} from 'semantic-ui-react'

function UserData() {


    const {selectedUser, setSelectedUser} = useContext(TurbodotaContext);
    const [userData, setUserData] = useState({});

    useEffect(() => {
        console.log(selectedUser)
      }, [selectedUser])


    useEffect(() => {
        async function searchUser(){
            try {
            axios.get(`/api/players/${selectedUser.account_id}`)
            .then(res => {
                let content = res.data;
                console.log(content);
                setUserData(content)
            })
            
            } catch(e) {console.error(e)}
        }
        if (selectedUser.account_id !== undefined) searchUser()
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
                    <h1>USER DATA: {selectedUser.account_id}</h1>
                    <Pane>
                        <Pane>MMR: {userData.userStats.mmr_estimate.estimate}</Pane>
                        <Pane>Kills: {userData.totals.kills}</Pane>
                        <Pane>Deaths: {userData.totals.deaths}</Pane>
                        <Pane>Assists: {userData.totals.assists}</Pane>
                        <Pane>Games: {userData.totals.games}</Pane>
                    </Pane>
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
