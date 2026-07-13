const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db", (err)=>{

    if(err){
        console.log("Database Error:", err.message);
    }
    else{
        console.log("Connected to SQLite Database");
    }

});


db.serialize(()=>{

    db.run(`
        CREATE TABLE IF NOT EXISTS users(

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            username TEXT UNIQUE,

            password TEXT

        )
    `);

});


module.exports = db;