import React, { useState, useEffect, useContext } from 'react';
import { Pane, Text, Heading, SearchInput, ThemeProvider, defaultTheme, majorScale } from 'evergreen-ui'
import { useHistory } from "react-router-dom";
import axios from 'axios'
import TurbodotaContext from './TurbodotaContext'
import {
    Card,
    Button,
    Divider
} from 'semantic-ui-react'

function SingleMatch(props) {
    const { heroesList }= useContext(TurbodotaContext);

    const match=props.matchData

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

    const heroIcon = (hero_id) => {
        let heroString = 'd2mh hero-' + hero_id
        return <i className={heroString}/>
    } 

    const heroName = (hero_id) => {
        return heroesList.filter(hero => hero.id === hero_id)[0].localized_name
    }
    
    return (
        <Card style={{ flexDirection: 'row', padding: '8px',}}>
            <Card.Content style={{ 
                width: '160px', 
                flexGrow: 0, 
                display:'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center'
            }}>
                <Card.Header>{heroIcon(match.hero_id)}</Card.Header>
                <Card.Header
                    style={{fontSize: '14px'}}
                >
                    {heroName(match.hero_id)}
                </Card.Header>
                
                <Card.Description
                    style={{ 
                        color: winOrLoss(match.player_slot, match.radiant_win) ? 'green' : 'red',
                        fontSize: '20px',
                        fontStyle: 'bold'
                    }}
                >
                    {winOrLoss(match.player_slot, match.radiant_win) ? 'Win' : 'Loss'}
                </Card.Description>
            </Card.Content>
            <Card.Content style={{ border: '0px'}}>
                Kills: {match.kills}
                Deaths: {match.deaths}
                Assists: {match.assists}
            </Card.Content>
            <Card.Content style={{ border: '0px', flexGrow: 0}}>
                <Card.Meta>Match ID: {match.match_id}</Card.Meta>
                <div className='ui two buttons'>
                    <Button basic color='green'>
                        Baddie Calc
                    </Button>
                </div>
            </Card.Content>
        </Card>
    )
}

export default SingleMatch;
