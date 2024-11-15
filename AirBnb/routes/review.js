// This folders and this file is use to restructure our code 
// listings related route add here and exports and use in router.js


// Change the Path bcz we are in routes(router) review.js  
const express = require("express");
//In app.js having a parent route that :id that you want to use in this file also to get 
//:id that why you use (mergeParams) and / or /:reviewId is a child route 
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const {reviewSchema } = require("../schema");
const Review = require("../models/review");
const Listing = require("../models/listings")
 

//This is for error handlings

const validateReview= (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);  // Pass error to ExpressError
    } else {
        next();
    }
};


// Review Post Route
router.post("/" ,validateReview,wrapAsync
    (async (req, res) => {
  let listing  = await Listing.findById(req.params.id);  // find Id 
  let newReview = new Review(req.body.review); // Create a newReview

  listing.reviews.push(newReview); // Push new review in main listing

  await newReview.save(); // To save in databases
  await listing.save();  // To save in databases
  req.flash("success","New Review Created"); // Flash to display popUp msg / alerts ,,The route wheere redirected there only flash msg display.

//   console.log("New Review Saved"); 
//   res.send("New Review Saved");
res.redirect(`/listings/${listing._id}`); 
}));


// Delete Review Route
router.delete("/:reviewId", wrapAsync(async (req,res)=>{
    let {id, reviewId} = req.params;

//This is for remove objectId from listing array
await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});


//From That the review deleted
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted"); // Flash to display popUp msg / alerts ,,The route wheere redirected there only flash msg display.

    res.redirect(`/listings/${id}`);
}));

module.exports = router;