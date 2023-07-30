import React, { useState, useEffect, useContext } from 'react';
import {
    Button,
    Table,
    Dropdown,
    Header,
    Grid,
    Image,
    Segment,
    TableCell
} from 'semantic-ui-react'
import './HeroStats.css'
import TurbodotaContext from '../TurbodotaContext'
import axios from 'axios'

import turboKingIcon from '../../assets/turboking.png';

import api from '../../services/api'

function HeroStats(props) {
    const { heroesList } = useContext(TurbodotaContext);

    const [allPlayers, setAllPlayers] = useState([])

    const [column, setColumn] = useState('')
    const [direction, setDirection] = useState('ascending')

    //66 default is chen
    const [selectedHero, setSelectedHero] = useState(66)
    const [sortablePlayerStats, setSortablePlayerStats] = useState([])

    const [heroOptions, setHeroOptions] = useState([])
    const [playersDropdown, setPlayersDropdown] = useState([])

    const [compare1, setCompare1] = useState({
        key: 80636612,
        value: 80636612
    })
    const [compare2, setCompare2] = useState({
        key: 65110965,
        value: 65110965
    })

    const [compareMatchHistory, setCompareMatchHistory] = useState({
        'player1': [],
        'player2': [],
        'player1_calcs': {},
        'player2_calcs': {}
    })

    const handleUpdateCompareMatchHistory = async (player1_MH, player2_MH) => {
        let player1_calcs = {
            'parsedGames': 0,
            'damage': 0,
            'damage_per_game': 0,
            'lh': 0,
            'lh_per_game': 0,
            'xp': 0,
            'xp_per_game': 0,
            'gold': 0,
            'gold_per_game': 0
        }

        let player2_calcs = {
            'parsedGames': 0,
            'damage': 0,
            'damage_per_game': 0,
            'lh': 0,
            'lh_per_game': 0,
            'xp': 0,
            'xp_per_game': 0,
            'gold': 0,
            'gold_per_game': 0
        }

        console.log('p1 calcs: ', player1_calcs)
        console.log('p2 calcs: ', player2_calcs)

        player1_MH.forEach(match => {
            console.log('match: ', match)
            if(!!match.duration){
                let player_matchDetails = match.players.filter(player => player.account_id === compare1.key)[0]
                if(!!player_matchDetails){
                    console.log('p1 match ID ' + match.match_id + ' :' + player_matchDetails)
                    player1_calcs.parsedGames += 1
                    player1_calcs.damage += player_matchDetails.hero_damage
                    player1_calcs.lh += player_matchDetails.last_hits
                    player1_calcs.xp += player_matchDetails.total_xp
                    player1_calcs.gold += player_matchDetails.total_gold
                }
            }
        })

        if(player1_calcs.damage) player1_calcs.damage_per_game = Math.round(player1_calcs.damage / player1_calcs.parsedGames)
        if(player1_calcs.lh) player1_calcs.lh_per_game = Math.round(player1_calcs.lh / player1_calcs.parsedGames)
        if(player1_calcs.xp) player1_calcs.xp_per_game = Math.round(player1_calcs.xp / player1_calcs.parsedGames)
        if(player1_calcs.gold) player1_calcs.gold_per_game = Math.round(player1_calcs.gold / player1_calcs.parsedGames)

        player2_MH.forEach(match => {
            if(!!match.duration){
                let player_matchDetails = match.players.filter(player => player.account_id === compare2.key)[0]
                if(!!player_matchDetails){
                    console.log('p2 match ID ' + match.match_id + ' :' + player_matchDetails)
                    player2_calcs.parsedGames += 1
                    player2_calcs.damage += player_matchDetails.hero_damage
                    player2_calcs.lh += player_matchDetails.last_hits
                    player2_calcs.xp += player_matchDetails.total_xp
                    player2_calcs.gold += player_matchDetails.total_gold
                }
            }
        })

        if(player2_calcs.damage) player2_calcs.damage_per_game = Math.round(player2_calcs.damage / player2_calcs.parsedGames)
        if(player2_calcs.lh) player2_calcs.lh_per_game = Math.round(player2_calcs.lh / player2_calcs.parsedGames)
        if(player2_calcs.xp) player2_calcs.xp_per_game = Math.round(player2_calcs.xp / player2_calcs.parsedGames)
        if(player2_calcs.gold) player2_calcs.gold_per_game = Math.round(player2_calcs.gold / player2_calcs.parsedGames)

        console.log('p1 calcs: ', player1_calcs)
        console.log('p2 calcs: ', player2_calcs)

        setCompareMatchHistory({
            'player1': player1_MH,
            'player2': player2_MH,
            'player1_calcs': player1_calcs,
            'player2_calcs': player2_calcs
        })
    }

    const playersWeCareAbout = [
        113003047, //Danny
        123794823, //Steven
        125251142, //Matt
        34940151, //Roberts
        423076846, //Chris
        65110965, //Rocco
        67762413, //Walker
        68024789, //Ben
        80636612,  //Martin
        214308966  //Andy
    ]

    const playerName = (player_id) => {
        return (allPlayers[player_id].profile.personaname )  
      }

    //Initial render useEffect
    useEffect(() => {
        async function getAllPlayers(){
            try {
                let allUsers = await api.getUsers()
                let usersFiltered = allUsers.users.filter(user => !!user.profile && playersWeCareAbout.includes(user.profile.account_id))
    
                const promises = usersFiltered.map(async player => {
                    const newUser = await api.getUserByDotaID(player.profile.account_id)
                    player.detailStats = newUser
                    return player
                })
                
                const newUsers = await Promise.all(promises)

                let tempDropdownArr = []
                usersFiltered.forEach(player => {
                    tempDropdownArr.push({
                        key: player.profile.account_id,
                        text: player.profile.personaname,
                        value: player.profile.account_id
                    })
                })

                tempDropdownArr = textListSort(tempDropdownArr)

                console.log('dropdown arr: ', tempDropdownArr)
                setPlayersDropdown(tempDropdownArr)

                setAllPlayers(usersFiltered)
                console.log('all users: ', usersFiltered)
            } catch(e) {console.error(e)}
        }
        getAllPlayers()
    }, [])

    //on heroesList change useEffect
    useEffect(() => {
        let tempHeroArr = []
        heroesList.forEach((hero) => {
            let newHeroAdd = {
                key: hero.id,
                text: hero.localized_name,
                value: hero.id
            }
            tempHeroArr.push(newHeroAdd)
        })

        tempHeroArr.sort(function(a, b) {
            var nameA = a.text.toUpperCase(); // ignore upper and lowercase
            var nameB = b.text.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1
            }
            if (nameA > nameB) {
              return 1
            }
          
            // names must be equal
            return 0
          })
          setHeroOptions(tempHeroArr)

        }, [heroesList])

    //on allPlayers or selected hero change useEffect
    useEffect(() => {
        console.log(selectedHero)
        let tempArr = []
        Object.keys(allPlayers).forEach((playerKey) => {
            if (allPlayers[playerKey].detailStats.calculations.allHeroRecord[selectedHero]) {
                let pushObj = {
                    player_id: playerKey,
                    games: allPlayers[playerKey].detailStats.calculations.allHeroRecord[selectedHero].games,
                    wins: allPlayers[playerKey].detailStats.calculations.allHeroRecord[selectedHero].wins,
                    winpercentage: ((allPlayers[playerKey].detailStats.calculations.allHeroRecord[selectedHero].wins/allPlayers[playerKey].detailStats.calculations.allHeroRecord[selectedHero].games)*100),
                    losses: allPlayers[playerKey].detailStats.calculations.allHeroRecord[selectedHero].losses,
                    kills: allPlayers[playerKey].detailStats.calculations.allHeroRecord[selectedHero].kills,
                    kills_game: (allPlayers[playerKey].detailStats.calculations.allHeroRecord[selectedHero].kills/ allPlayers[playerKey].detailStats.calculations.allHeroRecord[selectedHero].games),
                    deaths: allPlayers[playerKey].detailStats.calculations.allHeroRecord[selectedHero].deaths,
                    deaths_game: (allPlayers[playerKey].detailStats.calculations.allHeroRecord[selectedHero].deaths/ allPlayers[playerKey].detailStats.calculations.allHeroRecord[selectedHero].games),
                    assists: allPlayers[playerKey].detailStats.calculations.allHeroRecord[selectedHero].assists,
                    assists_game: (allPlayers[playerKey].detailStats.calculations.allHeroRecord[selectedHero].assists/ allPlayers[playerKey].detailStats.calculations.allHeroRecord[selectedHero].games),
                    kda: ((allPlayers[playerKey].detailStats.calculations.allHeroRecord[selectedHero].kills+allPlayers[playerKey].detailStats.calculations.allHeroRecord[selectedHero].assists)/allPlayers[playerKey].detailStats.calculations.allHeroRecord[selectedHero].deaths)
                  }
                  tempArr.push(pushObj)
            }
        })
        tempArr.sort((a,b) => b.games - a.games)
        setSortablePlayerStats(tempArr)
        handleUpdateCompareMatchHistory([],[])
      }, [allPlayers,selectedHero])

    //text sorting function
    const textListSort = (inputArr) => {
        inputArr.sort(function(a, b) {
            var nameA = a.text.toUpperCase(); // ignore upper and lowercase
            var nameB = b.text.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1
            }
            if (nameA > nameB) {
              return 1
            }
          
            // names must be equal
            return 0
          })
        
        return inputArr
    }
  
    //sorting function definition
    const handleSort = (clickedColumn) => () => {
        console.log("column: ", column, " clickedColumn: ", clickedColumn)

        if (column !== clickedColumn) {
            setDirection('descending')
            let tempSorted = sortablePlayerStats.sort((a, b) => {
            if(a[clickedColumn] > b[clickedColumn]) return -1
            if(a[clickedColumn] < b[clickedColumn]) return 1
            return 0
            })
            setSortablePlayerStats(tempSorted)
            setColumn(clickedColumn)
            return
        }
        
        setSortablePlayerStats(sortablePlayerStats.reverse())
        setDirection(direction === 'ascending' ? 'descending' : 'ascending')
        //setDirection(direction === 'descending' ? 'ascending' : 'descending')
    }

    const handleHeroChange = (e, {value}) => {
        setSelectedHero(value)
        setColumn('')
        handleSort('games')
    }

    const handleCompare1Change = (e, {value}) => {
        console.log(value)
        setCompare1({
            key: value,
            //text: allPlayers.filter(player => player.profile.account_id === value).profile.personaname,
            value: value
        })
    }

    const handleCompare2Change = (e, {value}) => {
        console.log(value)
        setCompare2({
            key: value,
            //text: allPlayers.filter(player => player.profile.account_id === value).profile.personaname,
            value: value
        })
    }

    const handleCompare = async (e) => {
        console.log(compare1, compare2, selectedHero, heroName(selectedHero))
        let user1_heroMatchHistory = await api.getMatchesByHeroForPlayer(compare1.key, selectedHero)
        console.log('compare1 match history from API: ', user1_heroMatchHistory)

        let user2_heroMatchHistory = await api.getMatchesByHeroForPlayer(compare2.key, selectedHero)
        console.log('compare2 match history from API: ', user2_heroMatchHistory)

        //update state
        handleUpdateCompareMatchHistory(user1_heroMatchHistory, user2_heroMatchHistory)
    }

    //helper functions
    const enoughGames = (games) => {
        if(games > 5) return true
        else return false
    }

    const heroIcon = (hero_id) => {
        let heroString = 'd2mh hero-' + hero_id
        //let returnVal
        //hero_id == 123 ? returnVal = <Image src={squirrel} size="mini" className='inline' /> : returnVal = <i className={heroString}/>
        return <i className={heroString}/>
      } 
  
    const heroName = (hero_id) => {
        // console.log('hero_id: ' + hero_id)
        // return heroesList.filter(hero => hero.id == hero_id)[0].localized_name
        if(hero_id === 0 || hero_id === '0') {
            return 'HeroZero'
        } else {
            return (heroesList.filter(hero => hero.id == hero_id)[0] ? heroesList.filter(hero => hero.id == hero_id)[0].localized_name  : "error: couldnt get name" )   
        }
    }

    // const playerName = (dotaID) => {
    //     // console.log('hero_id: ' + hero_id)
    //     // return heroesList.filter(hero => hero.id == hero_id)[0].localized_name
    //     if(dotaID === 0 || dotaID === '0') {
    //         return 'no name'
    //     } else {
    //         return (allPlayers.filter(player => player.profile.account_id === dotaID).profile ? allPlayers.filter(player => player.profile.account_id === dotaID).profile.personaname  : "error: couldnt get name" )   
    //     }
    // }
  
    return (
        <div id="heroStatsGrid" >
            <Grid 
                centered 
                columns={1}
                padded
                verticalAlign='middle'
            >
                {/* Header */}
                <Grid.Row>
                    <Header as='h1' color='red'>Hero Stats</Header>
                </Grid.Row>
                <Grid.Row stretched columns={5}>
                    <Grid.Column>
                        <Image size='small' src={turboKingIcon}/>
                    </Grid.Column>
                    <Grid.Column>
                        <Header as='h2'>Only the true king will rule..</Header>
                    </Grid.Column>
                </Grid.Row>
                {/* Hero Dropdown */}
                <Grid.Row columns={2}>
                    <Grid.Column width={2}>
                        <Header color='green' as='h3'>Hero</Header>
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Dropdown
                            placeholder='Select Hero'
                            defaultValue={selectedHero}
                            fluid
                            selection
                            search
                            options={heroOptions}
                            onChange = {handleHeroChange}
                        />
                    </Grid.Column>
                </Grid.Row>
                {/* Hero Table - All Users */}
                <Grid.Row>
                    <Table compact sortable celled fixed>
                        <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Player</Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={column === 'games' ? direction : null}
                                onClick={handleSort('games')}
                                >
                                Games
                            </Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={column === 'wins' ? direction : null}
                                onClick={handleSort('wins')}
                                >
                                Wins
                            </Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={column === 'losses' ? direction : null}
                                onClick={handleSort('losses')}
                                >
                                Losses
                            </Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={column === 'winpercentage' ? direction : null}
                                onClick={handleSort('winpercentage')}
                                >
                                Win %
                            </Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={column === 'kda' ? direction : null}
                                onClick={handleSort('kda')}
                                >
                                KDA
                            </Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={column === 'kills' ? direction : null}
                                onClick={handleSort('kills')}
                                >
                                Kills
                            </Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={column === 'kills_game' ? direction : null}
                                onClick={handleSort('kills_game')}
                                >
                                Kills/Game
                            </Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={column === 'deaths' ? direction : null}
                                onClick={handleSort('deaths')}
                                >
                                Deaths
                            </Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={column === 'deaths_game' ? direction : null}
                                onClick={handleSort('deaths_game')}
                                >
                                Deaths/Game
                            </Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={column === 'assists' ? direction : null}
                                onClick={handleSort('assists')}
                                >
                                Assists
                            </Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={column === 'assists_game' ? direction : null}
                                onClick={handleSort('assists_game')}
                                >
                                Assists/Game
                            </Table.HeaderCell>
                        </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {
                                sortablePlayerStats.map((player) => (  
                                    <Table.Row 
                                        key={player.player_id}
                                        disabled={!enoughGames(player.games)}
                                    >
                                        <Table.Cell>{ playerName(player.player_id) }</Table.Cell>
                                        {/* <Table.Cell>
                                            <Button>Select for Compare</Button>
                                        </Table.Cell> */}
                                        <Table.Cell>{player.games}</Table.Cell>
                                        <Table.Cell>{player.wins}</Table.Cell>
                                        <Table.Cell>{player.losses}</Table.Cell>
                                        <Table.Cell
                                            positive = { enoughGames(player.games) && player.winpercentage > 55 }
                                            negative = { enoughGames(player.games) && player.winpercentage < 45 }
                                        >
                                            {player.winpercentage.toFixed(1)}
                                        </Table.Cell>
                                        <Table.Cell
                                            positive = { enoughGames(player.games) && player.kda > 5 }
                                            negative = { enoughGames(player.games) && player.kda < 3 }
                                        >
                                            {player.kda.toFixed(1)}
                                        </Table.Cell>
                                        <Table.Cell>{player.kills}</Table.Cell>
                                        <Table.Cell>{player.kills_game.toFixed(1)}</Table.Cell>
                                        <Table.Cell>{player.deaths}</Table.Cell>
                                        <Table.Cell>{player.deaths_game.toFixed(1)}</Table.Cell>
                                        <Table.Cell>{player.assists}</Table.Cell>
                                        <Table.Cell>{player.assists_game.toFixed(1)}</Table.Cell>
                                    </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </Grid.Row>
                {/* Comparison */}
                <Grid.Row columns={1}>
                    <Header color='red' as='h2'>Compare <div color='red' style={{ display: 'inline'}}>{heroName(selectedHero)}</div> for these two chumps (over last 10 games)!</Header>
                </Grid.Row>
                {
                    playersDropdown.length > 1 ?
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                {/* <div>{ compare1.value }</div> */}
                                <Dropdown
                                    defaultValue={compare1.key}
                                    fluid
                                    selection
                                    search
                                    options={playersDropdown}
                                    onChange = {handleCompare1Change}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                {/* <div>{ compare2.value }</div> */}
                                <Dropdown
                                    defaultValue={compare2.key}
                                    fluid
                                    selection
                                    search
                                    options={playersDropdown}
                                    onChange = {handleCompare2Change}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    : ''
                }
                <Grid.Row>
                    <Button 
                        positive
                        onClick={(e) => handleCompare(e)}
                    >
                        Compare
                    </Button>
                </Grid.Row>
                { compareMatchHistory.player1.length > 0 && compareMatchHistory.player2.length > 0 ?
                    <Grid.Row columns={1}>
                        {[
                            {'label':'Damage Per Game',
                            'attr':'damage_per_game'},
                            {'label':'Last Hits Per Game',
                            'attr':'lh_per_game'},
                            {'label':'XP Per Game',
                            'attr':'xp_per_game'},
                            {'label':'Gold Per Game',
                            'attr':'gold_per_game'}
                        ].map((elem, key) => (
                            <Segment key={key}>
                                <Grid centered padded >
                                    <Grid.Row>{elem.label}</Grid.Row>
                                    <Grid.Row columns={5}>
                                        { compareMatchHistory.player1_calcs[elem.attr] > compareMatchHistory.player2_calcs[elem.attr] ? 
                                            <Grid.Column width={1}>
                                                <Image size='mini' src={turboKingIcon}/>
                                            </Grid.Column>
                                        : ''}
                                        <Grid.Column width={3} textAlign='center'>
                                            { compareMatchHistory.player1_calcs[elem.attr] }
                                        </Grid.Column>
                                        <Grid.Column width={3} textAlign='center'>
                                            { compareMatchHistory.player1_calcs[elem.attr] > compareMatchHistory.player2_calcs[elem.attr] ? '>' : '<'}
                                        </Grid.Column>
                                        <Grid.Column width={3} textAlign='center'>
                                            { compareMatchHistory.player2_calcs[elem.attr] }
                                        </Grid.Column>
                                        { compareMatchHistory.player1_calcs[elem.attr] < compareMatchHistory.player2_calcs[elem.attr] ? 
                                            <Grid.Column width={1}>
                                                <Image size='mini' src={turboKingIcon}/>
                                            </Grid.Column>
                                        : ''}
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                        ))}

                        {/* <Segment>
                            <Grid centered textAlign='center'>
                                <Grid.Row>Last Hits</Grid.Row>
                                <Grid.Row columns={5}>
                                    <Grid.Column textAlign='center'>
                                        { compareMatchHistory.player1_calcs.lh_per_game }
                                    </Grid.Column>
                                    <Grid.Column textAlign='center'>
                                        { compareMatchHistory.player1_calcs.lh_per_game > compareMatchHistory.player2_calcs.lh_per_game ? '>' : '<'}
                                    </Grid.Column>
                                    <Grid.Column textAlign='center'>
                                        { compareMatchHistory.player2_calcs.lh_per_game }
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                        <Segment>
                            <Grid centered textAlign='center'>
                                <Grid.Row>XP</Grid.Row>
                                <Grid.Row columns={5}>
                                    <Grid.Column textAlign='center'>
                                        { compareMatchHistory.player1_calcs.xp_per_game }
                                    </Grid.Column>
                                    <Grid.Column textAlign='center'>
                                        { compareMatchHistory.player1_calcs.xp_per_game > compareMatchHistory.player2_calcs.xp_per_game ? '>' : '<'}
                                    </Grid.Column>
                                    <Grid.Column textAlign='center'>
                                        { compareMatchHistory.player2_calcs.xp_per_game }
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                        <Segment>
                        <Grid centered textAlign='center'>
                                <Grid.Row>Net Worth</Grid.Row>
                                <Grid.Row columns={5}>
                                    <Grid.Column textAlign='center'>
                                        { compareMatchHistory.player1_calcs.gold_per_game }
                                    </Grid.Column>
                                    <Grid.Column textAlign='center'>
                                        { compareMatchHistory.player1_calcs.gold_per_game > compareMatchHistory.player2_calcs.gold_per_game ? '>' : '<'}
                                    </Grid.Column>
                                    <Grid.Column textAlign='center'>
                                        { compareMatchHistory.player2_calcs.gold_per_game }
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment> */}
                    </Grid.Row>
                :''}
                { compareMatchHistory.player1.length > 0 && compareMatchHistory.player2.length > 0 ?
                    <Grid.Row columns={2}> 
                        <Grid.Column>
                            <div>
                                {compareMatchHistory.player1.map((game, index) => (
                                    <Segment key={index}>
                                        <div>Match ID: {<a href={"https://www.dotabuff.com/matches/" + game.match_id} style={{color: 'blue'}}>{game.match_id}</a> || 'no match_id'}</div>
                                        <div>Duration: {game.duration || 'no match duration'}</div>
                                        <div>Parsed and Calced?: {(game.isMatchParsed ? 'true' : 'false') || 'no match parse data'}</div>
                                    </Segment>
                                ))}
                            </div>
                        </Grid.Column>
                        <Grid.Column>
                            <div>
                                {compareMatchHistory.player2.map((game, index) => (
                                    <Segment key={index}>
                                        <div>Match ID: {<a href={"https://www.dotabuff.com/matches/" + game.match_id} style={{color: 'blue'}}>{game.match_id}</a> || 'no match_id'}</div>
                                        <div>Duration: {game.duration || 'no match duration'}</div>
                                        <div>Parsed and Calced?: {(game.isMatchParsed ? 'true' : 'false') || 'no match parse data'}</div>
                                    </Segment>
                                ))}
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                :''}
            </Grid>
        </div>
    )
}

export default HeroStats;
