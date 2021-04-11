import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useHistory } from "react-router-dom";
import TurbodotaContext from '../TurbodotaContext'
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
    Progress
} from 'semantic-ui-react'
import './TownHome.css';

import Quests from './Quests/Quests'
import Shop from './Shop/Shop'

import goldIcon from '../../assets/gold.png';
import xpIcon from '../../assets/xp.png';
import turboTownIcon from '../../assets/turbotown.png';

function TownHome() {
  const {selectedUser, setSelectedUser, userID, setUserID} = useContext(TurbodotaContext);
  const [enableReset, setEnableReset] = useState(false)
  const [townData, setTownData] = useState({})
  const [checkedQuests, setCheckedQuests] = useState({})

  const userData = selectedUser
  // console.log(userData)
  let location = useLocation()
  let history = useHistory()

  useEffect(() => {
    if (userID === undefined || userID === ''){
        let parsedUserID = location.pathname.split('/users/')[1].split('/')[0]
        console.log(parsedUserID)
        setUserID(parsedUserID)
    } else {
        console.log('userID: ', userID, 'userData: ', userData, 'selectedUser: ', selectedUser)
    }
  }, [])

  useEffect(() => {
    console.log('selectedUser: ', selectedUser)
    console.log('townData: ', townData)
  }, [selectedUser])

  //get town data function
  async function getTownData(){
    try {
        axios.get(`/api/towns/${userID}`)
        .then(res => {
            let content = res.data;
            console.log('townData: ', content)
            // let returnDmg = calculateHeroDamage(matchOverview, content)
            setTownData(content)
        })
    } catch(e) {console.error(e)}
  }

  useEffect(() => {
    if(userID !== undefined && userID !== '') getTownData()
  }, [userID])

  useEffect(() => {
    console.log(checkedQuests)
  }, [checkedQuests])

  const profilePicture = () => {
    return userData.userStats ? <Image style={{ marginRight: '1em' }} src={userData.userStats.profile.avatarfull} rounded /> : <div></div>
  }

  const handleTownDataChange = (townData) => {
    setTownData(townData)
  }

  const handleRouteChange = (route) => {
    console.log('changing route')
    if(route) history.push("/users/" + userID + '/' + route)
    else history.push("/users/" + userID)
  }

  //debug functions
  //--------------------------------------------
  async function addQuestToTown(){
      try {
          axios.get(`/api/debug/towns/` + userID + `/addQuest`)
          .then(res => {
              let content = res.data;
              console.log('addQuestResult: ', content)
          })
      } catch(e) {console.error(e)}
  }

  //get checkbox info from Quests component
  const handleCheckedQuestsChange = (checkedQuests) => {
    //console.log(checkedQuests)
    setCheckedQuests({ ...checkedQuests })
  }

  async function completeListOfQuests(){
    let completeArr = []
    for(const quest in checkedQuests){
      if(checkedQuests[quest] === true) completeArr.push(quest)
    }
    let postObj = {
      'complete': completeArr
    }

    console.log('about to complete: ', postObj)

    try {
        axios.post(`/api/debug/towns/` + userID + `/complete`, postObj)
        .then(res => {
            let content = res.data;
            console.log('content new town: ', content.newTown)
            if(content.newTown !== null) handleTownDataChange(content.newTown)
        })
        //.then(getTownData())
    
    } catch(e) {console.error(e)}
  }

  const panes = [
    {
      menuItem: 'Active',
      render: () => (
        <Container className={'flexRowTownHome'} fluid>
          { !!townData.active ? 
              <Quests 
                townData={townData}
                questGroup='active'
                handleTownDataChange={handleTownDataChange}
                handleCheckedQuestsChange={handleCheckedQuestsChange}
              />
          : '' }
        </Container>
        ),
    },
    {
      menuItem: 'Completed',
      render: () => (
        <Container className={'flexRowTownHome'} fluid>
          { !!townData.active ? 
              <Quests 
                townData={townData}
                questGroup='completed'
                handleTownDataChange={handleTownDataChange}
              />
          : '' }
        </Container>
        ),
    },
    {
      menuItem: 'Skipped',
      render: () => (
        <Container className={'flexRowTownHome'} fluid>
          { !!townData.active ? 
              <Quests 
                townData={townData}
                questGroup='skipped'
                handleTownDataChange={handleTownDataChange}
              />
          : '' }
        </Container>
        ),
    },
  ]

  function modalReducer(state, action) {
    switch (action.type) {
      case 'OPEN_MODAL':
        return { ...state, open: true, dimmer: action.dimmer }
      case 'CLOSE_MODAL':
        return { ...state, open: false }
      default:
        throw new Error()
    }
  }
  
  function ShopOpenCloseModal() {
    const [state, dispatch] = React.useReducer(modalReducer, {
      open: false,
      dimmer: undefined,
    })
    const { open, dimmer } = state
  
    return (
      <Modal
        open={open}
        dimmer={dimmer}
        onOpen={() => dispatch({ type: 'OPEN_MODAL', dimmer: 'blurring' })}
        onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
        trigger={
          <Button animated='fade' size="medium" color='yellow'>
            <Button.Content visible>Open Town Shop</Button.Content>
            <Button.Content hidden>oho you found me</Button.Content>
          </Button>
        }
      >
        <Modal.Header>Shop</Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to shop</p>
          <Shop/>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => dispatch({ type: 'CLOSE_MODAL' })} negative>
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
  
  return (
      <Container id="container">
          <Container id="topUserInfo">
            { process.env.NODE_ENV === "development" ? 
              <Container>
                <Button color='red' onClick={ () => {addQuestToTown()} }> Add Random Quest </Button>
                <Button color='red' onClick={ () => {completeListOfQuests()} }> Complete Checked Quests </Button>
                <Button> Click me </Button>
                <Button> Click me </Button>
              </Container>            
            : '' }
            <Container id="turboTownContainer">
              <h3 style={{ marginRight: '.5em' }}>ONLY THE BEST CAN BECOME <strong style={{ fontStyle: 'bold' }}>MAYOR OF </strong></h3>
              <Image size='small' src={turboTownIcon}/>
            </Container>

            <Card fluid color='blue' id="topUserRow">
              <div id="nameRow">
                {profilePicture()}
                <div style={{ alignSelf: "center", paddingLeft: "1em" }}>
                  { !!selectedUser.userStats && !!townData.level? (
                    <div>
                      <h2><strong style={{ fontStyle: 'bold', color: '#2185d0'}}> { selectedUser.userStats.profile.personaname }</strong> </h2>
                      <h3>Level {townData.level.value}</h3>
                      <a href={"https://www.dotabuff.com/players/" + selectedUser.userStats.profile.account_id }>Dotabuff</a>
                    </div>
                  ) : ''}
                  
                </div>
              </div>
              <div style={{ flex: 1 }}>
              </div>
              { !!townData.active ?
              <div className="flexRowTownHome" style={{ flex: "0 1 30%"}}>
                  <div>
                    <Statistic.Group size="mini" widths='one'>
                      <Statistic horizontal>
                        <Statistic.Value>
                          { townData.townStats.totalTownGames }
                        </Statistic.Value>
                        <Statistic.Label className="tinyText">Town Games</Statistic.Label>
                      </Statistic>
                      <Statistic horizontal>
                        <Statistic.Value>
                          { townData.townStats.nonTownGames }
                        </Statistic.Value>
                        <Statistic.Label className="tinyText">Non-quest Games</Statistic.Label>
                      </Statistic>
                      <Statistic horizontal>
                        <Statistic.Value>
                          { townData.townStats.totalAttemptGames }
                        </Statistic.Value>
                        <Statistic.Label className="tinyText">Quest Attempts</Statistic.Label>
                      </Statistic>
                    </Statistic.Group>
                  </div>
                <div>
                  <Statistic.Group widths='one' size="tiny">
                    <Statistic size="mini">
                      <Statistic.Value>
                        <Image src={goldIcon} width="20px" className='circular inline' />
                        { townData.gold }
                      </Statistic.Value>
                      <Statistic.Label>Gold</Statistic.Label>
                    </Statistic>
                    <Statistic size="mini">
                      <Statistic.Value>
                        <Image src={xpIcon} width="20px" className='circular inline' />
                        { townData.xp }
                      </Statistic.Value>
                      <Statistic.Label>XP</Statistic.Label>
                    </Statistic>
                  </Statistic.Group>
                </div>

              </div>
              : '' }
              <div>
                <Button color='blue' style={{ marginTop: '1em' }} onClick={ () => {handleRouteChange()} }> User Stats </Button>
              </div>
            </Card>

          </Container>
          
          { enableReset ? (
            <div>
              <h3>OH HO YOU FOUND ME</h3>
              <Button>Reset Town</Button>
            </div>
          ) : ''}
          { !!townData.level ?
          <Container id="progressContainer">
            <Progress percent={ (( (townData.xp-townData.level.xpThisLevel) / (townData.level.xpNextLevel-townData.level.xpThisLevel))*100).toFixed(0) } progress color='blue' active>
              XP to Next Level: { townData.level.xpNextLevel - townData.xp }
            </Progress>
          </Container>
          : '' }
          <Container className='flexRowTownHome' style={{ marginTop: '2em' }}>
            {ShopOpenCloseModal()}
          </Container>
          <Container id="questContainer">
            <h2>Quests</h2>
            <Tab menu={{ secondary: true }} panes={panes} />
          </Container>
          
          {/* <Container className={'flexRowTownHome'} fluid>
            { !!townData.active ? 
                <Quests 
                  townData={townData}
                  questGroup='active'
                  handleTownDataChange={handleTownDataChange}
                />
            : '' }
          </Container> */}
      </Container>
  )
}

export default TownHome;
