const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    price:Number,
    location:String,
    image:{
      filename:String,
      url: String,
    },
    country:String
});

const Listing = mongoose.model("Listing",ListingSchema);
module.exports = Listing;
