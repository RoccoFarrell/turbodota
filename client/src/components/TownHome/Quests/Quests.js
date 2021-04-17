import React, { useState, useEffect, useContext } from 'react';
import TurbodotaContext from '../../TurbodotaContext'
import axios from 'axios'
import {
    Checkbox,
    Container,
    Card,
    Icon,
    Image,
    Header,
    Statistic,
    Tab,
    Button,
    Label,
    CardContent,
    Grid
} from 'semantic-ui-react'
import './Quests.css';

import questIcon from '../../../assets/questIcon.png';
import goldIcon from '../../../assets/gold.png';

function Quest(props) {
  const {selectedUser, setSelectedUser, userID, setUserID, steamUser} = useContext(TurbodotaContext);
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(selectedUser)
  const [authorizedUser, setAuthorizedUser] = useState(false)
  const [checkedQuests, setCheckedQuests] = useState({})
  const [obsQuests, setObsQuests] = useState({})

  let townData = props.townData
  let handleTownDataChange = props.handleTownDataChange
  let handleCheckedQuestsChange = props.handleCheckedQuestsChange
  let questGroup = props.questGroup
  let devEnv = props.devEnv

  useEffect(() => {
    console.log(selectedUser)
    setUser(selectedUser)
    checkAuthorizedUser(selectedUser, steamUser)
  }, [selectedUser])

  // useEffect(() => {
  //   handleCheckedQuestsChange(checkedQuests)
  // }, [checkedQuests])

  const checkDevEnv = () => {
    if(process.env.NODE_ENV === "development" && devEnv) return true
    else return false
  }

  const checkAuthorizedUser = (selectedUser, steamUser) => {
    if(!!selectedUser.userStats && !!selectedUser.userStats.profile.steamid && !!steamUser.id) {
      if(selectedUser.userStats.profile.steamid == steamUser.id) setAuthorizedUser(true)
      else setAuthorizedUser(false)
    }
    else setAuthorizedUser(false)
  }

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
      action: 'completeQuest',
      obs: obsQuests[quest.id] ? obsQuests[quest.id] : false
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

  const checkboxReducer = (questID) => {
    let tempObj = checkedQuests
    if(!tempObj[questID]) tempObj[questID] = false
    tempObj[questID] = !tempObj[questID]
    handleCheckedQuestsChange(checkedQuests)
    setCheckedQuests(checkedQuests)
  }

  const obsCheckboxReducer = (questID) => {
    let tempObj = obsQuests
    if(!tempObj[questID]) tempObj[questID] = false
    tempObj[questID] = !tempObj[questID]
    setObsQuests(obsQuests)
    console.log(obsQuests)
  }
  
  return (
    <div style={{ textAlign: 'center'}}>
      {/* <div className={'questCardFlexRow'}>
        <Button color='green' loading={loading} onClick={() => {
          handleCheckProgress()
        }}>
          Check Progress
        </Button>
      </div> */}
      <div className={'questCardFlexRow'}>
        <Card.Group centered>
          { townData[questGroup].map((quest, index) => (
            <Card 
              fluid
              key={quest.id} 
              className={ questGroup == 'active' ? 'questCardActive' : ''} 
              color ={ quest.completed && questGroup == 'active' ? 'yellow': 'green'} 
              raised={ quest.completed && questGroup == 'active' ? true : false} 
              style={ quest.completed && questGroup == 'active' ? { backgroundColor: 'rgba(255,216,104, 0.1)'} : {}}
            >
              <Card.Content extra>
                <div className='questCardFlexRow'>
                  <Image 
                    src={questIcon}
                    as='i' 
                    width='35px'
                    alt='choose yer quest'
                    style={{ marginRight: '1em'}}
                  /> { questGroup == 'active' ? 'Quest #' + quest.id : 'Quest Complete' }
                </div>
              </Card.Content>

              <Card.Content>
                <Grid columns={3} divided>
                  <Grid.Column>
                    {/* Hero Icon Name and Start Date*/}
                    <div className={'questCardFlexRow'} style={{ alignItems: 'flex-begin', padding: '0em', margin: '0em'}}>
                      <div className={'flexColumn'} style={{ width: '50px', height: '50px', padding: '0em', margin: '0em'}}>
                        { heroIcon(quest.hero.id, 1) }
                      </div>
                      <div className={'flexColumn'} style={{ paddingTop: '.25em'}}>
                        <Card.Header style={{ fontSize: '1.4em', margin: '2px' }}>{ quest.hero.localized_name }</Card.Header>
                        <Card.Meta>
                          <span>{ processDate(quest.startTime) }</span>
                        </Card.Meta>
                      </div>
                      {/* { quest.hero.roles.map(role => (<strong key={role} style={{ margin: '.25em'}}>{ role }</strong>)) } */}
                    </div>
                  </Grid.Column>
                  <Grid.Column>
                    {/* Hero Stats */}
                    { questGroup == 'active' ? 
                      <div className={'flexColumn','questCardFooter'} style={{ justifyContent: 'flex-begin', marginBottom: '0em'}}>
                        { (!!user.calculations && !!user.calculations.allHeroRecord[quest.hero.id]) ? (
                        <div className={'flexColumn'} style={{ alignSelf: 'flex-start', justifyContent: 'flex-begin', marginBottom: '0em', padding: '0em'}}>
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
                    : 
                      <Statistic size='mini' color={calculateAttemptsColor(quest.attempts.length)} style={{ alignSelf: 'center', marginLeft: '2em'}}> 
                          <Statistic.Value>{ quest.attempts.length }</Statistic.Value>
                          <Statistic.Label style={{ fontSize: '10px'}}>{ quest.attempts.length == 1 ? 'Attempt' : 'Attempts'}</Statistic.Label>
                      </Statistic>
                    }
                  </Grid.Column>
                  <Grid.Column>
                    {/* Action Buttons */}
                    <div>
                      { questGroup == 'active' ?
                      <div className='turnInRow'>
                        <Button 
                          color='yellow' 
                          disabled = { quest.completed == false } 
                          style={{ width: '100px', marginLeft: '1em', padding: '.5em'}}
                          onClick={() => {completeQuest(quest)}}
                        >
                          { quest.completed ? 'Turn In' : 'Not Done'}
                        </Button>
                        { /* TODO: add requirement that user has an obs in inventory to display checkbox below*/}
                        { quest.completed ? 
                          <Checkbox
                            toggle
                            label='OBS'
                            style={{ }} 
                            onClick={(e) => {
                              obsCheckboxReducer(quest.id)
                            }}
                          /> 
                        : 
                        <Button 
                          size="mini" 
                          color='orange'
                          disabled={ authorizedUser ? false : true}
                          onClick={() => {skipQuest(quest)}}
                        >
                          
                          <Image src={goldIcon} size="mini" className='inline' />
                            Skip Quest (300) 
                        </Button>
                        }
                      </div> 

                      : '' }
                      { checkDevEnv() ? 
                      <Checkbox 
                        style={{ marginTop: '1em' }} 
                        label={'Mark to be completed ' + quest.id} 
                        checked={checkedQuests[quest.id]}
                        onClick={(e) => {
                          checkboxReducer(quest.id)
                        }}
                      />
                      : '' }
                    </div>
                    
                  </Grid.Column>
                </Grid>
              </Card.Content>
            </Card>
            
          ))}
        </Card.Group>
      </div>
    </div>

  )
}

export default Quest;
