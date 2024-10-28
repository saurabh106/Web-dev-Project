const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    price: Number,
    location: String,
    image: {
        filename: {
            type: String,
            default: "default.jpg" // Optional default filename if needed
        },
        url: {
            type: String,
            default: "https://unsplash.com/photos/the-sun-is-shining-over-the-water-and-rocks-CIuhewxFdxU", // URL of your default image
            set: v => v === "" ? "https://unsplash.com/photos/the-sun-is-shining-over-the-water-and-rocks-CIuhewxFdxU" : v
        }
    },
    country: String
});

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;
