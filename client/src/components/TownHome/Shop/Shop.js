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



function Shop(props) {

  let shop = props.shop
  let xp = props.xp
  let gold = props.gold
  let handlePurchaseItem = props.handlePurchaseItem

  // function shopItem(item) {
  //   return <div>{item}</div>
  // }

  function isItemPurchaseable(item) {
    if (gold >= item.cost && xp >= item.xpRequirement) return true
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
                <Card.Content extra>
                  <h3>{item.name}</h3>
                  <p>Cost: {item.cost}</p>
                  <p>XP Requirement: {item.xpRequirement}</p>
                  <p>Quantity: {item.quantity}</p>
                </Card.Content>
                <Card.Content>
                  <Modal
                    trigger={<Button color='green' disabled={!isItemPurchaseable(item)}> Buy 1 </Button>}
                    header='Confirmation'
                    content='Are you sure you want to purchase?'
                    actions={['No', { key: 'Yes', content: 'Yes', positive: true, onClick: purchaseItem(item)}]}
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