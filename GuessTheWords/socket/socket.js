const playerManager = require("../game/playerManager");
const gameManager = require("../game/gameManager");
const gameState = require("../game/gameState");

module.exports = (io) => {

    gameManager.initialize(io);

    let countdownRunning = false;
    let countdownTimer = null;


    io.on("connection", (socket) => {

        console.log(
            "PLAYER CONNECTED:",
            socket.id
        );


       socket.on("joinGame", (username) => {

    socket.username = username;

    const existing =
    playerManager.getPlayers().find(
        p => p.username === username
    );

    const player =
    playerManager.addPlayer(
        socket.id,
        username
    );

    if(!existing && player){

        player.score = 0;

    }

    sendLobbyUpdate();

    checkStart();

});



        socket.on("registerGamePlayer", (username) => {

    console.log(
        "REGISTER PLAYER:",
        username,
        socket.id
    );

    socket.username = username;

    const player =
    playerManager.addPlayer(
        socket.id,
        username
    );

    if(player){

        player.socketId =
        socket.id;

    }

    if(gameState.started){

        socket.emit(
            "currentGameState",
            {
                currentRound:
                gameState.currentRound,

                maxRounds:
                gameState.maxRounds,

                category:
                gameState.category,

                word:
                gameState.shuffledWord,

                roundTime:
                gameState.roundTime,

                scoreboard:
                playerManager.getScoreboard()
            }
        );

    }

});



        socket.on("submitAnswer", (answer) => {


            gameManager.submitAnswer(
                socket.id,
                answer
            );


        });



        socket.on("playAgain", () => {


            console.log(
                "PLAY AGAIN"
            );


            playerManager.resetPlayers();


            resetGame();


            sendLobbyUpdate();


        });





        socket.on("disconnect", () => {


            console.log(
                "DISCONNECTED:",
                socket.id
            );


            playerManager.removePlayer(
                socket.id
            );


            if(
                playerManager.getPlayerCount() === 0
            ){

                console.log(
                    "NO PLAYERS - RESET GAME"
                );


                resetGame();

            }


            sendLobbyUpdate();


        });



    });





    function sendLobbyUpdate(){


        io.emit(
            "playersUpdate",
            playerManager.getPlayers()
        );


        io.emit(
            "waiting",
            playerManager.getPlayerCount()
        );


    }





    function checkStart(){


        const count =
        playerManager.getPlayerCount();



        console.log(
            "PLAYER COUNT:",
            count
        );



        if(
            count >= 3 &&
            !countdownRunning &&
            !gameState.started
        ){

            console.log(
                "START COUNTDOWN"
            );


            countdownRunning = true;


            startCountdown();

        }


    }







    function startCountdown(){


        let time = 5;



        io.emit(
            "gameCountdown",
            time
        );



        countdownTimer =
        setInterval(() => {



            time--;



            io.emit(
                "gameCountdown",
                time
            );



            if(time <= 0){



                clearInterval(
                    countdownTimer
                );



                countdownTimer = null;


                countdownRunning = false;



                io.emit(
                    "gameStarted"
                );



                setTimeout(() => {



                    gameManager.startGame();



                },1000);



            }



        },1000);



    }







    function resetGame(){


        gameState.started = false;

        gameState.gameFinished = false;

        gameState.currentRound = 0;

        gameState.answer = "";

        gameState.category = "";

        gameState.shuffledWord = "";



        clearInterval(
            gameState.timer
        );



        if(countdownTimer){

            clearInterval(
                countdownTimer
            );

            countdownTimer = null;

        }



        countdownRunning = false;



    }



};
