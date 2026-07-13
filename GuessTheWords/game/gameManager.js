const gameState = require("./gameState");
const wordManager = require("./wordManager");
const playerManager = require("./playerManager");

let io;

function initialize(socketIO){

    io = socketIO;

}

function startGame(){

    console.log(
        "GAME START"
    );

    gameState.started = true;
    gameState.currentRound = 0;

    wordManager.resetWords();

    playerManager.resetScores();

    startNextRound();

}

function startNextRound(){

    clearInterval(
        gameState.timer
    );

    gameState.currentRound++;

    if(
        gameState.currentRound >
        gameState.maxRounds
    ){

        endGame();
        return;

    }

    const word =
    wordManager.getRandomWord();

    gameState.category =
    word.category;

    gameState.answer =
    word.answer;

    gameState.shuffledWord =
    word.shuffled;

    let count = 3;

    io.emit(
        "roundCountdown",
        count
    );

    const countdown = setInterval(()=>{

        count--;

        io.emit(
            "roundCountdown",
            count
        );

        if(count <= 0){

            clearInterval(
                countdown
            );

            startRound();

        }

    },1000);

}

function startRound(){

    gameState.roundTime = 30;

    io.emit(
        "newRound",
        {
            round:gameState.currentRound,
            total:gameState.maxRounds,
            category:gameState.category,
            word:gameState.shuffledWord
        }
    );

    gameState.timer = setInterval(()=>{

        gameState.roundTime--;

        io.emit(
            "timer",
            gameState.roundTime
        );

        if(
            gameState.roundTime <= 0
        ){

            clearInterval(
                gameState.timer
            );

            io.emit(
                "timeUp",
                {
                    answer:
                    gameState.answer
                }
            );

            setTimeout(()=>{

                startNextRound();

            },2000);

        }

    },1000);

}

function submitAnswer(
    socketId,
    answer
){

    if(
        !gameState.started
    ){
        return;
    }

    const cleanAnswer =
    answer.trim().toUpperCase();

    if(
        cleanAnswer !==
        gameState.answer
    ){

        io.to(socketId).emit(
            "wrongAnswer"
        );

        return;
    }

    clearInterval(
        gameState.timer
    );

    const player =
    playerManager.addScore(
        socketId
    );

    if(!player){
        return;
    }

    io.emit(
        "correctAnswer",
        {
            username:
            player.username,

            answer:
            gameState.answer,

            scoreboard:
            playerManager.getScoreboard()
        }
    );

    setTimeout(()=>{

        startNextRound();

    },2000);

}

function endGame(){

    gameState.started = false;

    let scoreboard =
    playerManager.getScoreboard();

    scoreboard.sort(
        (a,b)=>
        b.score-a.score
    );

    io.emit(
        "gameOver",
        {
            winner:
            scoreboard[0],

            scoreboard:
            scoreboard
        }
    );

    setTimeout(()=>{

        playerManager.resetPlayers();

        console.log(
            "PLAYERS CLEARED AFTER GAME"
        );

    },1000);

}

module.exports = {

    initialize,
    startGame,
    submitAnswer

};