const express = require("express");

const router = express.Router();

router.get("/gamelist", (req, res) => {

if (!req.session.user) {
        return res.redirect("/");
    }

    res.sendFile(

        "gamelistlock.html",

        {
            root:"./views"
        }

    );


});

module.exports = router;