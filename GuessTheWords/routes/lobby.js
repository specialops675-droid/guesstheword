const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/");
    }

    res.sendFile("lobby.html", {
        root: "./views"
    });

});
router.get("/user", (req, res) => {

    res.json({
        username: req.session.user
    });

});
module.exports = router;