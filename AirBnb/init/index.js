const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listings");

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

const initDB = async () =>{
    await Listing.deleteMany({})
    await Listing.insertMany(initData.data);
    console.log("Data was initailzed")
}
initDB();