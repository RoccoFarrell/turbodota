let itemsList = [
  {
    id: 1,
    name: 'Observer Ward',
    cost: 50,
    perpetual: false,
    quantity: 10000,
    maxQuantity: 10000,
    shop: true,
    xpRequirement: 200,
    modifiers: [],
    active: true,
    numberUsed: 0,
    description: 'Use when turning in a quest, instead of a random quest you will get to pick your new quest between 3 random options.'
  },
  {
    id: 2,
    name: 'Sentry Ward',
    cost: 50,
    perpetual: false,
    quantity: 10000,
    maxQuantity: 10000,
    shop: true,
    xpRequirement: 200,
    modifiers: [],
    active: false,
    numberUsed: 0,
    description: 'Use before turning in a quest, shows the next quest you will receive.'
  },
  {
    id: 3,
    name: 'Hand of Midas',
    cost: 5000,
    perpetual: true,
    quantity: 1,
    maxQuantity: 1,
    shop: true,
    xpRequirement: 200,
    modifiers: [],
    active: false,
    numberUsed: 0,
    description: 'Hand of Midas will increase your quest bounties by 100 gold permanently.'
  }
]

module.exports = itemsList