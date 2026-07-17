const express = require("express");
const app = express();
const { main } = require("./config/mongoDbRawConnection");
const { dbConnect } = require("./config/mongoDbMongooseConnection");
const User = require("./models/user");
const Test = require("./models/test");

app.use(express.json()); // To convert the json data into js obj.

app.get("/test", async (req, res) => {
    try {
        // const testData = await Test.find(
        //     { testCase: "Post api testing" }, // It will fetch all the matching data
        //     { testCase: 1, _id: 0 }  //It will project only testCase field , other field will not come
        // );

        const testData = await Test
            .find({})
            .select({ testCase: 1, _id: 0 });

        console.log("testData", testData);
        res.send(testData);

    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong");
    }
})

app.get("/test/:testId", async (req, res) => {
    try {
        let testId = req.params.testId;
        const testData = await Test.findOne({ testId }, { testCase: 1, _id: 0 });
        if (!testData) {
            res.status(401).send("Test Not Found");
        } else {
            res.send(testData);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong!");
    }
})


app.post("/test", async (req, res) => {
    console.log(req.body);  // o/p undefined just bcz req has json data , our server cannot be read json data.need to change to js obj for which we have middle :- express.json().
    let testObj = req.body;
    try {
        //Inserting single document
        // let test = new Test(testObj);
        // const insertedTest = await test.save();
        // const insertedTest = await Test.insertOne(testObj);

        //Inserting multiple documents
        const insertedTest = await Test.insertMany(testObj);

        console.log("insertedTest", insertedTest);
        res.send("Data inserted successfully");
    } catch (error) {
        console.log(error)
        res.status(500).send("Something went wrong");
    }
})

app.patch("/test", async (req, res) => {
    try {
        let testData = req.body;
        await Test.findByIdAndUpdate({ _id: testData._id }, testData);
        res.send("Updated successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong");
    }
})
app.put("/test", async (req, res) => {
    try {
        let testData = req.body;
        await Test.findByIdAndUpdate({ _id: testData._id }, { $set: { testId: testData.testId } });
        res.send("Updated successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong");
    }
})

app.delete("/test", async (req, res) => {
    try {
        let testId = req.body.testId;
        console.log(testId)
        // await Test.findOneAndDelete({ _id: testId });
        await Test.deleteOne({ _id: testId })
        res.send("Successfully test has been deleted");
    } catch (error) {
        console.log(error)
        res.status(500).send("Something went wrong");
    }
})

app.post("/signup", async (req, res) => {
    let userObj = {
        firstName: "Aman",
        lastName: "Raza",
        email: "saq@gmail.com",
        password: "1234",
        age: 28
    }
    try {
        //An instance of a model is called a document. Creating them and saving to the database is easy.
        //Creating a new instance of the User model and adding the data.
        const user = new User(userObj);
        await user.save(); // It will save data into the user collection.
        res.send("User created successfully!");

    } catch (error) {
        res.status(400).send(error.message)
    }

})

dbConnect()
    .then(() => {
        app.listen(7777, () => {
            console.log("Server is running successfully on port 7777...")
        })
    })
    .catch((error) => console.log(error))



//Connecting mongodb in raw way.
// main()
//     .then(() => {
//         // console.log("Mongo Db connected successfully");
//         app.listen(7777, () => {
//             console.log("Server is running successfully on port 7777...")
//         })
//     })
//     .catch((err)=>{
//         console.log(err)
//     })


