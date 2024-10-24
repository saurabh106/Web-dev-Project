const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listings")
const path = require("path");

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
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.send("I am a Rott");
});

//index route
app.get("/Listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
});

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
    });

    
//show route
app.get("/Listings/:id", async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});


//Create Route
/* Get location image etc from req.body.listing
new Listing() create a new model instance of it by giving a (listing) you can put newListing(new.ejs) to our model and from that they directly save to our main model 
*/
app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    try {
        await newListing.save();
        res.redirect("/listings");
    } catch (error) {
        console.error(error);
        res.status(400).render("yourErrorTemplate", { error: error.message }); // create a (yourErrorTemplate) to print the error
    }
});



// app.get("/testListing",(req,res)=>{

// })

app.listen(8080, () => {
    console.log("Server is Listening to port 8080");
});
