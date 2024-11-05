const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
    title: {
        type: String,
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
            default: "https://images.unsplash.com/photo-1496483648148-47c686dc86a8", // URL of your default image
            set: v => v === "" ? "https://images.unsplash.com/photo-1496483648148-47c686dc86a8" : v
        }
    },
    country: String
});

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;
