const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});

  //mapping every data object to the existing object but adding new owner to each one
  initData.data = initData.data.map((obj)=> ({
    ...obj,
    owner: "665b8bd51427bf5ce7033e8b",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();