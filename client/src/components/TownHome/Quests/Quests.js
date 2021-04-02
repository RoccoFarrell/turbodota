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
    Label,
    CardContent
} from 'semantic-ui-react'
import './Quests.css';

import questIcon from '../../../assets/questIcon.png';
import goldIcon from '../../../assets/gold.png';

function Quest(props) {
  const {selectedUser, setSelectedUser, userID, setUserID} = useContext(TurbodotaContext);
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(selectedUser)

  let townData = props.townData
  let handleTownDataChange = props.handleTownDataChange

  useEffect(() => {
    console.log(selectedUser)
    setUser(selectedUser)
  }, [selectedUser])

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
      quest: quest,
      action: 'completeQuest'
    }

    try {
        axios.post(`/api/towns/${townData.playerID}`, postObj)
        .then(res => {
            let content = res.data;
            handleTownDataChange(content)
        })
    
    } catch(e) {console.error(e)}
  }

  const skipQuest = async (quest) => {
    console.log(quest)
    let postObj = {
      quest: quest,
      action: 'skipQuest'
    }

    try {
        axios.post(`/api/towns/${townData.playerID}`, postObj)
        .then(res => {
            let content = res.data;
            if(content.status == 'failed') {
              console.error(content)
              window.alert(content.message + ', sorry bub')
            }
            else handleTownDataChange(content)
        })
    
    } catch(e) {console.error(e)}
  }

  const calculateAttemptsColor = (attempts) => {
    let color = ""
    if(attempts <= 1) color = "green"
    else if(attempts == 2) color = "orange"
    else if (attempts >= 3) color = "red"
    else color = "blue"

    return color
  }

  const calculateWinRateColor = (rate) => {
    let color = ""
    if(rate <= 35) color = "red"
    else if(rate <= 45) color = "orange"
    else if(rate >= 55) color = "green"
    else color = "grey"

    return color
  }

  const heroWL = (heroID) => {
    if(!!selectedUser.calculated){
      if(!!selectedUser.calculated.allHeroRecord[heroID].games) return selectedUser.calculated.allHeroRecord[heroID]
      else return 0
    }
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
                  <div style={{ marginRight: '1em' }}>#{quest.id}</div>
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
                <Card.Description className={'flexColumn'} style={{ justifyContent: 'flex-begin', paddingBottom: '0em', paddingLeft: '0em', marginTop: '0em'}}>
                  {/* <div className={'flexRow'} style={{ justifyContent: 'flex-start', flexWrap: 'wrap', padding: '0em', margin: '0em'}}>
                    { quest.hero.roles.map(role => (<strong key={role} style={{ margin: '.25em'}}>{ role }</strong>)) }
                  </div> */}
                  
                    <div className={'flexColumn','questCardFooter'} style={{ justifyContent: 'flex-begin', marginBottom: '0em'}}>
                      { (!!user.calculations && !!user.calculations.allHeroRecord[quest.hero.id]) ? (
                      <div className={'flexColumn'} style={{ alignSelf: 'flex-start', justifyContent: 'flex-begin', marginBottom: '0em', padding: '0em'}}>
                        <h4>Hero Stats</h4>
                        <Statistic.Group size='mini' widths={1}>
                          <Statistic size='mini' color={calculateWinRateColor(((user.calculations.allHeroRecord[quest.hero.id].wins / user.calculations.allHeroRecord[quest.hero.id].games) * 100).toFixed(0))}> 
                              <Statistic.Value>{ ((user.calculations.allHeroRecord[quest.hero.id].wins / user.calculations.allHeroRecord[quest.hero.id].games) * 100).toFixed(0) }</Statistic.Value>
                              <Statistic.Label style={{ fontSize: '12px'}}>Win%</Statistic.Label>
                          </Statistic>
                          <Statistic size='mini'> 
                              <Statistic.Value>
                               <div style={{ display: 'inline'}}>{user.calculations.allHeroRecord[quest.hero.id].wins + ' - '}</div> 
                               <div style={{ display: 'inline'}}>{user.calculations.allHeroRecord[quest.hero.id].losses}</div>
                              </Statistic.Value>
                              <Statistic.Label style={{ fontSize: '10px'}}>W - L</Statistic.Label>
                          </Statistic>

                        </Statistic.Group>
                      </div>
                      ) : (<div>Never Played</div>)}
                      <Statistic size='mini' color={calculateAttemptsColor(quest.attempts.length)} style={{ alignSelf: 'center', marginLeft: '2em'}}> 
                          <Statistic.Value>{ quest.attempts.length }</Statistic.Value>
                          <Statistic.Label style={{ fontSize: '10px'}}>{ quest.attempts.length == 1 ? 'Attempt' : 'Attempts'}</Statistic.Label>
                      </Statistic>
                    </div>

                </Card.Description>
              </Card.Content>
              <CardContent
                //style={{ border: '10px solid red' }}
              >
                <Button 
                  size="mini" 
                  color='orange'
                  onClick={() => {skipQuest(quest)}}
                >
                  
                  <Image src={goldIcon} size="mini" className='inline' />
                    Skip Quest (300) 
                </Button>
              
              </CardContent>
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

              <Card.Content >
                <div className={'flexRow'} style={{ justifyContent: 'flex-start', alignItems: 'flex-begin', padding: '0em', margin: '0em'}}>
                  <div style={{ marginRight: '1em' }}>#{quest.id}</div>
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
                <Card.Description className={'flexRow'} style={{ justifyContent: 'flex-end', paddingBottom: '0em', paddingLeft: '0em'}}>
                  {/* <div className={'flexRow'} style={{ justifyContent: 'flex-start', flexWrap: 'wrap', padding: '0em', margin: '0em'}}>
                    { quest.hero.roles.map(role => (<strong key={role} style={{ margin: '.25em'}}>{ role }</strong>)) }
                  </div> */}


                  <div className={'flexRow','questCardFooter'} style={{ alignSelf: 'flex-end', justifyContent: 'flex-begin', marginBottom: '0em'}}>
                    <Statistic size='mini' color={calculateAttemptsColor(quest.attempts.length)}> 
                        <Statistic.Value>{ quest.attempts.length }</Statistic.Value>
                        <Statistic.Label style={{ fontSize: '10px'}}>{ quest.attempts.length == 1 ? 'Attempt' : 'Attempts'}</Statistic.Label>
                    </Statistic>
                  </div>
                </Card.Description>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
      </div>
      <h2>Skipped</h2>
      <div className={'flexRow'}>
        <Card.Group>
          { townData.skipped.map(quest => (
            <Card 
              key={quest.id} 
              className={'questCard'} 
              color ={ 'grey'} 
              style={{ width: '225px' }}
            >
              <Card.Content extra>
                <Image 
                  src={questIcon}
                  as='i' 
                  width='35px'
                  alt='choose yer quest'
                /> Quest Skipped
              </Card.Content>

              <Card.Content >
                <div className={'flexRow'} style={{ justifyContent: 'flex-start', alignItems: 'flex-begin', padding: '0em', margin: '0em'}}>
                  <div style={{ marginRight: '1em' }}>#{quest.id}</div>
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
                <Card.Description className={'flexRow'} style={{ justifyContent: 'flex-end', paddingBottom: '0em', paddingLeft: '0em'}}>
                  {/* <div className={'flexRow'} style={{ justifyContent: 'flex-start', flexWrap: 'wrap', padding: '0em', margin: '0em'}}>
                    { quest.hero.roles.map(role => (<strong key={role} style={{ margin: '.25em'}}>{ role }</strong>)) }
                  </div> */}


                  <div className={'flexRow','questCardFooter'} style={{ alignSelf: 'flex-end', justifyContent: 'flex-begin', marginBottom: '0em'}}>
                    <Statistic size='mini' color={calculateAttemptsColor(quest.attempts.length)}> 
                        <Statistic.Value>{ quest.attempts.length }</Statistic.Value>
                        <Statistic.Label style={{ fontSize: '10px'}}>{ quest.attempts.length == 1 ? 'Attempt' : 'Attempts'}</Statistic.Label>
                    </Statistic>
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
