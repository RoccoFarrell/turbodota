import React, { useState, useEffect, useContext } from 'react';
import {
    Table
} from 'semantic-ui-react'
import './Leaderboard.css'
import TurbodotaContext from '../TurbodotaContext'
import axios from 'axios'

function Leaderboard(props) {
    const { heroesList } = useContext(TurbodotaContext);

    const [column, setColumn] = useState('')
    const [direction, setDirection] = useState('ascending')

    const [allTowns, setAllTowns] = useState([])
    const [allPlayers, setAllPlayers] = useState([])

    useEffect(() => {
      async function getAllTowns(){
          try {
              axios.get(`/api/towns`)
              .then(res => {
                  let content = res.data;
                  console.log('AllTownData: ', content)
                  let sortedArr = initialSort(content)
                  setAllTowns(sortedArr)
              })
          
          } catch(e) {console.error(e)}
      }
      async function getAllPlayers(){
        try {
            axios.get(`/api/users`)
            .then(res => {
                let content = res.data;
                let usersFiltered = content.users.filter(user => !!user.profile)
                console.log('UsersFiltered: ', usersFiltered)
                usersFiltered.forEach(user => {
                  console.log(user.profile.account_id)
                })  
                setAllPlayers(usersFiltered)
            })
        
        } catch(e) {console.error(e)}
    }
    getAllTowns()
    getAllPlayers()
    
    }, [])

    const initialSort = (data) => {
      let tempSorted = data.sort((a, b) => {
        // if(a[clickedColumn] > 99.9|| b[clickedColumn] > 99.9 ) console.log(a,b)
        if(a['xp'] < b['xp']) return 1
        if(a['xp'] > b['xp']) return -1
        return 0
      })
      setColumn('xp')
      return tempSorted
    }

    const handleSort = (clickedColumn) => () => {
      console.log('called ' + clickedColumn)
      if (column !== clickedColumn) {
        console.log('trying to sort by column ' + clickedColumn)
        setDirection('ascending')
        let tempSorted = allTowns.sort((a, b) => {
          // if(a[clickedColumn] > 99.9|| b[clickedColumn] > 99.9 ) console.log(a,b)
          if(clickedColumn === 'nonTownGames' || clickedColumn === 'totalTownGames') {
            if(a.townStats.clickedColumn < b.townStats.clickedColumn) return -1
            if(a.townStats.clickedColumn > b.townStats.clickedColumn) return 1
          } else {
            if(a[clickedColumn] < b[clickedColumn]) return -1
            if(a[clickedColumn] > b[clickedColumn]) return 1
          }
          return 0
        })
        console.log('tempSorted: ', tempSorted)
        setAllTowns(tempSorted)
        setColumn(clickedColumn)
        return
      }
      
      setAllTowns(allTowns.reverse())
      // sortableHeroStats = sortableHeroStats.reverse()
      setDirection(direction === 'ascending' ? 'descending' : 'ascending')
    }

    const heroIcon = (hero_id) => {
      let heroString = 'd2mh hero-' + hero_id
      return <i style={{ zoom: .5, padding: '0px' }} className={heroString}/>
    }
  
    const heroName = (hero_id) => {
      // console.log('hero_id: ' + hero_id)
      // return heroesList.filter(hero => hero.id == hero_id)[0].localized_name
      if(hero_id === 0 || hero_id === '0') {
        return 'HeroZero'
      } else {
        return heroesList.filter(hero => hero.id == hero_id)[0].localized_name
      }
      
    }

    const calculateTownWinRate = (town) => {
      let attempts = town.townStats.totalAttemptGames
      if(town.completed.length == 0) return 0
      else return ((town.completed.length / attempts) * 100).toFixed(0)
    }

    const fetchPlayerName = (playerID) => {
      let returnName = 'n/a'
      allPlayers.forEach(player => {
        if(player.profile.account_id === playerID) returnName = player.profile.personaname
      })
      return returnName
    }

    return (
      <Table compact sortable celled fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sorted={column === 'id' ? direction : null}
              onClick={handleSort('id')}
            >
              PlayerID
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'playername' ? direction : null}
              onClick={handleSort('playername')}
            >
              Player
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'gold' ? direction : null}
              onClick={handleSort('gold')}
              // style={{width: '75px!important'}}
            >
              Gold
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'xp' ? direction : null}
              onClick={handleSort('xp')}
            >
              XP
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'completedQuests' ? direction : null}
              onClick={handleSort('completedQuests')}
            >
              Completed Quests
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'totalAttempts' ? direction : null}
              onClick={handleSort('totalAttempts')}
            >
              Total Town Trys
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'rate' ? direction : null}
              onClick={handleSort('rate')}
            >
              Conversion %
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'nonTownGames' ? direction : null}
              onClick={handleSort('nonTownGames')}
            >
              Non-Town Games
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'totalTownGames' ? direction : null}
              onClick={handleSort('totalTownGames')}
            >
              Total Town Games
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
        {allTowns.map((town) => (
          <Table.Row 
            positive = { town.winpercentage > 55 }
            negative = { town.winpercentage < 45 }
            key={town.playerID}
          >
            <Table.Cell>{town.playerID}</Table.Cell>
            <Table.Cell style={{fontWeight: 'bold'}}>{fetchPlayerName(town.playerID)}</Table.Cell>
            <Table.Cell>{town.xp}</Table.Cell>
            <Table.Cell>{ town.gold }</Table.Cell>
            <Table.Cell>{town.completed.length}</Table.Cell>
            <Table.Cell>{town.townStats.totalAttemptGames}</Table.Cell>
            <Table.Cell>{calculateTownWinRate(town)}%</Table.Cell>
            <Table.Cell>{town.townStats.nonTownGames}</Table.Cell>
            <Table.Cell>{town.townStats.totalTownGames}</Table.Cell>
          </Table.Row>
        ))}
        </Table.Body>
      </Table>
    )
}

export default Leaderboard;
