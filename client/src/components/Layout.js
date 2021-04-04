import React, { useContext, useState } from 'react'
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
  Icon
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
import TurbodotaContext from './TurbodotaContext'

import logo from '../assets/squareLogo.png';
import steam_logo from '../assets/steam_logo.png'

import './Layout.css';

function FixedMenuLayout() {
    
    const {selectedUser, setSelectedUser}= useContext(TurbodotaContext);
    const {steamUser, setSteamUser}= useContext(TurbodotaContext);

    console.log(steamUser)

    const [likeCounter, setLikeCounter] = useState(0)
    const [open, setOpen] = useState(false)
    
    let history = useHistory()

    const pushRoute = (route) => {
        if(route === ''){
            setSelectedUser({})
        }
        history.push("/" + route )
    }

    let TestComponent = () => {
        return (
            <Container fluid style={{ padding: '10em', margin: '10em'}}>
                testing
            </Container>
        )
    }

    const handleClose = () => {
        console.log('closing')
        setOpen(false)
    }
    const handleOpen = () => setOpen(true)

    return (
        <div>
            <Menu fixed='top' fluid>
            <Container>
                <Menu.Item header as='a' onClick={() => {pushRoute('')}}>
                <Image size='mini' src={logo} style={{ marginRight: '1.5em' }} />
                    Turbodota
                </Menu.Item>
                <Menu.Item as='a' onClick={() => {pushRoute('')}}>
                Home    
                </Menu.Item>
                {/* <Menu.Item as='a' onClick={() => {pushRoute('search')}}>
                Search
                </Menu.Item> */}
                <Menu.Item as='a' onClick={() => {pushRoute('leaderboard')}}>
                    Leaderboard
                </Menu.Item>
                <Menu.Item as='a' onClick={() => {pushRoute('changelog')}}>
                    Changelog
                </Menu.Item>

                <Dropdown item simple text='Dropdown'>
                <Dropdown.Menu>
                    <Dropdown.Item>
                        <Link to="/fixedMenu/test">
                            Test
                        </Link>
                    </Dropdown.Item>
                    <Dropdown.Item>List Item</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Header>Header Item</Dropdown.Header>
                    <Dropdown.Item>
                    <i className='dropdown icon' />
                    <span className='text'>Submenu</span>
                    <Dropdown.Menu>
                        <Dropdown.Item>List Item</Dropdown.Item>
                        <Dropdown.Item>List Item</Dropdown.Item>
                    </Dropdown.Menu>
                    </Dropdown.Item>
                    <Dropdown.Item>List Item</Dropdown.Item>
                </Dropdown.Menu>
                </Dropdown>
                
                { !!steamUser.id ? (              
                    <Menu.Item position='right' fitted="vertically">
                            <Image size='mini' src={steamUser._json.avatar} style={{ marginRight: '1.5em' }} />
                            <div>{steamUser.displayName.toString() }</div>  
                    </Menu.Item>
                )
                : (
                    <Menu.Item as='a' position="right" onClick={() => window.location = "auth/steam"}>
                        <div className='flexRow steamInfo'>
                        <Image size='mini' src={steam_logo} style={{ marginRight: '1.5em' }} />
                        <div>Login</div>  
                        </div>
                    </Menu.Item>
                    )
                }
                { !!steamUser.id ? ( 
                <Menu.Item  as='a' onClick={() => window.location = "auth/logout"}>
                    Logout
                </Menu.Item>
                ) : '' }
            </Container>
            </Menu>

            {/* MAIN CONTENT AREA */}

            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
            <Container fluid style={{ paddingTop: '4.25em'}}>
                <Switch>
                    <Route path="/changelog">
                        <Changelog />
                    </Route>
                    <Route exact path="/users/:id" component={UserData} />
                    <Route path="/users/:id/town" component={TownHome} />
                    <Route path="/leaderboard" component={Leaderboard} />
                    <Route path="/">
                        <Search />
                    </Route>
                    <Redirect to="/" />
                </Switch>
            </Container>

            {/* END MAIN CONTENT AREA */}
            
            <Segment inverted vertical style={{ padding: '5em 0em' }}>
            
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
                <Grid divided inverted stackable>
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
                    <Header inverted as='h4' content='Footer Header' />
                    <p>
                    Extra space for a call to action inside the footer that could help re-engage users.
                    </p>
                </Grid.Column>
                </Grid>

                <Divider inverted section />
                <Image centered size='mini' src={logo} />
                <List horizontal inverted divided link size='small'>
                <List.Item as='a' href='#'>
                    Site Map
                </List.Item>
                <List.Item as='a' href='#'>
                    Contact Us
                </List.Item>
                <List.Item as='a' href='#'>
                    Terms and Conditions
                </List.Item>
                <List.Item as='a' href='#'>
                    Privacy Policy
                </List.Item>
                </List>
            </Container>
            </Segment>
        </div>
    )
}

export default FixedMenuLayout