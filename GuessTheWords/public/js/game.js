const socket = io();

const username = sessionStorage.getItem("username");

console.log(
    "GAME USER:",
    username
);


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


// hide winner screen on entry
if(winnerScreen){

    winnerScreen.style.display = "none";

}

socket.on(
    "currentGameState",
    (state)=>{

        roundText.innerHTML =
        "Round " +
        state.currentRound +
        " / " +
        state.maxRounds;

        categoryText.innerHTML =
        "Category: " +
        state.category;

        wordText.innerHTML =
        state.word;

        timerText.innerHTML =
        "Time: " +
        state.roundTime;

        answerInput.disabled = false;
        submitBtn.disabled = false;

        updateScoreboard(
            state.scoreboard
        );

    }
);

// connect player
socket.on("connect",()=>{

    console.log(
        "CONNECTED:",
        socket.id
    );


   if(username){

    socket.emit(
        "registerGamePlayer",
        username
    );

}

});



// submit answer
if(submitBtn){

    submitBtn.onclick = ()=>{


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

}



if(answerInput){

    answerInput.addEventListener(
        "keypress",
        (e)=>{

            if(e.key === "Enter"){

                submitBtn.click();

            }

        }
    );

}



// countdown
socket.on("gameCountdown",(time)=>{

    message.innerHTML =
    "Game starts in " + time;

});



socket.on("roundCountdown",(time)=>{

    message.innerHTML =
    "Round starts in " + time;

});



// new round
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




// timer
socket.on("timer",(time)=>{

    timerText.innerHTML =
    "Time: " + time;

});

socket.on("scoreboardUpdate",(players)=>{

    updateScoreboard(players);

});



// wrong
socket.on("wrongAnswer",()=>{

    message.innerHTML =
    "❌ Wrong Answer";

});




// correct
socket.on("correctAnswer",(data)=>{


    message.innerHTML =
    "✅ " +
    data.username +
    " got the answer!";


    answerInput.disabled = true;

    submitBtn.disabled = true;


    updateScoreboard(
        data.scoreboard
    );


});




// time up
socket.on("timeUp",(data)=>{


    message.innerHTML =
    "⏰ Time Up! Answer: " +
    data.answer;


    answerInput.disabled = true;

    submitBtn.disabled = true;


});





// game over
socket.on("gameOver",(data)=>{


    if(!data.winner){

        return;

    }


    winnerScreen.style.display =
    "block";


    winnerName.innerHTML =
    "🏆 Winner: " +
    data.winner.username +
    " - " +
    data.winner.score;



    finalScoreboard.innerHTML = "";


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


        window.location =
        "/gamelist";


    };


}
