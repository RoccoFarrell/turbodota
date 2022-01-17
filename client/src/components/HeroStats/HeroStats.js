import React, { useState, useEffect, useContext } from 'react';
import {
    Table,
    Dropdown
} from 'semantic-ui-react'
import './HeroStats.css'
import TurbodotaContext from '../TurbodotaContext'
import axios from 'axios'

import api from '../../services/api'

function HeroStats(props) {
    const { heroesList } = useContext(TurbodotaContext);

    const [allPlayers, setAllPlayers] = useState([])

    const [column, setColumn] = useState('')
    const [direction, setDirection] = useState('descending')
    const [selectedHero, setSelectedHero] = useState(1)
    const [sortablePlayerStats, setSortablePlayerStats] = useState([])

    const playersWeCareAbout = [
        113003047, //Danny
        123794823, //Steven
        125251142, //Matt
        34940151, //Roberts
        423076846, //Chris
        65110965, //Rocco
        67762413, //Walker
        68024789, //Ben
        80636612  //Martin
    ]

    const playerName = (player_id) => {
        return (allPlayers[player_id].profile.personaname )  
      }

    const heroOptions = []
        heroesList.forEach((hero) => {
            //console.log(hero)
            let newHeroAdd = {
                key: hero.id,
                text: hero.localized_name,
                value: hero.id
            }
            heroOptions.push(newHeroAdd)
        })

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
                setAllPlayers(usersFiltered)
                console.log(usersFiltered)
            } catch(e) {console.error(e)}
        }
        getAllPlayers()
        }, [])

    //SORTING
    useEffect(() => {
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
        console.log("temparr: ", tempArr)
        setSortablePlayerStats(tempArr)
        //handleSort('games')
      }, [allPlayers,selectedHero])
  
      const handleSort = (clickedColumn) => () => {
          console.log("column: ", column, " clickedColumn: ", clickedColumn)

        if (column !== clickedColumn) {
          console.log('trying to sort by column ' + clickedColumn)
          setDirection('ascending')
          let tempSorted = sortablePlayerStats.sort((a, b) => {
              console.log("a: ", a)
              console.log("b: ", b)
            // if(a[clickedColumn] > 99.9|| b[clickedColumn] > 99.9 ) console.log(a,b)
            if(a[clickedColumn] < b[clickedColumn]) return -1
            if(a[clickedColumn] > b[clickedColumn]) return 1
            return 0
          })
          console.log('tempSorted: ', tempSorted)
          console.log("sorted by: ",clickedColumn)
          setSortablePlayerStats(tempSorted)
          setColumn(clickedColumn)
          return
        }
        
        setSortablePlayerStats(sortablePlayerStats.reverse())
        console.log("sortableplayerstats: ", sortablePlayerStats)
        //setDirection(direction === 'ascending' ? 'descending' : 'ascending')
        setDirection(direction === 'descending' ? 'ascending' : 'descending')
      }
    //END SORTING

    const handleChange = (e, {value}) => {
        setSelectedHero(value)
        setColumn('')
    }
  
    return (
       <div>
            <Dropdown
                placeholder='Select Hero'
                defaultValue={selectedHero}
                fluid
                selection
                options={heroOptions}
                onChange = {handleChange}
                center
            />
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
                    sorted={column === 'winpercentage' ? direction : null}
                    onClick={handleSort('winpercentage')}
                    >
                    Win %
                </Table.HeaderCell>
                <Table.HeaderCell
                    sorted={column === 'losses' ? direction : null}
                    onClick={handleSort('losses')}
                    >
                    Losses
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
                <Table.HeaderCell
                    sorted={column === 'kda' ? direction : null}
                    onClick={handleSort('kda')}
                    >
                    KDA
                </Table.HeaderCell>
            </Table.Row>
            </Table.Header>
            <Table.Body>
                {
                    sortablePlayerStats.map((player) => (  
                        <Table.Row 
                            key={player.player_id}
                        >
                            <Table.Cell>{ playerName(player.player_id) }</Table.Cell>
                            <Table.Cell>{player.games}</Table.Cell>
                            <Table.Cell>{player.wins}</Table.Cell>
                            <Table.Cell>{player.winpercentage.toFixed(1)}</Table.Cell>
                            <Table.Cell>{player.losses}</Table.Cell>
                            <Table.Cell>{player.kills}</Table.Cell>
                            <Table.Cell>{player.kills_game.toFixed(1)}</Table.Cell>
                            <Table.Cell>{player.deaths}</Table.Cell>
                            <Table.Cell>{player.deaths_game.toFixed(1)}</Table.Cell>
                            <Table.Cell>{player.assists}</Table.Cell>
                            <Table.Cell>{player.assists_game.toFixed(1)}</Table.Cell>
                            <Table.Cell>{player.kda.toFixed(1)}</Table.Cell>
                        </Table.Row>
                ))}
            </Table.Body>
            </Table>
       </div> 
    )
}

export default HeroStats;
