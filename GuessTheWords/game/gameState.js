const gameState = {

    players: [],

    started: false,

    currentRound: 0,

    maxRounds: 20,

    category: "",

    answer: "",

    shuffledWord: "",

    roundTime: 30,

    timer: null,

    countdownTimer: null,

    gameFinished: false

};


module.exports = gameState;
