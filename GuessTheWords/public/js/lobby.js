const socket = io();

let username = "";

const enterBtn = document.getElementById("enterBtn");
const playersDiv = document.getElementById("players");
const statusDiv = document.getElementById("status");

fetch("/lobby/user")
.then(res => res.json())
.then(data => {

    username = data.username;

    sessionStorage.setItem(
        "username",
        username
    );

    console.log(
        "LOBBY USER:",
        username
    );

})
.catch(err => {

    console.error(
        "Failed to get user:",
        err
    );

});

enterBtn.onclick = () => {

    if (!username) {

        alert(
            "No username found. Please login again."
        );

        return;

    }

    socket.emit(
        "joinGame",
        username
    );

    enterBtn.disabled = true;

};

socket.on("playersUpdate", (players) => {

    playersDiv.innerHTML = "";

    players.forEach(player => {

        playersDiv.innerHTML += `
            <p>${player.username}</p>
        `;

    });

});

socket.on("waiting", (count) => {

    statusDiv.innerHTML =
        "Players Ready: " +
        count +
        "/3";

});

socket.on("gameCountdown", (time) => {

    statusDiv.innerHTML =
        "Game starts in " +
        time;

});

socket.on("gameStarted", () => {

    window.location = "/game";

});