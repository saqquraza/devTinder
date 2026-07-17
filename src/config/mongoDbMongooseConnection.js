//Going to be connect with mongoDb using a mongoose odm.

const mongoose = require("mongoose")

let mongo_uri = "mongodb+srv://namaste_user:h5PZzPp1zV8Ljm5f@namastenode.jlzqgkn.mongodb.net/devTinder"
async function dbConnect(){
    await mongoose.connect(mongo_uri);
    console.log("Mongo db connected successfully");
    return "done"
}

module.exports = {
    dbConnect
}