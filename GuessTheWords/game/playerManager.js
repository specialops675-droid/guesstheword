const gameState = require("./gameState");


function addPlayer(socketId, username){


    let player =
    gameState.players.find(
        p => p.username === username
    );


    if(player){

        player.socketId = socketId;

        console.log(
            "PLAYER RECONNECTED:",
            player
        );

        return player;

    }


player = {

    socketId: socketId,

    username: username,

    score: 0,

    ready: false

};



    gameState.players.push(player);



    console.log(
        "PLAYER ADDED:",
        player
    );



    return player;

}




function updateSocket(username, socketId){


    const player =
    gameState.players.find(
        p => p.username === username
    );


    if(player){


        player.socketId = socketId;


        console.log(
            "SOCKET UPDATED:",
            player
        );


    }


    return player;

}





function removePlayer(socketId){


    const before =
    gameState.players.length;



    gameState.players =
    gameState.players.filter(
        p => p.socketId !== socketId
    );



    const after =
    gameState.players.length;



    console.log(
        "PLAYER REMOVED:",
        socketId,
        "BEFORE:",
        before,
        "AFTER:",
        after
    );


}




function getPlayer(socketId){


    return gameState.players.find(
        p => p.socketId === socketId
    );


}




function getPlayers(){

    return gameState.players;

}




function getPlayerCount(){

    return gameState.players.length;

}





function addScore(socketId){


    const player =
    getPlayer(socketId);



    if(player){

        player.score++;


        console.log(
            player.username,
            "score:",
            player.score
        );

    }


    return player;

}





function resetScores(){


    gameState.players.forEach(
        player => {

            player.score = 0;

        }
    );


}





function resetPlayers(){


    console.log(
        "RESET ALL PLAYERS"
    );


    gameState.players = [];


}





function getScoreboard(){


    return gameState.players.map(
        player => ({

            username:
            player.username,

            score:
            player.score

        })
    );


}
function setReady(username){

    const player =
    gameState.players.find(
        p => p.username === username
    );

    if(player){

        player.ready = true;

        console.log(
            "PLAYER READY:",
            username
        );

    }

}

function getReadyCount(){

    return gameState.players.filter(
        p => p.ready
    ).length;

}
function resetReady(){

    gameState.players.forEach(player => {

        player.ready = false;

    });

}

function getReadyPlayers(){

    return gameState.players.filter(
        p => p.ready
    );

}


module.exports = {

    addPlayer,
    updateSocket,
    removePlayer,
    getPlayer,
    getPlayers,
    getPlayerCount,
    addScore,
    resetScores,
    resetPlayers,
    getScoreboard,
    setReady,
    getReadyCount,
    resetReady,
    getReadyPlayers

};
