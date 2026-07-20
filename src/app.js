const express = require("express");
const app = express();
const { main } = require("./config/mongoDbRawConnection");
const { dbConnect } = require("./config/mongoDbMongooseConnection");
const User = require("./models/user");
const Test = require("./models/test");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const { validateUserData } = require("./utils/validateUserData");
const { userAuthorization } = require("./middleware/authorization");

app.use(express.json()); // To convert the json data into js obj.
app.use(cookieParser()); // To access the cookies

app.post("/signup", async (req, res) => {
    try {
        let userData = req.body;

        let { error, value } = validateUserData(userData);

        console.log("value", value);
        if (error) {
            return res.status(400).send(error.details)
        }
        /** 
         *  Bcrypt is a npm packake use to create hash password using hash algorith .
         * salt round basically define how many time want to loops 
         * maximum the round stronge the password but slow the application
         * use .hash() for generating hash password
        */
        const plainPassword = value.password;
        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(plainPassword, saltRounds);

        await User.insertOne({ ...userData, password: hashPassword });

        res.send("User added successfully !");

    } catch (error) {
        console.log(error.message);
        res.status(400).send("Error message :" + error.message);
    }
})

/**
 * Login API
 * POST /login
 */
app.post("/login", async (req, res) => {
    try {
        const reqData = req.body;

        /**
         * Validate the request body using Joi.
         * abortEarly: false returns all validation errors instead of only the first.
         */
        const loginSchema = Joi.object({
            emailId: Joi.string().email().required(),
            password: Joi.string().min(5).required(),
        });

        const { error, value } = loginSchema.validate(reqData, {
            abortEarly: false,
        });

        // Request validation failed
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation Failed",
                errors: error.details,
            });
        }

        const { emailId, password } = value;

        /**
         * Find user by email.
         * Returns null if the email doesn't exist.
         */
        const userData = await User.findOne({ emailId });

        /**
         * Don't reveal whether the email exists.
         * This prevents attackers from identifying registered emails.
         */
        if (!userData) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        /**
         * Compare the plain password entered by the user
         * with the hashed password stored in the database.
         *
         * bcrypt.compare() hashes the entered password using
         * the salt stored inside the hash and checks whether
         * both hashes match.
         */
        const isValidUser = await bcrypt.compare(password, userData.password);

        if (!isValidUser) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        /**
         * After above jwt token will be generate and sent to cookie
         * to make the access token dynamic need to add jsonwebtoken
         * to generate the token.
         */

        const accessToken = await jwt.sign({ _id: userData._id }, "DEV@1234");

        res.cookie("accessToken", accessToken);

        /**
         * Authentication successful.
         */
        return res.status(200).json({
            success: true,
            message: "Login successful",
        });

    } catch (error) {
        console.error(error);

        /**
         * Unexpected server error.
         */
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

app.get("/user", userAuthorization, async (req, res) => {
    try {
        // User ID extracted from the JWT by the authorization middleware
        const { _id } = req;

        // Fetch the authenticated user's details
        const userData = await User.findById(_id);

        /**
         * Return 404 if the user does not exist.
         * This can happen if the account was deleted after the token was issued.
         */
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Successfully fetched user details
        return res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            data: userData,
        });
    } catch (error) {
        console.error("Error fetching user details:", error);

        /**
         * Unexpected server error.
         */
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});



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


