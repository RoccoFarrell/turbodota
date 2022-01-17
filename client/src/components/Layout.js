import React, { useContext, useEffect, useState } from 'react'
import {
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment,
  Button,
  Portal,
  Form,
  Checkbox,
  Icon,
  Modal,
  Dimmer,
  Loader
} from 'semantic-ui-react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory
  } from "react-router-dom";
import Search from './Search'
import Changelog from './Changelog'
import UserData from './UserData'
import TownHome from './TownHome/TownHome'
import Leaderboard from './Leaderboard/Leaderboard'
import HeroStats from './HeroStats/HeroStats'
import TurbodotaContext from './TurbodotaContext'
import LinkAccounts from './LinkAccounts/LinkAccounts'
import Idle from './TownHome/Idle/Idle'

import logo from '../assets/squareLogo.png';
import steam_logo from '../assets/steam_logo.png'
import town_logo from '../assets/turbotown.png'

import './Layout.css';

function FixedMenuLayout() {
    
    const {selectedUser, setSelectedUser, loading} = useContext(TurbodotaContext);
    const {steamUser, setSteamUser}= useContext(TurbodotaContext);

    const [likeCounter, setLikeCounter] = useState(0)
    const [open, setOpen] = useState(false)
    const [contactModalOpen, setContactModalOpen] = React.useState(false)
    
    let history = useHistory()

    useEffect(() => {
        //console.log('steamUser: ', steamUser, !!steamUser)
        // console.log('townData: ', townData)
      }, [steamUser])

    const pushRoute = (route) => {
        if(route === ''){
            setSelectedUser({})
        }
        history.push("/" + route )
    }

    const handleClose = () => {
        console.log('closing')
        setOpen(false)
    }
    const handleOpen = () => setOpen(true)

    return (
        <div style={{ display: 'flex', flexDirection: 'column'}}>
            <Menu fixed='top' fluid>
            <Container>
                <Menu.Item header as='a' onClick={() => {pushRoute('')}}>
                <Image size='mini' src={logo} style={{ marginRight: '1.5em' }} />
                    Turbodota
                </Menu.Item>
                <Menu.Item as='a' onClick={() => {pushRoute('')}}>
                Home    
                </Menu.Item>
                <Menu.Item as='a' onClick={() => {pushRoute('herostats')}}>
                Heroes    
                </Menu.Item>
                {/* <Menu.Item as='a' onClick={() => {pushRoute('search')}}>
                Search
                </Menu.Item> */}

                {/* Right Element 1 */}
                { !!steamUser.id ? (        
                    <Menu.Item as='a' fitted="vertically" onClick={() => pushRoute('users/' + steamUser.dotaID + '/town/home')}>
                        <Image style={{ height: '50px' }} src={town_logo} />
                    </Menu.Item>
                )
                : '' }

                {/* Right Element 2 */}
                { !!steamUser.id ? (        
                    <Menu.Item as='a' position='right' fitted="vertically" onClick={() => pushRoute('users/' + steamUser.dotaID + '/town/home')}>
                            <Image size='mini' src={steamUser._json.avatar} style={{ marginRight: '1.5em' }} />
                            <div>{steamUser.displayName.toString() }</div>  
                    </Menu.Item>
                )
                : (
                    <Menu.Item as='a' position="right" onClick={() => window.location = "/auth/steam"}>
                        <div className='flexRow steamInfo'>
                        <Image size='mini' src={steam_logo} style={{ marginRight: '1.5em' }} />
                        <div>Login</div>  
                        </div>
                    </Menu.Item>
                    )
                }
                { !!steamUser ? (
                    <Dropdown item text='Settings'>
                        <Dropdown.Menu>
                            <Dropdown.Item>
                                <Icon name='linkify' size='small' />
                                <Link to={'/users/'+ steamUser.id +'/linkAccounts'}>
                                    Link Dota ID to Steam ID
                                </Link>
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Header>Explore</Dropdown.Header>
                            <Dropdown.Item as='a' onClick={() => {pushRoute('leaderboard')}}>
                                Leaderboard
                            </Dropdown.Item>
                            <Dropdown.Item as='a' onClick={() => {pushRoute('changelog')}}>
                                Changelog
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                ) : ''}

                { !!steamUser.id ? ( 
                <Menu.Item  as='a' onClick={() => window.location = "/auth/logout"}>
                    Logout
                </Menu.Item>
                ) : '' }
            </Container>
            </Menu>

            {/* MAIN CONTENT AREA */}

            {/* Experimental Dimmer, need to implement new API structure first */}
            <Dimmer active={loading} inverted>
                <Loader/>
            </Dimmer>
            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
                
            <Container fluid style={{ paddingTop: '4.25em', flex: 1}}>
                <Switch>
                    <Route path="/changelog" component={Changelog} />
                    <Route exact path="/users/:id" component={UserData} />
                    <Route path="/users/:id/town" component={TownHome} />
                    <Route path="/leaderboard" component={Leaderboard} />
                    <Route path="/herostats" component={HeroStats} />
                    <Route path="/users/:id/linkAccounts" component={LinkAccounts} />
                    <Route path="/" component={Search} />
                    <Redirect to="/" />
                </Switch>
            </Container>

            {/* END MAIN CONTENT AREA */}
            
            <Segment inverted vertical>
                <Portal
                    onClose={handleClose} open={open}>
                    <Segment
                    style={{
                        left: '60%',
                        position: 'fixed',
                        top: '50%',
                        zIndex: 1000,
                        padding: '2em',
                        width: '400px'
                    }}
                    >
                    <Header><i aria-hidden="true" className="cogs icon"/> Make a Feature Request!</Header>
                    <Form>
                        <Form.Field>
                        <label>Idea Title</label>
                        <input placeholder='Automatically ban heroes for me' />
                        </Form.Field>
                        <Form.Field>
                        <label>Description</label>
                        <input placeholder='Description' />
                        </Form.Field>
                        <Form.Field>
                        <Checkbox label='Rocco and Martin can claim ownership of this idea' />
                        </Form.Field>
                        <Button positive type='submit'>Submit</Button>
                        <Button
                            negative
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                    </Form>
                    </Segment>
                </Portal>
                <Button.Group
                    style={{ position: 'fixed', top: '95vh', right: '15px'}}
                >
                    <Button
                        onClick = {() => {
                            let temp = likeCounter
                            setLikeCounter(temp += 1)
                        }}
                    >
                        <i aria-hidden="true" className="heart icon"></i>
                        { likeCounter > 0 ? likeCounter + (likeCounter === 1 ? ' Like' : ' Likes') : '0'}
                    </Button>
                    <Button.Or />
                    <Button 
                        color='red'
                        onClick={ open ? handleClose : handleOpen }
                    >
                        <i aria-hidden="true" className="cogs icon"/>
                        Feature Request
                    </Button>
                </Button.Group>

                <Container textAlign='center'>
                    {/* <Grid divided inverted stackable>
                        <Grid.Column width={3}>
                            <Header inverted as='h4' content='Group 1' />
                            <List link inverted>
                            <List.Item as='a'>Link One</List.Item>
                            <List.Item as='a'>Link Two</List.Item>
                            <List.Item as='a'>Link Three</List.Item>
                            <List.Item as='a'>Link Four</List.Item>
                            </List>
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <Header inverted as='h4' content='Group 2' />
                            <List link inverted>
                            <List.Item as='a'>Link One</List.Item>
                            <List.Item as='a'>Link Two</List.Item>
                            <List.Item as='a'>Link Three</List.Item>
                            <List.Item as='a'>Link Four</List.Item>
                            </List>
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <Header inverted as='h4' content='Group 3' />
                            <List link inverted>
                            <List.Item as='a'>Link One</List.Item>
                            <List.Item as='a'>Link Two</List.Item>
                            <List.Item as='a'>Link Three</List.Item>
                            <List.Item as='a'>Link Four</List.Item>
                            </List>
                        </Grid.Column>
                        <Grid.Column width={7}>
                        <Header inverted as='h4' content='Special thanks to:' />
                        <p>
                        <br/>
                        Dotabuff
                        <br/>
                        OpenDota
                        <br/>
                        FlatIcon
                        <br/>
                        Our fantastic product team
                        </p>
                    </Grid.Column>
                    </Grid> */}

                    {/* ---------------------
                    Footer
                    --------------------- */}
                    <Divider inverted section />
                    <Image centered size='mini' src={logo} />
                        <List horizontal inverted divided link size='small'>
                        <List.Item as='a' onClick={() => setContactModalOpen(true)}>
                            Contact Us
                        </List.Item>
                        <List.Item as='a' onClick={() => setContactModalOpen(true)}>
                            Terms and Conditions
                        </List.Item>
                        <List.Item as='a' onClick={() => setContactModalOpen(true)}>
                            Privacy Policy
                        </List.Item>
                    </List>
                    {/* ---------------------
                    End Footer
                    --------------------- */}
                    <Modal
                    onClose={() => setContactModalOpen(false)}
                    onOpen={() => setContactModalOpen(true)}
                    open={contactModalOpen}
                    //trigger={<Button>Show Modal</Button>}
                    >
                        <Modal.Header>Contact Us</Modal.Header>
                        <Modal.Content image>
                            {/* <Image size='medium' src='https://react.semantic-ui.com/images/avatar/large/rachel.png' wrapped /> */}
                            <Image size='small' src={logo} wrapped />
                            <Modal.Description style={{ paddingTop: '2em' }} wrapped>
                            <Header>No Salt Studios ©2021</Header>
                            <p>
                                Contact us at <h3>nosaltstudios@gmail.com</h3>
                            </p>
                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color='black' onClick={() => setContactModalOpen(false)}>
                            Nope
                            </Button>
                            <Button
                            content="Yes"
                            labelPosition='right'
                            icon='checkmark'
                            onClick={() => setContactModalOpen(false)}
                            positive
                            />
                        </Modal.Actions>
                    </Modal>
                </Container>
            </Segment>
        </div>
    )
}

export default FixedMenuLayout