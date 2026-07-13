const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

require("./config/db");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(bodyParser.json());

app.use(session({

    secret:"guesswordsecret",

    resave:false,

    saveUninitialized:false

}));

app.use(express.static(
    path.join(__dirname,"public")
));

app.use("/",require("./routes/auth"));
app.use("/",require("./routes/gameslock"));
app.use("/lobby",require("./routes/lobby"));
app.use("/game",require("./routes/game"));

require("./socket/socket")(io);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {

    console.log(
        `Server Running at port ${PORT}`
    );

});