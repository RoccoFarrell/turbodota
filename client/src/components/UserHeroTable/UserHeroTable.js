import React, { useState, useEffect, useContext } from 'react';
import {
    Table,
    Image,
    Checkbox
} from 'semantic-ui-react'
import './UserHeroTable.css'
import TurbodotaContext from '../TurbodotaContext'

import squirrel from '../../assets/squirrel.png';
import UserMatchHistory from '../UserMatchHistory/UserMatchHistory';

function UserHeroTable(props) {
  
    const { heroesList } = useContext(TurbodotaContext);

    const [column, setColumn] = useState('')
    const [direction, setDirection] = useState('ascending')
    const [sortableHeroStats, setSortableHeroStats] = useState([])
    const heroStats = props.heroStats

    const [checked, setChecked] = React.useState(false);
    const perGame = false

    useEffect(() => {
      let tempArr = []
      Object.keys(heroStats).forEach((heroKey) => {
        let pushObj = {
          hero_id: heroKey,
          heroname: heroName(heroKey),
          games: heroStats[heroKey].games,
          wins: heroStats[heroKey].wins,
          losses: heroStats[heroKey].losses,
          winpercentage: ((heroStats[heroKey].wins / heroStats[heroKey].games) * 100),
          kills: heroStats[heroKey].kills,
          deaths: heroStats[heroKey].deaths,
          assists: heroStats[heroKey].assists,
          kda: (heroStats[heroKey].kills + heroStats[heroKey].assists) / heroStats[heroKey].deaths,
          killsPerGame: heroStats[heroKey].kills / heroStats[heroKey].games,
          deathsPerGame: heroStats[heroKey].deaths / heroStats[heroKey].games,
          assistsPerGame: heroStats[heroKey].assists / heroStats[heroKey].games
        }

        tempArr.push(pushObj)

      })
      setSortableHeroStats(tempArr)
      // handleSort('games')
    }, [])

    const handleSort = (clickedColumn) => () => {
      // console.log('called ' + clickedColumn)
      if (column !== clickedColumn) {
        console.log('trying to sort by column ' + clickedColumn)
        setDirection('ascending')
        let tempSorted = sortableHeroStats.sort((a, b) => {
          // if(a[clickedColumn] > 99.9|| b[clickedColumn] > 99.9 ) console.log(a,b)
          if(a[clickedColumn] < b[clickedColumn]) return -1
          if(a[clickedColumn] > b[clickedColumn]) return 1
          return 0
        })
        
        console.log('tempSorted: ', tempSorted)
        setSortableHeroStats(tempSorted)
        setColumn(clickedColumn)
        return
      }
      
      setSortableHeroStats(sortableHeroStats.reverse())
      // sortableHeroStats = sortableHeroStats.reverse()
      setDirection(direction === 'ascending' ? 'descending' : 'ascending')
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

    const handleChange = () => {
      setChecked(!checked);
    };
    
    return (     
      <Table compact sortable celled fixed>
        <Table.Header>
        <Checkbox toggle className = "toggle-switch" value={checked} label = "Toggle Per Game" onChange={ handleChange }></Checkbox>
          <Table.Row>
            <Table.HeaderCell
              sorted={column === 'id' ? direction : null}
              onClick={handleSort('id')}
            >
              Hero ID
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'heroname' ? direction : null}
              onClick={handleSort('heroname')}
              
            >
              Hero
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'games' ? direction : null}
              onClick={handleSort('games')}
            >
              Games
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'winpercentage' ? direction : null}
              onClick={handleSort('winpercentage')}
            >
              Win %
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

            { !checked ? (
              <Table.HeaderCell
              sorted={column === 'kills' ? direction : null}
              onClick={handleSort('kills')}
            >
              Kills
            </Table.HeaderCell>
            ) : (
              <Table.HeaderCell
              sorted={column === 'kills' ? direction : null}
              onClick={handleSort('kills')}
            >
              Kills/Game
            </Table.HeaderCell>
            )}
            
            { !checked ? (
              <Table.HeaderCell
              sorted={column === 'deaths' ? direction : null}
              onClick={handleSort('deaths')}
            >
              Deaths
            </Table.HeaderCell>
            ) : (
              <Table.HeaderCell
              sorted={column === 'deaths' ? direction : null}
              onClick={handleSort('deaths')}
            >
              Deaths/Game
            </Table.HeaderCell>
            )}

            { !checked ? (
              <Table.HeaderCell
              sorted={column === 'assists' ? direction : null}
              onClick={handleSort('assists')}
            >
              Assists
            </Table.HeaderCell>
            ) : (
              <Table.HeaderCell
              sorted={column === 'assists' ? direction : null}
              onClick={handleSort('assists')}
            >
              Assists/Game
            </Table.HeaderCell>
            )}

            <Table.HeaderCell
              sorted={column === 'kda' ? direction : null}
              onClick={handleSort('kda')}
            >
              KDA
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
        {sortableHeroStats.map((hero) => (
          <Table.Row 
            positive = { hero.winpercentage > 55 }
            negative = { hero.winpercentage < 45 }
            key={hero.hero_id}
          >
            <Table.Cell>{hero.hero_id}</Table.Cell>
            <Table.Cell>
              <div className='customFlexRow'>
                <div style={{ marginRight: '1em', overflow: 'auto', whiteSpace: 'nowrap'}}>
                  { heroIcon(hero.hero_id) }
                </div>
                <div>
                  { heroName(hero.hero_id) }
                </div>
              </div>
            </Table.Cell>
            <Table.Cell>{hero.games}</Table.Cell>
            <Table.Cell>{ hero.winpercentage.toFixed(1) }</Table.Cell>
            <Table.Cell>{hero.wins}</Table.Cell>
            <Table.Cell>{hero.losses}</Table.Cell>
            { !checked ? (
              <Table.Cell>{hero.kills}</Table.Cell>
            ) : (
              <Table.Cell>{hero.killsPerGame.toFixed(1)}</Table.Cell>
            )}
            { !checked ? (
              <Table.Cell>{hero.deaths}</Table.Cell>
            ) : (
              <Table.Cell>{hero.deathsPerGame.toFixed(1)}</Table.Cell>
            )}
            { !checked ? (
              <Table.Cell>{hero.assists}</Table.Cell>
            ) : (
              <Table.Cell>{hero.assistsPerGame.toFixed(1)}</Table.Cell>
            )}   
            <Table.Cell>{ hero.kda.toFixed(1) }</Table.Cell>
          </Table.Row>
        ))}
        </Table.Body>
      </Table>
    )
}

export default UserHeroTable;