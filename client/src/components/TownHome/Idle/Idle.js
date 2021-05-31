import React, { useState, useEffect, useContext } from 'react';
import {
    Grid
} from 'semantic-ui-react'
import './Idle.css';

// import goldIcon from '../../../assets/gold.png';
// import xpIcon from '../../../assets/xp.png';
// import turboTownIcon from '../../../assets/turbotown.png';

import IdleBox from './IdleBox/IdleBox'

function Idle() {
  const [idleData, setIdleData] = useState({
    skills: {
      strength: {
        xp: 0,
        level: 0,
        trainingInterval: 3
      },
      agility: {
        xp: 0,
        level: 0,
        trainingInterval: 1
      },
      intelligence: {
        xp: 0,
        level: 0,
        trainingInterval: 2
      },
    }
  })

  return (
      <Grid columns={1}>
        <Grid.Column>
          { !!idleData.skills ? (
            <div>
              { Object.entries(idleData.skills).map((skill, key) => {
                return (
                  <IdleBox key={key} skill={skill}/>
                )
              })}
            </div>
          ) : ''}
        </Grid.Column>
      </Grid>
  )
}

export default Idle;
