import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useHistory } from "react-router-dom";
import TurbodotaContext from '../../../TurbodotaContext'
import axios from 'axios'
import {
    Checkbox,
    Grid,
    Modal,
    Container,
    Card,
    Icon,
    Image,
    Header,
    Statistic,
    Tab,
    Button,
    Progress,
    Menu,
    Sidebar,
    Segment,
    Dropdown
} from 'semantic-ui-react'
import './IdleBox.css';

// import goldIcon from '../../../assets/gold.png';
// import xpIcon from '../../../assets/xp.png';
// import turboTownIcon from '../../../assets/turbotown.png';

function IdleBox(props) {
  const [idleData, setIdleData] = useState({
    skills: {
      'strength': {
        'xp': 0,
        'level': 0
      },
      'agility': {
        'xp': 0,
        'level': 0
      },
      'intelligence': {
        'xp': 0,
        'level': 0
      },
    }
  })

  const skill = props.skill

  const [barXP, setBarXP] = useState(0)
  const [enableTraining, setEnableTraining] = useState(false)

  const [skillTiming, setSkillTiming] = useState({
    baseTrainInterval: 5
  })

  useEffect(() => {
    //console.log('barXP: ' + barXP)
    if(barXP === 100 && enableTraining) {
      setBarXP(0)
      progressTo100()
    }

    if(!enableTraining) {
      setBarXP(0)
    }
  }, [barXP])

  useEffect(() => {
    console.log('here')
    if(enableTraining) progressTo100()
    // while(enableTraining) {
    //   if(barXP === 100) {
    //     setBarXP(0)
    //   }
    // }
    //   console.log('barXP', barXP)
    //   if(barXP === 0) {
    //     setTimeout(() => {
    //       progressTo100()
    //     }, 1000 * skillTiming.baseTrainInterval)
    //   }
    // }
  }, [enableTraining])

  const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  const skillColor = (s) => {
    let returnColor = 'grey'
    if(s.toString() === 'strength') returnColor = 'red'
    if(s.toString() === 'agility') returnColor = 'green'
    if(s.toString() === 'intelligence') returnColor = 'blue'
    return returnColor
  }

  const SkillProgressBar =  (width, percent) => {
      return (
      <div className="progress-div" style={{width: '600px'}}>
           <div style={{width: `${percent}%`}}className="progress"/>
      </div>
    )
  }

  const progressTo100 = () => {
    let progress = 0
    // setInterval(() => {
    //   progress += 1
    //   setBarXP(progress)
    // }, 5 * skillTiming.baseTrainInterval)
    for(let i = 0; i <= 100; i += .5){
      setTimeout(() => {
        setBarXP(i)
      }, (i * 5 * skillTiming.baseTrainInterval))
    }
  }

  const handleSkillIdle = (input) => {
    console.log('setting to ', input)
    setEnableTraining(input)
  }

  const test = (input) => {
    console.log('test', input)
  }

  return (
    <Card fluid className={'skillCard'}>
      <Card.Content>
        <Card.Header>{ capitalize(skill[0]) }</Card.Header>
        <Card.Description>
          <div class="meter">
            <span style={{ width: '80%'}}><span class="progress2"></span></span>
          </div>
          {SkillProgressBar(500, barXP)}
          <Button 
            color={skillColor(skill[0])}
            onClick={() => handleSkillIdle(!enableTraining)}
            //onClick={() => test('test')}
          >
            { 'Train ' + capitalize(skill[0])}
          </Button>
        </Card.Description>
      </Card.Content>
    </Card>
  )
}

export default IdleBox;
