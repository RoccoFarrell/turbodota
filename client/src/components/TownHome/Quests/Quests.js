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
    Grid,
    Modal,
    Segment
} from 'semantic-ui-react'
import './Quests.css';

import questIcon from '../../../assets/questIcon.png';
import goldIcon from '../../../assets/gold.png';

function Quest(props) {
  const {selectedUser, setSelectedUser, userID, setUserID, authorizedUser} = useContext(TurbodotaContext);
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(selectedUser)
  const [checkedQuests, setCheckedQuests] = useState({})
  const [obsQuests, setObsQuests] = useState({})

  let townData = props.townData
  let handleTownDataChange = props.handleTownDataChange
  let handleCheckedQuestsChange = props.handleCheckedQuestsChange
  let questGroup = props.questGroup
  let devEnv = props.devEnv

  const checkDevEnv = () => {
    if(process.env.NODE_ENV === "development" && devEnv) return true
    else return false
  }

  const processDate = (date) => {
    let tempDate = new Date(date._seconds * 1000)
    return tempDate.toLocaleDateString()
  }

  const heroIcon = (hero_id, inputZoom) => {
    let heroString = 'd2mh hero-' + hero_id
    return <i style={{ zoom: inputZoom, padding: '0px' }} className={heroString}/>
  }

  const handleCheckProgress = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }

  const completeQuest = async (quest) => {
    console.log('complete quest: ', quest)
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

  const applyObsToQuest = async (quest) => {
    console.log(quest)
    let mod_observer = quest.modifiers.filter(modItem => modItem.name='Observer Ward Hero Choice')
    if(mod_observer.length === 0){
      let postObj = {
        quest: quest,
        action: 'applyObs'
      }

      try {
          await axios.post(`/api/towns/${townData.playerID}`, postObj)
          .then(res => {
              let content = res.data;
              if(content.status == 'failed') {
                console.error(content)
                window.alert(content.message + ', sorry bub')
              }
              else handleTownDataChange(content)
          })
      } catch(e) {console.error(e)}

    } else {
      console.log('modifier already on there')
    }
  }

  const chooseObsHero = async (quest) => {
    console.log('submitting obs hero ' + selectedArr.indexOf(true))
    console.log(quest)
    console.log('townData change')
    handleTownDataChange(townData)
  }

  const inventoryContainsItem = (matchItem) => {
    let result = false
    townData.inventory.forEach(invItem => {
      if(matchItem === invItem.name && invItem.quantity > 0){
        //console.log('match item')
        result = true
      }
    })
    return result
  }

  const questContainsObs = (quest) => {
    let flag = false
    quest.modifiers.forEach(mod => {
      console.log('mod: ', mod)
      if(mod.name === 'Observer Ward Hero Choice') flag = true
    })
    return flag
  }
  
  const [selectedArr, setSelectedArr] = useState([false, false, false])
  const heroSelectionModal = (quest) => {
    
    //console.log('test')
    const setSelectedHero = (index) => {
      let copy = [false, false, false]
      copy[index] = true
      setSelectedArr(copy)

      quest.modifiers[0].selectedHero = quest.modifiers[0].heroesList[index].id
    }

    return (
      <div>
        { !!quest.modifiers && !!quest.modifiers[0] && !!quest.modifiers[0].heroesList ?
          <Grid columns={3} padded>
            { quest.modifiers[0].heroesList.map((hero, index) => (
              <Grid.Column key={index}>
                <Segment 
                  textAlign='center' 
                  //raised={selectedArr[index]}
                  piled
                  color={ !!selectedArr && selectedArr[index] === true ? 'yellow' : 'grey'}
                  //color='yellow'
                >
                  <div>{ heroIcon(hero.id, 1.25) }</div>
                  <div>{ hero.localized_name }</div>
                  {/* <div>{ selectedArr[index].toString() }</div> */}
                </Segment>
                <Button 
                  content='Choose'
                  fluid
                  onClick={ e => setSelectedHero(index)}
                />
              </Grid.Column>
            ))}
          </Grid> 
        : ''}
      </div>
    )
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
                    <div className={'questCardFlexRow'} style={{ justifyContent: 'flex-start'}}>
                      <div className={'questCardFlexColumn'}>
                        { heroIcon(quest.hero.id, 1.5) }
                      </div>
                      <div className={'questCardFlexColumn'} style={{ marginLeft: '5em'}}>
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

                      <Grid columns={2}>
                        <Grid.Column>
                          { (!!user.calculations && !!user.calculations.allHeroRecord[quest.hero.id]) ? (
                            <div className={'questCardFlexColumn'} style={{ alignItems: 'center', justifyContent: 'center'}}>
                              <div>Win Rate: { ((user.calculations.allHeroRecord[quest.hero.id].wins / user.calculations.allHeroRecord[quest.hero.id].games) * 100).toFixed(0) + '%' }</div>
                              <div>Record: { user.calculations.allHeroRecord[quest.hero.id].wins + ' - ' + user.calculations.allHeroRecord[quest.hero.id].losses }</div>
                            </div>
                            ) : (<div>Never Played</div>)}                            
                        </Grid.Column>
                        <Grid.Column textAlign='center'>
                          <Statistic 
                            style={{ marginLeft: 'auto', marginRight: 'auto'}}
                            color={calculateAttemptsColor(quest.attempts.length)}
                          >
                            <Statistic.Value>{quest.attempts.length}</Statistic.Value>
                            <Statistic.Label>{ quest.attempts.length == 1 ? ' Attempt' : ' Attempts'}</Statistic.Label>
                          </Statistic>
                        </Grid.Column>
                      </Grid>

                    : 
                      <div>
                        { quest.attempts.length == 1 ? quest.attempts.length + ' Attempt' : quest.attempts.length + ' Attempts'}
                      </div>
                    }
                  </Grid.Column>
                  <Grid.Column>
                    {/* Action Buttons */}
                    
                      { questGroup == 'active' ?
                      <Grid columns={3}>
                        <Grid.Column textAlign='center'>
                          <Button 
                              disabled = { quest.completed === false || !authorizedUser } 
                              onClick={() => {completeQuest(quest)}}
                              circular
                              size='massive'
                              icon='settings'
                              color='green' 
                              icon='check circle outline'
                              className='actionButton'
                            />
                          { quest.completed ? 'Turn In' : 'Not Done'}
                        </Grid.Column>
                        <Grid.Column>
                          { !!quest.modifiers ? 
                          <Modal
                            dimmer='blurring'
                            header='Choose your next hero'
                            content={heroSelectionModal(quest)}
                            actions={['No', { key: 'Yes', content: 'Yes', positive: true, onClick: () => chooseObsHero(quest)}]}
                            trigger={
                              <Button
                                circular 
                                size='massive' 
                                color='yellow' 
                                icon='eye' 
                                className='actionButton'
                                disabled = { (quest.completed === false || !authorizedUser || (!inventoryContainsItem('Observer Ward') && !questContainsObs(quest)))}
                                onClick={() => {applyObsToQuest(quest)}} 
                              />
                            }
                          />
                          : ''}

                          { quest.completed ? 'Apply Obs' : 'Not Done'}
                          { !!quest.modifiers[0] && quest.modifiers[0]['name'] === "Observer Ward Hero Choice" && quest.modifiers[0]['selectedHero'] !== -1 ? 
                            <Label color='yellow' floating>
                              { heroIcon(quest.modifiers[0].selectedHero, .75) }
                            </Label>
                          : 
                            ''
                          }
                          
                        </Grid.Column>
                        <Grid.Column>
                          <Modal
                            trigger={                          
                            <Button 
                              size='massive' 
                              circular 
                              color='red' 
                              icon='shuffle' 
                              className='actionButton'
                              disabled = { quest.completed === true || !authorizedUser }
                            />}
                            header='Confirmation'
                            content='Are you sure you want to skip?'
                            actions={['No', { key: 'Yes', content: 'Yes', positive: true, onClick: () => skipQuest(quest)}]}
                          />
                          Skip
                        </Grid.Column>


                          { /* TODO: add requirement that user has an obs in inventory to display checkbox below*/}
                          {/* { quest.completed ? 
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
                          } */}
                      </Grid>
                        // <Button.Group vertical labeled icon>
                        //   <Button color='green' icon='check circle outline' content='Turn In' />
                        //   <Button color='yellow' icon='eye' content='Apply Obs' />
                        //   <Button color='red' icon='shuffle' content='Skip' />
                        // </Button.Group>
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
