const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");

// Using Sessions now
const session = require("express-session");
//Now using Flash , is like a alert or mes that appper once only after refresh they disapper
const flash = require("connect-flash");


//For restructuring code you created a listing.js / review.js new file in router that require here and use for routes
const listings = require("./routes/listing");
const reviews = require("./routes/review");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("connect to DB");
    }).catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate); // includes folder to create template and use everywhere ex:<%- include("../includes/footer.ejs") %> That how you can write and use it
app.use(express.static(path.join(__dirname, "/public")));


const sessionOptions = {
    secret : "mysupersecretcode",
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};


app.get("/", (req, res) => {
    res.send("Nothing to see here !!");
});


// That how you use seesions
app.use(session(sessionOptions));
//Using flash -> write before route bcz we need to display message !
app.use(flash());


// we can define flash by using key : msg pair
//create a middlewares for flash to store in locals we can access in any route or use in any template or create a variable to save it
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    // console.log(res.locals.success);
    next();
});


// For restructing code this coming from listing.js in routes folder 
app.use("/listings", listings);  // common route name is /listings
// For restructing code this coming from review.js in routes folder 
app.use("/listings/:id/reviews", reviews); ///listings/:id/review


//For all route -  whose route that does not exist in our app 
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found !"));
});

// Basic Middlewares - if you want to use M then (async have req,res,next) . when you called next then only for that route if error occur then M will Occur !
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("Error.ejs", { err });
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("Server is Listening to port 8080");
});
