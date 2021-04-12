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
    CardContent,
    Modal
} from 'semantic-ui-react'
import './Shop.css';

import obs from '../../../assets/observer.png';

function Shop(props) {

  let shop = props.shop
  let xp = props.xp
  let gold = props.gold
  let handlePurchaseItem = props.handlePurchaseItem

  // function shopItem(item) {
  //   return <div>{item}</div>
  // }

  function isItemPurchaseable(item) {
    if (gold >= item.cost && xp >= item.xpRequirement && item.quantity > 0 && item.id === 2) return true
    else return false
  }

  function purchaseItem(item) {
    if (isItemPurchaseable(item)) handlePurchaseItem(item)
  }

  return (
      <Container>
        <div className={'flexRow'}>
          <Card.Group>
            { shop.map((item, index) => (
              <Card key={item.id} >
                <Image size='small' src={obs} style={{ padding: '1em' }} />
                <Card.Content extra>
                  <Card.Header><h3>{item.name}</h3></Card.Header>
                  <Card.Meta>
                    <p>Cost: {item.cost}</p>
                    <p>XP Requirement: {item.xpRequirement}</p>
                    <p>Quantity: {item.quantity}</p>
                  </Card.Meta>
                  <Card.Description>
                    Izza ward
                  </Card.Description>
                </Card.Content>
                <Card.Content>
                  <Modal
                    trigger={<Button color='green' disabled={!isItemPurchaseable(item)}> Buy 1 </Button>}
                    header='Confirmation'
                    content='Are you sure you want to purchase?'
                    actions={['No', { key: 'Yes', content: 'Yes', positive: true, onClick: () => purchaseItem(item)}]}
                  />
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </div>



      </Container>
  )
}

export default Shop;