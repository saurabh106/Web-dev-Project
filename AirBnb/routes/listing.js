// This folders and this file is use to restructure our code 
// listings related route add here and exports and use in app.js

// Change the Path bcz we are in routes(router) listings.js  
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

const Listing = require("../models/listings");

//This is for authentication is user logged in or not and isOwner is for authorization
const {isLoggedIn,isOwner,validateListing} = require("../middleware");




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
    //Use of populate taking ref between collections -> when an listing add there specific reviews also add and now there owner ObjectId also added by using populate()
    // populate({ path:"reviews",populate:{path:"author",}}) basically every listing come with there reviews also passing one array with reviews passing author also and print in show.ejs
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author", 
            select: "username email"  // This will populate the author field of each review
        }
    }).populate("owner");
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
    //To save owner details when new listing add 
    newListing.owner = req.user._id; //req.user._id; from this we get current user objectId; -> if i created my username was showing there;
    await newListing.save();
    req.flash("success", "New Listings created! "); // Flash to display popUp msg / alerts ,,The route wheere redirected there only flash msg display.
    res.redirect("/listings");
})
);


//Edit route
//  When you click on Edit btn(having btn in show.ejs )the form will open to edit content
//isOwner is use to see that users have persmission to edit this listings or not
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
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
//isOwner is use to see that users have persmission to edit this listings or not
router.put("/:id",isLoggedIn,isOwner, validateListing, wrapAsync(async (req, res) => {

    let { id } = req.params;
   await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //{ ...req.body.listing } uses the spread syntax to unpack the listing object from req.body. 
    //This assumes req.body contains a listing object with the updated properties for the listing, such as title, description, or price

    req.flash("success", "Listing updated! "); // Flash to display popUp msg / alerts ,,The route wheere redirected there only flash msg display.
    res.redirect(`/listings/${id}`);
}));


//Delete Route
//isOwner is use to see that users have persmission to edit this listings or not
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing); // Delete listing display on terminal
    req.flash("success", "Listing Deleted"); // Flash to display popUp msg / alerts
    res.redirect("/listings");
}));

module.exports = router;


