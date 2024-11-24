// This folders and this file is use to restructure our code 
// listings related route add here and exports and use in app.js

// Change the Path bcz we are in routes(router) listings.js  
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema} = require("../schema");
const Listing = require("../models/listings");

//This is for authentication is user logged in or not 
const {isLoggedIn} = require("../middleware");


//This is for error handlings
// This is for create route 
// This is for error handlings showing what is error if error occur than the custom class error was through
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);  // Pass error to ExpressError
    } else {
        next();
    }
};



// If you tell that common word is listings in routes that no need to use this now in main routes

//Index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));


//New Route
router.get("/new",isLoggedIn, (req, res) => {
  
    res.render("listings/new.ejs")
});

//show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/lisitngs");
    }
    res.render("listings/show.ejs", { listing });
}));


//Create Route
/* Get location image etc from req.body.listing
new Listing() create a new model instance of it by giving a (listing) you can put newListing(new.ejs) to our model and from that they directly save to our main model 
And Also created a normal try catch to display the error
*/
router.post("/",isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {

    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listings created! "); // Flash to display popUp msg / alerts ,,The route wheere redirected there only flash msg display.
    res.redirect("/listings");
})
);


//Edit route
//  When you click on Edit btn(having btn in show.ejs )the form will open to edit content
router.get("/:id/edit",isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/lisitngs");
    }
    res.render("listings/edit.ejs", { listing });
}));


//Update Route
//After fill the form click on edit btn then the update will done redirect to that page
router.put("/:id",isLoggedIn, validateListing, wrapAsync(async (req, res) => {

    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //{ ...req.body.listing } uses the spread syntax to unpack the listing object from req.body. 
    //This assumes req.body contains a listing object with the updated properties for the listing, such as title, description, or price

    req.flash("success", "Listing updated! "); // Flash to display popUp msg / alerts ,,The route wheere redirected there only flash msg display.
    res.redirect(`/listings/${id}`);
}));


//Delete Route
router.delete("/:id",isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing); // Delete listing display on terminal
    req.flash("success", "Listing Deleted"); // Flash to display popUp msg / alerts
    res.redirect("/listings");
}));

module.exports = router;