const express = require('express');
const router = express.Router();
const passport = require('passport');

const homeStartingContent =
    "";
const aboutContent =
    "";
const contactContent =
    "";



router.route('/').get((req, res) => {
    res.render("login", {
        activeTab: "login",
        homeStartingContent: homeStartingContent,
        aboutContent: aboutContent,
        contactContent: contactContent,
    });
});




module.exports = router;