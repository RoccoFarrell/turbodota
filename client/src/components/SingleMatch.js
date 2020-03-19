import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'
import TurbodotaContext from './TurbodotaContext'
import {
    Card,
    Button,
    Container,
    Label,
    Header
} from 'semantic-ui-react'
import './SingleMatch.css'

function SingleMatch(props) {
    const { heroesList }= useContext(TurbodotaContext);

    const [matchData, setMatchData] = useState({});
    const [selectedMatch, setSelectedMatch] = useState('');
    const [heroDamage, setHeroDamage] = useState({})

    const matchOverview = props.matchData

    useEffect(() => {
        async function getMatchData(){
            try {
                axios.get(`/api/matches/${matchOverview.match_id}`)
                .then(res => {
                    let content = res.data;
                    let returnDmg = calculateHeroDamage(matchOverview, content)
                    setHeroDamage(returnDmg)
                    setMatchData(content)
                })
            
            } catch(e) {console.error(e)}
        }
        getMatchData()
    }, [])

    function calculateHeroDamage (matchOverview, matchData) {
        let playerData = matchData.players.filter(player => player.player_slot === matchOverview.player_slot)
        let damageArray = {}
        let returnObject = {}
        if(!!playerData[0].damage_targets){
            let damageTargets = playerData[0].damage_targets
            Object.keys(damageTargets).forEach(damageSource => {
                Object.keys(damageTargets[damageSource]).forEach(heroTarget => {
                    if (Object.keys(damageArray).includes(heroTarget.toString())) {
                        damageArray[heroTarget] += damageTargets[damageSource][heroTarget]
                    }
                    else {
                        damageArray[heroTarget] = damageTargets[damageSource][heroTarget]
                    }
                })
            })

            returnObject = {
                'perHeroDamage': damageArray
            }
        } else {
            returnObject = {}
        }
        return returnObject
    }

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
    
    const dateString = (timestamp) => {
        let string = new Date(timestamp * 1000)
        return string.toLocaleDateString()
    }


    return (
        <Card id="matchCard">
            <Card.Content id="heroContainer">
                <Card.Header>{heroIcon(matchOverview.hero_id)}</Card.Header>
                <Card.Header id="heroName">
                    {heroName(matchOverview.hero_id)}
                </Card.Header>
                <Card.Description id="winLoss" style={{ color: winOrLoss(matchOverview.player_slot, matchOverview.radiant_win) ? 'green' : 'red' }}>
                    {winOrLoss(matchOverview.player_slot, matchOverview.radiant_win) ? 'Win' : 'Loss'}
                </Card.Description>
            </Card.Content>
            <Card.Content id="statsContainer">
                <Container id="statsContainer2">
                    <Container fluid>
                        <h4>Match Stats</h4>
                        <p>Kills: {matchOverview.kills}</p>
                        <p>Deaths: {matchOverview.deaths}</p>
                        <p>Assists: {matchOverview.assists}</p>
                    </Container>
                     
                    <Container fluid>
                        <h4>Damage to Heroes</h4>
                        { !!heroDamage.perHeroDamage ? 
                        Object.keys(heroDamage.perHeroDamage).map(damageKey => (
                            <div
                                key={damageKey}
                            >
                                <Container id="heroDamageContainer" fluid>
                                    <div id="heroDamageDiv">
                                        {heroIcon(heroesList.filter(hero => hero.name === damageKey)[0].id)}
                                    </div>
                                    {heroDamage.perHeroDamage[damageKey]}
                                </Container>
                            </div>
                        ))
                        :
                            <Header as='h4' id="reqCalc">
                                Run the Baddie Calc to get Advanced Stats!
                            </Header>
                        }
                    </Container>
                </Container>
            </Card.Content>
            <Card.Content id="matchInfoContainer">
                <Card.Meta>Date: {dateString(matchOverview.start_time)}</Card.Meta>
                <Card.Meta>Match ID: {matchOverview.match_id}</Card.Meta>
                <Card.Meta>Player Slot: {matchOverview.player_slot}</Card.Meta>
                <div>
                    <Button basic color='green'>
                        Baddie Calc
                    </Button>
                </div>
            </Card.Content>
        </Card>
    )
}

export default SingleMatch;
