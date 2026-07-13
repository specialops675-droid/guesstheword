const playerManager = require("../game/playerManager");
const gameManager = require("../game/gameManager");
const gameState = require("../game/gameState");

module.exports = (io)=>{

    gameManager.initialize(io);

    let countdownRunning = false;

    io.on("connection",(socket)=>{

        console.log(
            "Player connected:",
            socket.id
        );

        socket.on("joinGame",(username)=>{

            socket.username = username;

            const player = playerManager.addPlayer(
                socket.id,
                username
            );

            if(player){
                player.score = 0;
            }

            sendLobbyUpdate();
            checkStart();

        });

        socket.on("registerGamePlayer",(username)=>{

    console.log(
        "REGISTER GAME PLAYER:",
        username,
        socket.id
   );

    socket.username = username;

    playerManager.updateSocket(
        username,
        socket.id
    );

});

        socket.on("submitAnswer",(answer)=>{

            gameManager.submitAnswer(
                socket.id,
                answer
            );

        });

        socket.on("playAgain",(username)=>{

            console.log(
                "PLAY AGAIN:",
                username
            );

            playerManager.removePlayer(
                username
            );

            sendLobbyUpdate();

            socket.emit(
                "backToLobby"
            );

        });

        socket.on("disconnect",()=>{

            console.log(
                "Disconnected:",
                socket.id
            );

         //   playerManager.removePlayer(
           //     socket.id
           // );

          //  sendLobbyUpdate();

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

        if(
            count >= 3 &&
            !countdownRunning &&
            !gameState.started
        ){

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

        const timer = setInterval(()=>{

            time--;

            io.emit(
                "gameCountdown",
                time
            );

            if(time <= 0){

                clearInterval(timer);

                countdownRunning = false;

                io.emit(
                    "gameStarted"
                );

                setTimeout(()=>{

                    gameManager.startGame();

                },1000);

            }

        },1000);

    }

};