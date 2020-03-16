import React, { useContext } from 'react'
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
} from 'semantic-ui-react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory
  } from "react-router-dom";
import Home from './Home'
import Changelog from './Changelog'
import TurbodotaContext from './TurbodotaContext'

import logo from '../assets/squareLogo.png';


function FixedMenuLayout() {
    
    const {selectedUser, setSelectedUser}= useContext(TurbodotaContext);
    
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

    return (
        <div>
            <Menu fixed='top' >
            <Container>
                <Menu.Item as='a' header>
                <Image size='mini' src={logo} style={{ marginRight: '1.5em' }} />
                    Turbodota
                </Menu.Item>
                <Menu.Item as='a' onClick={() => {pushRoute('')}}>
                Home    
                </Menu.Item>
                <Menu.Item as='a' onClick={() => {pushRoute('search')}}>
                Search
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
                    <Route path="/search">
                        <TestComponent />
                    </Route>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </Container>

            {/* END MAIN CONTENT AREA */}
            
            <Segment inverted vertical style={{ padding: '5em 0em' }}>

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