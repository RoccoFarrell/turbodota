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
    Progress,
    Menu,
    Sidebar,
    Segment,
    Dropdown
} from 'semantic-ui-react'
//import './Idle.css';

import goldIcon from '../../assets/gold.png';
import xpIcon from '../../assets/xp.png';
import turboTownIcon from '../../assets/turbotown.png';

function Idle() {
  const [devEnv, setDevEnv] = useState(false)
  const [visible, setVisible] = useState(false)
  const {selectedUser, setSelectedUser, userID, setUserID, authorizedUser} = useContext(TurbodotaContext);
  const [enableReset, setEnableReset] = useState(false)
  const [townData, setTownData] = useState({})
  const [checkedQuests, setCheckedQuests] = useState({})

  const userData = selectedUser
  // console.log(userData)
  let location = useLocation()
  let history = useHistory()

  // useEffect(() => {
  //   if (userID === undefined || userID === ''){
  //       let parsedUserID = location.pathname.split('/users/')[1].split('/')[0]
  //       console.log(parsedUserID)
  //       setUserID(parsedUserID)
  //   } else {
  //       console.log('userID: ', userID, 'userData: ', userData, 'selectedUser: ', selectedUser)
  //   }
  // }, [])

  // useEffect(() => {
  //   console.log('selectedUser: ', selectedUser)
  //   console.log('townData: ', townData)
  // }, [selectedUser])

  // //get town data function
  // async function getTownData(){
  //   try {
  //       axios.get(`/api/towns/${userID}`)
  //       .then(res => {
  //           let content = res.data;
  //           console.log('townData: ', content)
  //           // let returnDmg = calculateHeroDamage(matchOverview, content)
  //           setTownData(content)
  //       })
  //   } catch(e) {console.error(e)}
  // }

  // useEffect(() => {
  //   if(userID !== undefined && userID !== '') getTownData()
  // }, [userID])

  // useEffect(() => {
  //   console.log(checkedQuests)
  // }, [checkedQuests])

  // const profilePicture = () => {
  //   return userData.userStats ? <Image style={{ marginRight: '1em' }} src={userData.userStats.profile.avatarfull} rounded /> : <div></div>
  // }

  // const handleTownDataChange = (townData) => {
  //   setTownData(townData)
  // }

  // const checkDevEnv = () => {
  //   if(process.env.NODE_ENV === "development" && devEnv) return true
  //   else return false
  // }

  // const handleRouteChange = (route) => {
  //   console.log('changing route')
  //   if(route) history.push("/users/" + userID + '/' + route)
  //   else history.push("/users/" + userID)
  // }

  // //quest panes for active completed and skipped
  // const panes = [
  //   {
  //     menuItem: 'Active',
  //     render: () => (
  //       <Container className={'flexRowTownHome'} fluid>
  //         { !!townData.active ? 
  //             <Quests 
  //               townData={townData}
  //               questGroup='active'
  //               handleTownDataChange={handleTownDataChange}
  //               handleCheckedQuestsChange={handleCheckedQuestsChange}
  //               devEnv = {devEnv}
  //             />
  //         : '' }
  //       </Container>
  //       ),
  //   },
  //   {
  //     menuItem: 'Completed',
  //     render: () => (
  //       <Container className={'flexRowTownHome'} fluid>
  //         { !!townData.active ? 
  //             <Quests 
  //               townData={townData}
  //               questGroup='completed'
  //               handleTownDataChange={handleTownDataChange}
  //               devEnv = {devEnv}
  //             />
  //         : '' }
  //       </Container>
  //       ),
  //   },
  //   {
  //     menuItem: 'Skipped',
  //     render: () => (
  //       <Container className={'flexRowTownHome'} fluid>
  //         { !!townData.active ? 
  //             <Quests 
  //               townData={townData}
  //               questGroup='skipped'
  //               handleTownDataChange={handleTownDataChange}
  //             />
  //         : '' }
  //       </Container>
  //       ),
  //   },
  // ]

  // //get checkbox info from Quests component
  // const handleCheckedQuestsChange = (checkedQuests) => {
  //   //console.log(checkedQuests)
  //   setCheckedQuests({ ...checkedQuests })
  // }

  // //shop modal
  // function modalReducer(state, action) {
  //   switch (action.type) {
  //     case 'OPEN_MODAL':
  //       return { ...state, open: true, dimmer: action.dimmer }
  //     case 'CLOSE_MODAL':
  //       return { ...state, open: false }
  //     default:
  //       throw new Error()
  //   }
  // }
  
  // function ShopOpenCloseModal() {
  //   const [state, dispatch] = React.useReducer(modalReducer, {
  //     open: false,
  //     dimmer: undefined,
  //   })
  //   const { open, dimmer } = state
  
  //   return (
  //     <Modal
  //       open={open}
  //       dimmer={dimmer}
  //       onOpen={() => dispatch({ type: 'OPEN_MODAL', dimmer: 'blurring' })}
  //       onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
  //       trigger={
  //         <Menu.Item 
  //           as='a'
  //         >
  //           <Icon name='money bill alternate' color='red' />
  //           Shop
  //         </Menu.Item>
  //       }
  //     >
  //       <Modal.Header>Shop</Modal.Header>
  //       <Modal.Content>
  //         <Container className={'flexRowTownHome'} fluid>
  //           { !!townData ? 
  //               <Shop 
  //                 handlePurchaseItem = {handlePurchaseItem}
  //                 shop = {townData.shop}
  //                 xp = {townData.xp}
  //                 gold = {townData.gold}
  //               />
  //           : '' }
  //         </Container>
  //       </Modal.Content>
  //       <Modal.Actions>
  //         <Button onClick={() => dispatch({ type: 'CLOSE_MODAL' })} negative>
  //           Close Shop
  //         </Button>
  //       </Modal.Actions>
  //     </Modal>
  //   )
  // }

  // const handlePurchaseItem = (item) => {
  //   try {
  //     axios.post(`/api/towns/` + userID + `/purchaseItem/` + item.id)
  //     .then(res => {
  //         let content = res.data;
  //         console.log('purchaseItemResult: ', content)
  //         if(content.success === true) handleTownDataChange(content.newTown)
  //     })
  //   } catch(e) {console.error(e)}
  // }

  // //debug functions
  // //--------------------------------------------
  // async function addQuestToTown(){
  //   try {
  //       axios.get(`/api/debug/towns/` + userID + `/addQuest`)
  //       .then(res => {
  //           let content = res.data;
  //           console.log('addQuestResult: ', content)
  //       })
  //   } catch(e) {console.error(e)}
  // }

  // async function completeListOfQuests(){
  //   let completeArr = []
  //   for(const quest in checkedQuests){
  //     if(checkedQuests[quest] === true) completeArr.push(quest)
  //   }
  //   let postObj = {
  //     'complete': completeArr
  //   }

  //   console.log('about to complete: ', postObj)

  //   try {
  //       axios.post(`/api/debug/towns/` + userID + `/complete`, postObj)
  //       .then(res => {
  //           let content = res.data;
  //           console.log('content new town: ', content.newTown)
  //           if(content.newTown !== null) handleTownDataChange(content.newTown)
  //       })
  //       //.then(getTownData())
    
  //   } catch(e) {console.error(e)}
  // }

  
  return (

      <Grid columns={1}>
        <Grid.Column>
        <div>IDLE time</div>
        </Grid.Column>
      </Grid>

  )
}

export default Idle;
