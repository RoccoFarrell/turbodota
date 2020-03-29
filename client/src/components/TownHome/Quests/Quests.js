import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from "react-router-dom";
import TurbodotaContext from '../../TurbodotaContext'
import axios from 'axios'
import {
    Container,
    Card,
    Icon,
    Image,
    Header,
    Statistic,
    Tab,
    Button,
    Label
} from 'semantic-ui-react'
import './Quests.css';

import questIcon from '../../../assets/questIcon.png';

function Quest(props) {
  const [loading, setLoading] = useState(false)

  let townData = props.townData
  let handleTownDataChange = props.handleTownDataChange

  const processDate = (date) => {
    let tempDate = new Date(date._seconds * 1000)
    return tempDate.toLocaleDateString()
  }

  const heroIcon = (hero_id, zoom) => {
    let heroString = 'd2mh hero-' + hero_id
    return <i style={{ zoom: zoom, padding: '0px' }} className={heroString}/>
  }

  const handleCheckProgress = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }

  const completeQuest = async (quest) => {
    console.log(quest)
    let postObj = {
      townData: townData,
      action: 'completeQuest'
    }
    postObj.townData.completed.push(quest)
    postObj.townData.active = postObj.townData.active.filter(q => q.id != quest.id)

    try {
        axios.post(`/api/towns/${townData.playerID}`, postObj)
        .then(res => {
            let content = res.data;
            handleTownDataChange(content)
        })
    
    } catch(e) {console.error(e)}
  }

  return (
    <div style={{ textAlign: 'center'}}>
      {/* <div className={'flexRow'}>
        <Button color='green' loading={loading} onClick={() => {
          handleCheckProgress()
        }}>
          Check Progress
        </Button>
      </div> */}
      <h2>Active</h2>
      <div className={'flexRow'}>
        <Card.Group>
          { townData.active.map(quest => (
            <Card 
              key={quest.id} 
              className={'questCard'} 
              color ={ quest.completed ? 'yellow': 'grey'} 
              raised={ quest.completed ? true : false} 
              style={ quest.completed ? { width: '225px' , backgroundColor: 'rgba(255,216,104, 0.1)',} : { width: '225px' }}
            >
              <Card.Content extra>
                <Image 
                  src={questIcon}
                  as='i' 
                  width='35px'
                  alt='choose yer quest'
                /> Quest!
                <Button 
                  color='yellow' 
                  disabled = { quest.completed == false } 
                  style={{ width: '100px', marginLeft: '1em', padding: '.5em'}}
                  onClick={() => {completeQuest(quest)}}
                >
                  { quest.completed ? 'Turn In' : 'Not Done'}
                </Button>
              </Card.Content>

              <Card.Content>
                <div className={'flexRow'} style={{ justifyContent: 'flex-start', alignItems: 'flex-begin', padding: '0em', margin: '0em'}}>
                  <div className={'flexColumn'} style={{ width: '50px', height: '50px', padding: '0em', margin: '0em'}}>
                    { heroIcon(quest.hero.id, 1) }
                  </div>
                  <div className={'flexColumn'} style={{ paddingTop: '.25em'}}>
                    <Card.Header>{ quest.hero.localized_name }</Card.Header>
                    <Card.Meta>
                      <span>{ processDate(quest.startTime) }</span>
                    </Card.Meta>
                  </div>
                </div>
                <Card.Description className={'flexColumn'}>
                  <div className={'flexRow'} style={{ justifyContent: 'flex-start', flexWrap: 'wrap', padding: '0em', margin: '0em'}}>
                    { quest.hero.roles.map(role => (<Label key={role} size='mini' style={{ margin: '.25em'}}> { role }</Label>)) }
                  </div>
                  <div className={'flexRow'} style={{ alignSelf: 'flex-start', justifyContent: 'flex-end', marginBottom: '0em'}}>
                    Attempts: { quest.attempts.length }
                  </div>
                </Card.Description>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
      </div>
      <h2>Complete</h2>
      <div className={'flexRow'}>
        <Card.Group>
          { townData.completed.map(quest => (
            <Card 
              key={quest.id} 
              className={'questCard'} 
              color ={ 'grey'} 
              style={ quest.completed ? { width: '225px' , backgroundColor: '#F5F5F5'} : { width: '225px' }}
            >
              <Card.Content extra>
                <Image 
                  src={questIcon}
                  as='i' 
                  width='35px'
                  alt='choose yer quest'
                /> Quest Complete
              </Card.Content>

              <Card.Content>
                <div className={'flexRow'} style={{ justifyContent: 'flex-start', alignItems: 'flex-begin', padding: '0em', margin: '0em'}}>
                  <div className={'flexColumn'} style={{ width: '50px', height: '50px', padding: '0em', margin: '0em'}}>
                    { heroIcon(quest.hero.id, 1) }
                  </div>
                  <div className={'flexColumn'} style={{ paddingTop: '.25em'}}>
                    <Card.Header>{ quest.hero.localized_name }</Card.Header>
                    <Card.Meta>
                      <span>{ processDate(quest.startTime) }</span>
                    </Card.Meta>
                  </div>
                </div>
                <Card.Description>
                  <div className={'flexRow'} style={{ justifyContent: 'flex-start', flexWrap: 'wrap', padding: '0em', margin: '0em'}}>
                    { quest.hero.roles.map(role => (<strong key={role} style={{ margin: '.25em'}}>{ role }</strong>)) }
                  </div>
                </Card.Description>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
      </div>
    </div>

  )
}

export default Quest;
