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

function SingleMatch(props) {
    const { heroesList }= useContext(TurbodotaContext);

    const [matchData, setMatchData] = useState({});
    const [selectedMatch, setSelectedMatch] = useState('');
    const [heroDamage, setHeroDamage] = useState({})

    const matchOverview = props.matchData

    // useEffect(() => {
    //     console.log(selectedMatch)
    //   }, [selectedMatch])

    useEffect(() => {
        async function getMatchData(){
            try {
                axios.get(`/api/matches/${matchOverview.match_id}`)
                .then(res => {
                    let content = res.data;
                    // console.log(matchOverview, content)
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
        // console.log(playerData)
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
        <Card style={{ flexDirection: 'row', padding: '8px',}}>
            <Card.Content style={{ 
                width: '160px', 
                flexGrow: 0, 
                display:'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center'
            }}>
                <Card.Header>{heroIcon(matchOverview.hero_id)}</Card.Header>
                <Card.Header
                    style={{fontSize: '14px'}}
                >
                    {heroName(matchOverview.hero_id)}
                </Card.Header>
                
                <Card.Description
                    style={{ 
                        color: winOrLoss(matchOverview.player_slot, matchOverview.radiant_win) ? 'green' : 'red',
                        fontSize: '20px',
                        fontStyle: 'bold'
                    }}
                >
                    {winOrLoss(matchOverview.player_slot, matchOverview.radiant_win) ? 'Win' : 'Loss'}
                </Card.Description>
            </Card.Content>
            <Card.Content style={{ border: '0px'}}>
                <Container style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-begin', flexDirection: 'row', width: '100%', height: '100%'}}>
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
                                <Container fluid style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-begin', flexDirection: 'row', width: '100%', height: '100%'}}>
                                    <div style={{ marginLeft: '.5em'}}>
                                        {heroIcon(heroesList.filter(hero => hero.name === damageKey)[0].id)}
                                    </div>
                                    {heroDamage.perHeroDamage[damageKey]}
                                </Container>
                            </div>
                        ))
                        :
                            <Header as='h4' style={{ color: 'firebrick'}}>
                                Run the Baddie Calc to get Advanced Stats!
                            </Header>
                        }
                    </Container>
                </Container>
            </Card.Content>
            <Card.Content style={{ border: '0px', flexGrow: 0}}>
                <Card.Meta>Date: {dateString(matchOverview.start_time)}</Card.Meta>
                <Card.Meta>Match ID: {matchOverview.match_id}</Card.Meta>
                <Card.Meta>Player Slot: {matchOverview.player_slot}</Card.Meta>
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
