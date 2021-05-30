import React, { useState, useEffect, useContext, useLocation } from 'react';
import { Container, Image, Input, Header, Divider, Segment } from 'semantic-ui-react'
import './UserNotFound.css';

import knight from '../../assets/knight.png';

function UserNotFound(props) {

  const missingUserID = props.userID

  return (
    <Container style={{ margin: '10em' }}className={'flexCenter'}>
      <Segment textAlign='center' piled raised>
        <Header as='h1' textAlign='center' color='red'>Stop!</Header>
        <Header textAlign='center'>
            We have no information about this user.
        </Header>
        <Image style={{ width: '200px'}} src={knight} centered/>
        <Header textAlign='center'>
            Perhaps you got your ID wrong?
        </Header>
        
        <Header textAlign='center' color='red'>
            {missingUserID}
        </Header>
        Try <a href={"https://www.opendota.com/players/" + missingUserID}>finding this user on OpenDota</a>
      </Segment>
    </Container>
  );
}

export default UserNotFound;
