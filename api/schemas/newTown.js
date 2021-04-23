const newTown = {
  playerID: '',
  gold: 0,
  xp: 0,
  totalQuests: 0,
  level: {},
  townStats: {
    nonTownGames: 0
  },
  active: [],
  completed: [],
  skipped: [],
  inventory: [],
  shop: [],
  modifiers: [],
  lastModified: new Date(),
  dateCreated: new Date()
}

module.exports = newTown