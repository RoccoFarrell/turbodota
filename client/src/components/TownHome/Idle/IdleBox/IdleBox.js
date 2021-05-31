import React, { useState, useEffect, useContext } from 'react';
import {
    Card,
    Statistic,
    Button
} from 'semantic-ui-react'
import './IdleBox.css';

// import goldIcon from '../../../assets/gold.png';
// import xpIcon from '../../../assets/xp.png';
// import turboTownIcon from '../../../assets/turbotown.png';

function IdleBox(props) {
  const [skillName, setSkillName] = useState(props.skill[0])
  const [skillDetails, setSkillDetails] = useState(props.skill[1])
  //console.log(props.skill)

  const [enableTraining, setEnableTraining] = useState(false)
  const [meterClassName, setMeterClassName] = useState('')
  const [activeMeterClass, setActiveMeterClass] = useState('')
  const [skillCount, setSkillCount] = useState(0)
  const [skillTimeout, setSkillTimeout] = useState(0)

  const [skillTiming, setSkillTiming] = useState({
    baseTrainInterval: 5
  })

  //on mount effect
  useEffect(() => {
    let classes = ''
    if(skillDetails.trainingInterval === 1) classes += 'idleProgress1s'
    if(skillDetails.trainingInterval === 2) classes += 'idleProgress2s'
    if(skillDetails.trainingInterval === 3) classes += 'idleProgress3s'
    setMeterClassName(classes)

    //set skill from cache
    let cachedSkill = window.localStorage.getItem('turbotown-idle-' + skillName)
    if(cachedSkill !== null){
      let parsedSkill = JSON.parse(cachedSkill)
      setSkillDetails(parsedSkill)
      setSkillCount(parsedSkill.xp)
    }
  },[])

  // useEffect(() => {
  //   console.log('test skill details: ', skillDetails)
  // }, [skillDetails])

  const createTimeout = () => {
    setActiveMeterClass(meterClassName)
    let interval = setTimeout(() => {
      let count = skillCount + 1
      setSkillCount(count)
      setActiveMeterClass('')
    }, skillDetails.trainingInterval * 1000)
    setSkillTimeout(interval) 
  }

  useEffect(() => {
    //console.log('enable training', enableTraining)
    if(enableTraining){
      createTimeout()
    }
    if(!enableTraining) {
      clearTimeout(skillTimeout)
      setActiveMeterClass('')
    }
  }, [enableTraining, skillCount])

  useEffect(() => {
    //console.log(window.localStorage.getItem('turbotown-idle-' + skillName))
    if(enableTraining){
      let skillObj = skillDetails
      skillObj.xp += 1
      // if(window.localStorage.getItem('turbotown-idle-' + skillName) === null){
      //   window.localStorage.setItem('turbotown-idle-' + skillName, JSON.stringify(skillObj))
      // } else 
      window.localStorage.setItem('turbotown-idle-' + skillName, JSON.stringify(skillObj))
    }
  }, [skillCount])

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
  const handleSkillIdle = (input) => {
    console.log('setting to ', input)
    setEnableTraining(input)
  }

  return (
    <Card fluid className={'skillCard'}>
      <Card.Content>
        <Card.Header>
          {capitalize(skillName)}
        </Card.Header>
        <Card.Description>
          <Statistic color='yellow' label='XP' value={skillCount}/>
        </Card.Description>
        <Card.Description>
          <div className={"meter"}>
            <span className={activeMeterClass}/>
          </div>
          <Button 
            color={skillColor(skillName)}
            onClick={() => handleSkillIdle(!enableTraining)}
            //onClick={() => test('test')}
          >
            { 'Train ' + capitalize(skillName)}
          </Button>
        </Card.Description>
      </Card.Content>
    </Card>
  )
}

export default IdleBox;
