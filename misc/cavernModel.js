town = {
  playerID: playerID,
  active: [
    townQuest
  ],
  completed: [
    townQuest,
    townQuest
  ]
}
town = {
  playerID: playerID,
  active: [],
  completed: []
}

townQuest = {
  playerID: player_id,
  heroID: heroID,
  active: true,
  completed: true || false,
  completedMatchID: null || matchID,
  startTime: Date,
  endTime: Date,
  conditions: [
    'damage over 10k',
    'at least 10 assists'
  ],
  attempts: [matchIDs]
}

townHeroDetails = {
  heroID: heroID,
  shopLocation: coordinates,
  description: 'Bounty\'s Assassin Den',
  avatar: avatarLink,
  upgrades: []
}

// api endpoints
Turbodota.com/users/65110965/town

GET /api/town/:userID
