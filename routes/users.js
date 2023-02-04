const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const dbURI = 'mongodb://localhost:27017';


router.route('/login').get((req, res) => {
    res.render("login", {
        activeTab: "login",
        
    });
});

router.route('/signup').get((req, res) => {
    res.render("signup", {
        activeTab: "signup",
       
    });
});

router.route('/signup').post(async (req, res) => {
    const ifExists = await User.findOne({ username: req.body.username });
    if (ifExists) {
        return res.send('<h1>Username already exists.</h1><p>Please <a href="/user/signup">Signup</a> with another username</p>');
    }
    console.log(req.body);
    const user = new User({
        username: req.body.username,
        balance: req.body.balance,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    })
    try {
        await user.save();
        console.log(user);
    }
    catch {
        console.log("Not successful");
    }
    return res.redirect('/user/login');
})

router.post('/login', passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
    return res.render("dashboard", {
        activeTab: "logout",
        currentUser: req.user,
    });
});
router.get('/login-failure', (req, res) => {
    console.log('login-failed');
    res.send(`<p>You entered the wrong password.<br>\
    <a href="/user/login">login</a><br>\
    <a href="/user/signup">signup</p>`);
});

router.get('/logout', (req, res, next) => {
    console.log(req.user)
    req.logOut((err) => {
        if (err) return next(err);
        res.redirect('/');
    });

});
router.get('/withdraw', (req, res, next) => {
    res.render('withdraw', {
        currentUser: req.user,
        activeTab: "logout",
    });
})

router.post('/withdraw', (req, res, next) => {
    User.findOneAndUpdate({ username: req.user.username }, { "$inc": { "balance": -Number(req.body.amount) } }, (error, data) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log(data);
        }
    })

    res.redirect('/user/dashboard');
})

router.post('/deposit', (req, res, next) => {
    User.findOneAndUpdate({ username: req.user.username }, { "$inc": { "balance": +Number(req.body.amount) } }, (error, data) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log(data);
        }
    })

    res.redirect('/user/dashboard');
})

router.get('/deposit', (req, res, next) => {
    res.render('deposit', {
        currentUser: req.user,
        activeTab: "logout",
    });
})

router.get('/dashboard', (req, res, next) => {
    res.render('dashboard', {
        activeTab: "logout",
        currentUser: req.user,
    });
})



module.exports = router;