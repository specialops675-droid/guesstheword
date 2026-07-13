exports.lobby = (req,res)=>{


    res.sendFile(

        "game.html",

        {
            root:"views"
        }

    );


};