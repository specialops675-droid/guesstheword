const gameState = require("./gameState");
const wordManager = require("./wordManager");
const playerManager = require("./playerManager");

let io;


function initialize(socketIO){

    io = socketIO;

}



function resetGame(){

    console.log(
        "RESETTING GAME STATE"
    );


    console.log("CORRECT ANSWER");
clearInterval(gameState.timer);
console.log("TIMER CLEARED");


    gameState.started = false;

    gameState.gameFinished = false;

    gameState.currentRound = 0;

    gameState.category = "";

    gameState.answer = "";

    gameState.shuffledWord = "";

    gameState.roundTime = 30;

    gameState.timer = null;


}





function startGame(){

    console.log(
        "========== GAME START =========="
    );


    resetGame();


    gameState.started = true;


    wordManager.resetWords();


    playerManager.resetScores();
io.emit(
    "scoreboardUpdate",
    playerManager.getScoreboard()
);

    console.log(
        "PLAYERS:",
        playerManager.getPlayers()
    );


    startNextRound();


}





function startNextRound(){


    clearInterval(
        gameState.timer
    );



    gameState.currentRound++;



    console.log(
         "START ROUND",
        gameState.currentRound
    );



    if(
        gameState.currentRound >
        gameState.maxRounds
    ){

        endGame();

        return;

    }



    const word =
    wordManager.getRandomWord();



    if(!word){

        console.log(
            "NO WORD AVAILABLE"
        );

        endGame();

        return;

    }



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



    const countdown =
    setInterval(()=>{


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

    clearInterval(
        gameState.timer
    );

    gameState.timer = null;

    gameState.roundTime = 30;



    io.emit(
        "newRound",
        {

            round:
            gameState.currentRound,

            total:
            gameState.maxRounds,

            category:
            gameState.category,

            word:
            gameState.shuffledWord

        }
    );



    gameState.timer =
    setInterval(()=>{


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

    gameState.timer = null;



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







function submitAnswer(socketId, answer){



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

gameState.timer = null;

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


    console.log(
        "========== GAME OVER =========="
    );


    gameState.started = false;

    gameState.gameFinished = true;



    clearInterval(
        gameState.timer
    );



    let scoreboard =
    playerManager.getScoreboard();



    scoreboard.sort(
        (a,b)=>
        b.score-a.score
    );



    let winner = {

        username:"No Winner",

        score:0

    };



    if(scoreboard.length > 0){

        winner = scoreboard[0];

    }



   playerManager.resetReady();

io.emit(
    "gameOver",
    {
        winner:winner,
        scoreboard:scoreboard
    }
);


}


function setReady(username){

    const player = gameState.players.find(
        p => p.username === username
    );

    if(player){
        player.ready = true;
    }
}

function getReadyCount(){

    return gameState.players.filter(
        p => p.ready
    ).length;
}


module.exports = {

    initialize,

    startGame,

    submitAnswer,

    resetGame

};
