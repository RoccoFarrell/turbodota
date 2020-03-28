import React, { useState, useEffect, useContext } from 'react';
import {
    Table,
    Card,
    Grid,
    Pagination
} from 'semantic-ui-react'
import './UserMatchHistory.css'
import TurbodotaContext from '../TurbodotaContext'
import SingleMatch from '../SingleMatch/SingleMatch'

function UserMatchHistory(props) {
    const { heroesList } = useContext(TurbodotaContext);
    const matchStats = props.matchStats

    const [activePage, setActivePage] = useState(1)

    let countTotalPages = (Math.floor(matchStats.length / 10)) + 1
    const [totalPages, setTotalPages] = useState(countTotalPages)
    const [matchSubset, setMatchSubset] = useState([])

    // const heroIcon = (hero_id) => {
    //   let heroString = 'd2mh hero-' + hero_id
    //   return <i style={{ zoom: .5, padding: '0px' }} className={heroString}/>
    // }
  
    // const heroName = (hero_id) => {
    //   // console.log('hero_id: ' + hero_id)
    //   // return heroesList.filter(hero => hero.id == hero_id)[0].localized_name
    //   if(hero_id === 0 || hero_id === '0') {
    //     return 'HeroZero'
    //   } else {
    //     return heroesList.filter(hero => hero.id == hero_id)[0].localized_name
    //   }
      
    // }

    const handlePaginationChange = (e, { activePage }) => setActivePage(activePage)

    useEffect(() => {
      let offsetIndex = (activePage - 1) * 10
      // console.log('activePage: ', activePage, 'offsetIndex: ', offsetIndex)
      setMatchSubset(matchStats.slice(offsetIndex, offsetIndex + 10))
    }, [activePage])

    return (
      <div>
        <Grid columns={1}>
          <Grid.Column>
            <Pagination
                // boundaryRange={boundaryRange}
                onPageChange={handlePaginationChange}
                size='mini'
                style={{ width: '100%'}}
                // siblingRange={siblingRange}
                totalPages={ totalPages }
                defaultActivePage={1}
                secondary
                pointing
                // // Heads up! All items are powered by shorthands, if you want to hide one of them, just pass `null` as value
                // ellipsisItem={showEllipsis ? undefined : null}
                firstItem={null}
                lastItem={null}
                // prevItem={showPreviousAndNextNav ? undefined : null}
                // nextItem={showPreviousAndNextNav ? undefined : null}
            />
          </Grid.Column>
          <Grid.Column>
            <Card.Group centered itemsPerRow={1}>
              {matchSubset.map((match) => (
                  <SingleMatch 
                  key = {match.match_id}
                  matchData={match}/>
              ))}
            </Card.Group>
          </Grid.Column>
        </Grid>
      </div>
    )
}

export default UserMatchHistory;
