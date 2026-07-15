const express = require("express");
const app = express();

const { adminAuthorization, userAuthorization } = require("./middleware/authorization");

//No authorization for login part
app.post("/login",(req,res)=>{
    res.send("Logged in successfully!");
})

//Specific route authorazation
app.get("/user/getAllUser",(req,res,userAuthorization)=>{ 
    res.send("Fetch all user data successfully!!");
})

/**
 * for the clean code and best practice need to create a folder i.e middleware and add the auth
 * define the auth related code on the file and just used here
 */
app.use("/admin", adminAuthorization);  // Globally authorization for admin
app.get("/admin/getAllData", (req, res) => {
    console.log("checking from middleware which define into a folder then executing")
    res.send("Data fetched successfully");
})

app.delete("/admin/deleteData", (req, res) => {
    console.log("checking from middleware which define into a folder then executing")
    res.send("Data has deleted");
})

/**
 * with middle ware how to do authorization
 * we can write the whole authorization login into app.use() and then next
 * why using app.use() bcz every http method can passed this route 
 * /admin can hit for every route which has prefix /admin.
 */
app.use("/admin", (req, res, next) => {
    const token = "xyz";
    const isAdmin = token === "xyz";
    if (!isAdmin) {
        res.status(401).send("Forbidden for other user except admin");
    } else {
        next();
    }
})

app.get("/admin/getAllData", (req, res) => {
    console.log("checking from middleware then executing")
    res.send("Data fetched successfully");
})

app.delete("/admin/deleteData", (req, res) => {
    console.log("checking from middleware then executing")
    res.send("Data has deleted");
})




/**  
 * Nowing doing a authorization without implementing middleware for admin route
 * Without middleware need to write the same logic twice , 
 * if there are multiple route then have to write everytime.
*/
app.get("/admin/getAllData", (req, res) => {
    const token = "xyzasassa";
    const isAdmin = token === "xyz";
    if (isAdmin) {
        res.send("Data fetched successfully");
    } else {
        res.status(401).send("Forbidden for other user except admin")
    }
})

app.delete("/admin/deleteData", (req, res) => {
    const token = "xyz";
    const isAdmin = token === "xyz";
    if (isAdmin) {
        res.send("Data has deleted");
    } else {
        res.status(401).send("Forbidden for other user except admin")
    }
})

















/**
 * In below code i understand that evenif after res.send() , remaining code will be execute.
 * Next () it used to move next function or request handler
 * Where we are calling next() , after that code will get execute.
 */

app.get("/admin",
    (req, res, next) => {
        console.log("respond 1");
        res.status(200).send("Data send to admin panel");
        next(); //after res back , it still execute
        console.log("after exectung");
    },
    (req, res, next) => {
        console.log("respond 2");
        next();
    },
    (req, res) => {
        console.log("respond 3");
        console.log("does i get execute after res send to client");
        res.send("I will give an error"); // Cannot set headers after they are sent to the client
    }
)


app.get("/user", (req, res) => {
    res.send({
        data: {
            "firstName": "Aman",
            "lastName": "Raza"
        },
        message: "User Data fetch sucessfully",
        status: 200
    })
})

app.post("/user", (req, res) => {
    // DB called and user added
    res.send({
        message: "User has added",
        status: 201
    })
    console.log("User has added", a);
})

app.get("/user/:userId", (req, res) => {
    console.log(req.params);
    res.send("Fetch the particular User !!" + req.params.userId)
})

//When we declare a route using app.use , then this route can be hit from http every methods(get, post etc)
//Want to handle the specific route only then
// app.use("/test",(req,res)=>{
//     res.send("You are testing in the right places!!")
// })

// //This is going to handle all the route which is coming in this application
// app.use((req, res) => {
//     res.send("Hi,express is runnings")
// })



app.listen(7777, () => {
    console.log("Server is running successfully on port 7777...")
})