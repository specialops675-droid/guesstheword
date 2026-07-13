const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/");
    }

    res.sendFile("game.html", {
        root: "./views"
    });

});

module.exports = router;