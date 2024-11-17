// This folders and this file is use to restructure our code 
// user related route add here and exports and use in app.js

const express = require("express");
const router = express.Router();

router.get("/signup", (req,res)=>{
    res.render("users/signup.ejs")
})




module.exports = router;