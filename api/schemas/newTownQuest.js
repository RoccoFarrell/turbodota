const newTownQuest =  {
  id: 0,
  hero: {},
  active: true,
  completed: false,
  skipped: false,
  completedMatchID: null,
  startTime: new Date(),
  endTime: null,
  conditions: [],
  attempts: [],
  modifiers: [],
  bounty: {
    xp: 100,
    gold: 100
  }
}

module.exports = newTownQuest
