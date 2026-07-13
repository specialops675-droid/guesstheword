const gameState = require("./gameState");
const wordManager = require("./wordManager");
const playerManager = require("./playerManager");

let io;

function initialize(socketIO){

    io = socketIO;

}


function resetGameState(){

    clearInterval(
        gameState.timer
    );

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
        "GAME START"
    );


    resetGameState();


    gameState.started = true;


    wordManager.resetWords();


    playerManager.resetScores();


    startNextRound();

}



function startNextRound(){


    clearInterval(
        gameState.timer
    );


    gameState.currentRound++;


    console.log(
        "CURRENT ROUND:",
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
            "NO WORD FOUND"
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


    console.log(
        "GAME OVER"
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



    io.emit(
        "gameOver",
        {

            winner:
            scoreboard.length > 0
            ? scoreboard[0]
            : {
                username:"No Winner",
                score:0
            },


            scoreboard:
            scoreboard

        }
    );



    setTimeout(()=>{


        playerManager.resetPlayers();


        resetGameState();



        console.log(
            "GAME RESET AFTER END"
        );


    },3000);



}



module.exports = {

    initialize,

    startGame,

    submitAnswer

};
