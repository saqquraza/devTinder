//Here we are connecting a mongo db using a mongodb package.

const { MongoClient } = require("mongodb");

//connection string 
let mongo_uri = "mongodb+srv://namaste_user:h5PZzPp1zV8Ljm5f@namastenode.jlzqgkn.mongodb.net/";

//creating an instance.
let client = new MongoClient(mongo_uri);

//db name 
let dbName = "hello_world";

async function main() {
    // connecting with server/cluster
    await client.connect();
    console.log('Mongo Db connected successfully');
    //connecting with db
    let db = client.db(dbName);
    //connecting with collection
    let collection = db.collection("user");
    let user = await collection.find({}).toArray();
    // console.log("user", user)
    // return 'done.';
}

/**
 * when calling main inside this module that time server listen first and then it connecting with db.
 * So good way is first connect with the db then server will listen ,if connected successfully otherwise it not connect
 * for that need to export the main from here and used in app.js . 
*/
// main()
//   .then(console.log)  
//   .catch(console.error)

module.exports = {
    main
}