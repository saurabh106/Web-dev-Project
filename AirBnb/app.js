const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listings")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/", (req, res) => { 
    res.send("I am a Rott");
});

//index route
app.get("/Listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
});

//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
});

//show route
app.get("/Listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});

//Create Route
/* Get location image etc from req.body.listing
new Listing() create a new model instance of it by giving a (listing) you can put newListing(new.ejs) to our model and from that they directly save to our main model 
And Also created a normal try catch to display the error
*/
app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
  
        await newListing.save();
        res.redirect("/listings");
   
});

//Edit route
//  When you click on Edit btn(having btn in show.ejs )the form will open to edit content
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});

//Update Route
//After fill the form click on edit btn then the update will done redirect to that page
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //{ ...req.body.listing } uses the spread syntax to unpack the listing object from req.body. 
    //This assumes req.body contains a listing object with the updated properties for the listing, such as title, description, or price
    res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id", async(req,res)=>{
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});
 

app.listen(8080, () => {
    console.log("Server is Listening to port 8080");
});
