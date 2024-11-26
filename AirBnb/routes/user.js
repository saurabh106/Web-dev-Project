// This folders and this file is use to restructure our code 
// user related route add here and exports and use in app.js

const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware");


router.get("/signup", (req, res) => {
    res.render("users/signup.ejs")
})

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        //This login function use to uses to When signup automatically login in user  also they also taking some parameters
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("sucess", "Welcome to wanderlust!");
            res.redirect("/listings");
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));


router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

//saveRedirectUrl -> when you login saveRedirectUrl save then only you login using passport then req.session the url deleted then you redirected to req.local.redirectUrl;
router.post("/login",saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust !");
    //saveRedirectUrl -> having one catch if you direct login without go to any route then you can/t redirected to /listings bcz the saveRedirectUrl was not executed that why this condition was created;
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
});



//For logout we use req.logout already have a function of passport
//they use serializeUser and deserializeUser for doing logout passing with some callbacks
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
})













module.exports = router;