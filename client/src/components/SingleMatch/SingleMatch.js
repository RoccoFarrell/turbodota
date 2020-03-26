import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'
import TurbodotaContext from '../TurbodotaContext'
import {
    Card,
    Button,
    Container,
    Label,
    Header,
    Grid,
    Icon
} from 'semantic-ui-react'
import './SingleMatch.css'

function SingleMatch(props) {
    const { heroesList }= useContext(TurbodotaContext);

    const [matchData, setMatchData] = useState({});
    const [selectedMatch, setSelectedMatch] = useState('');
    const [heroDamage, setHeroDamage] = useState({})

    const [parseLoading, setParseLoading] = useState(false)

    const matchOverview = props.matchData

    useEffect(() => {
        async function getMatchData(){
            try {
                axios.get(`/api/matches/${matchOverview.match_id}`)
                .then(res => {
                    let content = res.data;
                    console.log('matchData: ', content)
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

    const baddieCalcExpired = (timestamp) => {
        let date = new Date(timestamp * 1000)
        let daysAgo = new Date()
        daysAgo.setDate(daysAgo.getDate() - 7)

        if(date < daysAgo) return true 
        else return false
    }

    const baddieText = (timestamp) => {
        if(baddieCalcExpired(timestamp)){
            return (
                <Header as='h4' className={"reqCalc"}>
                    Baddie Calc™ <strong>Expired</strong>
                </Header>
            )
        } else {
            return (
                <Header as='h4' className={"reqCalc"}>
                    Run the Baddie Calc™ to get Advanced Stats!
                </Header>
            )
        }
    }

    const handleRequestCalc = async (matchID) => {
        setParseLoading(true)

        try {
            await axios.post(`/api/request/${matchID}`)
            .then(res => {
                console.log(res)
                setMatchData({
                    ...matchData,
                    isMatchParsed: true
                })
                setParseLoading(false)
            })
        } catch(e) {console.error(e)}
    }

    return (
        <Card id="matchCard">
            <Card.Content id="heroContainer">
                <Card.Header>{heroIcon(matchOverview.hero_id)}</Card.Header>
                <Card.Header id='heroName' as='h3'>
                    {heroName(matchOverview.hero_id)}
                </Card.Header>
                <Card.Description id="winLoss" style={{ color: winOrLoss(matchOverview.player_slot, matchOverview.radiant_win) ? 'green' : 'red' }}>
                    <strong>
                        {winOrLoss(matchOverview.player_slot, matchOverview.radiant_win) ? 'Win' : 'Loss'}
                    </strong>
                </Card.Description>
            </Card.Content>
            <Card.Content id="statsContainer">
                <Container id="statsContainer2">
                    <Container fluid style={{ flex: 1 }}>
                        <h4>Match Stats</h4>
                        <Grid centered columns={2}>
                            <Grid.Row centered column={2}>
                                <Grid.Column>
                                    Kills
                                </Grid.Column>
                                <Grid.Column>
                                    <h3> {matchOverview.kills} </h3>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row centered column={2}>
                                <Grid.Column>
                                Deaths
                                </Grid.Column>
                                <Grid.Column>
                                    <h3> {matchOverview.deaths} </h3>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row centered column={2}>
                                <Grid.Column>
                                Assists
                                </Grid.Column>
                                <Grid.Column>
                                    <h3> {matchOverview.assists} </h3>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Container>

                    <Container fluid style={{ flex: 1 }}>
                        <h4>Damage to Heroes</h4>
                        { !!heroDamage.perHeroDamage ? 
                        Object.keys(heroDamage.perHeroDamage).map(damageKey => (
                            <div
                                key={damageKey}
                            >
                                <Container id="heroDamageContainer" fluid>
                                    <div id="heroDamageDiv" style={{ zoom: .7, padding: '0px' }}>
                                        {heroIcon(heroesList.filter(hero => hero.name === damageKey)[0].id)} 
                                    </div>
                                    <p style={{ display: 'inline', marginLeft: '1em', fontSize: '18px'}}>{heroDamage.perHeroDamage[damageKey]}</p>
                                </Container>
                            </div>
                        ))
                        : baddieText(matchOverview.start_time)}
                    </Container>

                    <Container fluid style={{ flex: 2 }}>
                        <h4>Benchmarks</h4>
                        { !!matchData && !!matchData.players ? (
                            <Grid columns={2}>
                                <Grid.Row>
                                    <Icon color='yellow' name='bitcoin' /> 
                                    GPM: <strong style={{ fontSize: '18px', marginLeft: '1em'}}> {matchData.players.filter(player => player.player_slot === matchOverview.player_slot)[0].benchmarks.gold_per_min.raw}</strong>
                                </Grid.Row>
                                <Grid.Row>
                                    <Icon color='blue' name='battery three quarters' /> 
                                    XPM: <strong style={{ fontSize: '18px', marginLeft: '1em'}}> {matchData.players.filter(player => player.player_slot === matchOverview.player_slot)[0].benchmarks.xp_per_min.raw}</strong>
                                </Grid.Row>
                                <Grid.Row>
                                    <Icon color='green' name='star' /> 
                                    LH/min: <strong style={{ fontSize: '18px', marginLeft: '1em'}}> {matchData.players.filter(player => player.player_slot === matchOverview.player_slot)[0].benchmarks.last_hits_per_min.raw.toFixed(2)}</strong>
                                </Grid.Row>
                                <Grid.Row>
                                    <Icon color='red' name='gavel' /> 
                                    Stuns/min: <strong style={{ fontSize: '18px', marginLeft: '1em'}}> {matchData.players.filter(player => player.player_slot === matchOverview.player_slot)[0].benchmarks.stuns_per_min.raw.toFixed(2)}</strong>
                                </Grid.Row>
                            </Grid>
                        ) : '' }

                    </Container>
                </Container>
            </Card.Content>
            <Card.Content id="matchInfoContainer">
                <Card.Meta>Date: {dateString(matchOverview.start_time)}</Card.Meta>
                <Card.Meta>Match ID: {matchOverview.match_id}</Card.Meta>
                <Card.Meta>Player Slot: {matchOverview.player_slot}</Card.Meta>
                <div>
                    { matchData.isMatchParsed ? (
                        <Button
                            basic
                            color='green'
                            disabled
                        >
                            Match Parsed
                        </Button>
                    ) 
                    : 
                    (
                        <Button 
                            basic 
                            color='green'
                            loading = { parseLoading }
                            disabled = { baddieCalcExpired(matchOverview.start_time) }
                            onClick={ (e) => {
                                handleRequestCalc(matchOverview.match_id)
                            }}>
                            { baddieCalcExpired(matchOverview.start_time) ? 'Expired' : 'Baddie Calc™'}
                        </Button>
                    )}

                </div>
            </Card.Content>
        </Card>
    )
}

export default SingleMatch;
