import React, { useState, useEffect, useContext } from 'react';
import TurbodotaContext from '../../TurbodotaContext'
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
import './Shop.css';



function Shop(props) {
  function shopItem(item) {
    return <div>{item}</div>
  }

  return (
    <div>
      { shopItem('test') }
      { shopItem('test') }
    </div>
  )
}

export default Shop;