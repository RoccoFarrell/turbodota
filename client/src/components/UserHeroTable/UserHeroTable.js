import React, { useState, useEffect, useContext } from 'react';
import {
    Table
} from 'semantic-ui-react'
import './UserHeroTable.css'
import TurbodotaContext from '../TurbodotaContext'

function UserHeroTable(props) {
    const { heroesList } = useContext(TurbodotaContext);

    const [column, setColumn] = useState('')
    const [direction, setDirection] = useState('ascending')
    const [sortableHeroStats, setSortableHeroStats] = useState([])

    const heroStats = props.heroStats

    useEffect(() => {
      let tempArr = []
      Object.keys(heroStats).forEach((heroKey) => {
        let pushObj = {
          hero_id: heroKey,
          heroname: heroName(heroKey),
          games: heroStats[heroKey].games,
          wins: heroStats[heroKey].wins,
          losses: heroStats[heroKey].losses,
          winpercentage: ((heroStats[heroKey].wins / heroStats[heroKey].games) * 100)
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
      return <i style={{ zoom: .5, padding: '0px' }} className={heroString}/>
    }
  
    const heroName = (hero_id) => {
      // console.log('hero_id: ' + hero_id)
      return heroesList.filter(hero => hero.id == hero_id)[0].localized_name
    }

    return (
      <Table compact sortable celled fixed>
        <Table.Header>
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
                <div style={{ marginRight: '1em'}}>
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
          </Table.Row>
        ))}
        </Table.Body>
      </Table>
    )
}

export default UserHeroTable;
