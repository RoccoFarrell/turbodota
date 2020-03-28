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
    Button
} from 'semantic-ui-react'
import './Quests.css';

import questIcon from '../../../assets/questIcon.png';

function Quest(props) {
  const townData = props.townData
  let activeQuests = townData.active

  const processDate = (date) => {
    console.log(date)
    let tempDate = new Date(date._seconds * 1000)
    return tempDate.toLocaleDateString()
  }

  const heroIcon = (hero_id, zoom) => {
    let heroString = 'd2mh hero-' + hero_id
    return <i style={{ zoom: zoom, padding: '0px' }} className={heroString}/>
  }

  return (
    <div className={'flexRow'}>
      <Card.Group>
        { activeQuests.map(quest => (
          <Card key={quest.id} className={'questCard'}>
            <div style={{ width: '200px', height: '175px', alignSelf: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              { heroIcon(quest.hero.id, 2) }
            </div>
            <Card.Content>
              <Card.Header>{ quest.hero.localized_name }</Card.Header>
              <Card.Meta>
                <span>{ processDate(quest.startTime) }</span>
              </Card.Meta>
              <Card.Description>
              { quest.hero.roles.map(role => (<strong key={role} style={{ margin: '.25em'}}>{ role }</strong>)) }
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
            <Image 
              src={questIcon}
              as='i' 
              width='50px'
              alt='choose yer quest'
            /> Quest!
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </div>
  )
}

export default Quest;
