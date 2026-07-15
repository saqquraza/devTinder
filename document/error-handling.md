const express = require("express");
const app = express();

app.get("/user/getAllUser", (req, res) => {
    throw new error("asaddsdsd");
    res.send("Fetched the user data")
})

//Global level error handling. It useful when you forgot to handle the error in route level,just on the above code
//Handling the error , always passed below your code . "/" it will handle all the req.
app.use("/", (err, req, res, next) => {
    if (err) {
        //Added the error in sentry, monitoring -> code logic
        res.status(500).send("something went wrong!");
    }
})

//Handling error into the route itself
app.get("/admin/getAllData", (req, res) => {
    // console.log(a);  // Without try catch block error will show in terminal and in res it send a ugly error.
    // res.send("Data fetched successfully")

    try {
        //fetching data from data base and other logic
        console.log(a);  // here error will be generate and it handle by catch block properly.
        res.send("Data fetched successfully")
    } catch (err) {
        //Added the error in sentry, monitoring -> code logic
        res.status(500).send("Some Error")
    }
})


app.listen(7777, () => {
    console.log("Server is running successfully on port 7777...")
})