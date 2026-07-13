const socket = io();

const username =
sessionStorage.getItem("username");

console.log(
    "GAME USER:",
    username
);

socket.on("connect", () => {

    console.log(
        "SOCKET CONNECTED:",
        socket.id
    );

    if(username){

        console.log(
            "REGISTERING:",
            username
        );

        socket.emit(
            "registerGamePlayer",
            username
        );

    }else{

        console.log(
            "NO USERNAME FOUND"
        );

    }

});const socket = io();

const username =
sessionStorage.getItem("username");

console.log(
    "GAME USER:",
    username
);

socket.on("connect", () => {

    console.log(
        "SOCKET CONNECTED:",
        socket.id
    );

    if(username){

        console.log(
            "REGISTERING:",
            username
        );

        socket.emit(
            "registerGamePlayer",
            username
        );

    }else{

        console.log(
            "NO USERNAME FOUND"
        );

    }

});

const roundText = document.getElementById("round");
const categoryText = document.getElementById("category");
const wordText = document.getElementById("word");
const timerText = document.getElementById("timer");
const answerInput = document.getElementById("answerInput");
const submitBtn = document.getElementById("submitBtn");
const message = document.getElementById("message");
const scoreboard = document.getElementById("scoreboard");

const winnerScreen = document.getElementById("winnerScreen");
const winnerName = document.getElementById("winnerName");
const finalScoreboard = document.getElementById("finalScoreboard");
const playAgainBtn = document.getElementById("playAgainBtn");

if(winnerScreen){

    winnerScreen.style.display = "none";

}

submitBtn.onclick = () => {

    const answer =
    answerInput.value.trim();

    if(answer === ""){

        message.innerHTML =
        "⚠️ Please enter an answer";

        return;

    }

    socket.emit(
        "submitAnswer",
        answer
    );

    answerInput.value = "";

};

answerInput.addEventListener(
    "keypress",
    (e)=>{

        if(e.key === "Enter"){

            submitBtn.click();

        }

    }
);

socket.on("roundCountdown",(time)=>{

    message.innerHTML =
    "Round starts in " +
    time;

});

socket.on("newRound",(data)=>{

    roundText.innerHTML =
    "Round " +
    data.round +
    " / " +
    data.total;

    categoryText.innerHTML =
    "Category: " +
    data.category;

    wordText.innerHTML =
    data.word;

    timerText.innerHTML =
    "Time: 30";

    answerInput.disabled = false;
    submitBtn.disabled = false;

    message.innerHTML = "";

});

socket.on("timer",(time)=>{

    timerText.innerHTML =
    "Time: " +
    time;

});

socket.on("wrongAnswer",()=>{

    message.innerHTML =
    "❌ Wrong Answer!";

});

socket.on("correctAnswer",(data)=>{

    message.innerHTML =
    "✅ " +
    data.username +
    " got the correct answer! (" +
    data.answer +
    ")";

    answerInput.disabled = true;
    submitBtn.disabled = true;

    updateScoreboard(
        data.scoreboard
    );

});

socket.on("timeUp",(data)=>{

    message.innerHTML =
    "⏰ Time Up! Correct Answer: " +
    data.answer;

    answerInput.disabled = true;
    submitBtn.disabled = true;

});

socket.on("gameCountdown",(time)=>{

    message.innerHTML =
    "Game starts in " +
    time;

});

socket.on("gameOver",(data)=>{

    winnerScreen.style.display =
    "block";

    winnerName.innerHTML =
    "🏆 Winner: " +
    data.winner.username +
    " - " +
    data.winner.score;

    finalScoreboard.innerHTML =
    "";

    data.scoreboard.forEach(player=>{

        finalScoreboard.innerHTML += `
            <p>
                ${player.username}
                :
                ${player.score}
            </p>
        `;

    });

});



function updateScoreboard(players){

    scoreboard.innerHTML = "";

    players.forEach(player=>{

        scoreboard.innerHTML += `
            <p>
                ${player.username}
                :
                ${player.score}
            </p>
        `;

    });

}

if(playAgainBtn){

    playAgainBtn.onclick = ()=>{

         window.location = "/gamelist";

    };

}