//Logic of our Databases 

const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listings");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

//copy this from mongoose documents
main()
.then(()=>{
    console.log("connect to DB");
}).catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

//function to save data and delete data
const initDB = async () =>{
    await Listing.deleteMany({})
    await Listing.insertMany(initData.data);
    console.log("Data was initailzed")
}
initDB();