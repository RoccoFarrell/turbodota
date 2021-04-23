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

import item_generic from '../../../assets/item_generic.png'
import item_observer from '../../../assets/item_observer.png'
import item_sentry from '../../../assets/item_sentry.png'
import item_midas from '../../../assets/item_midas.png'

function Shop(props) {
  const {authorizedUser} = useContext(TurbodotaContext);

  let shop = props.shop
  let xp = props.xp
  let gold = props.gold
  let handlePurchaseItem = props.handlePurchaseItem

  // function shopItem(item) {
  //   return <div>{item}</div>
  // }

  function isItemPurchaseable(item) {
    if (gold >= item.cost && xp >= item.xpRequirement && item.quantity > 0 && item.active === true) return true
    else return false
  }

  function purchaseItem(item) {
    if (isItemPurchaseable(item)) handlePurchaseItem(item)
  }

  const shopImages = [
    { id: 0, src: item_generic },
    { id: 1, src: item_observer },
    { id: 2, src: item_sentry },
    { id: 3, src: item_midas }
  ]

  function generateImagePath(item) {
    let image_src = shopImages.filter(shopImage => shopImage.id === item.id)[0].src
    if(image_src === []) return item_generic
    else return image_src
  }

  return (
      <Container>
        <div className={'flexRow'}>
          <Card.Group>
            { shop.map((item, index) => (
              <Card key={item.id} >
                <Image size='small' src={generateImagePath(item)} style={{ padding: '1em' }} />
                <Card.Content extra>
                  <Card.Header><h3>{item.name}</h3></Card.Header>
                  <Card.Meta>
                    <p>Cost: {item.cost}</p>
                    <p>XP Requirement: {item.xpRequirement}</p>
                    <p>Quantity: {item.quantity}</p>
                  </Card.Meta>
                  <Card.Description>
                    {item.description}
                  </Card.Description>
                </Card.Content>
                <Card.Content>
                  <Modal
                    trigger={<Button color='green' disabled={!isItemPurchaseable(item) || !authorizedUser}> Buy 1 </Button>}
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