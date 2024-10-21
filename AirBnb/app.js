const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing  = require("./models/listings")

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("connect to DB");
}).catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get("/",(req,res)=>{
    res.send("Hello World");
});

app.get("/testListing",(req,res)=>{
     
})

app.listen(8080,()=>{
    console.log("Server is Listening to port 8080");
});
