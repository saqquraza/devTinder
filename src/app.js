const express = require("express");
const app = express();

//Want to handle the specific route only then
app.use("/test",(req,res)=>{
    res.send("You are testing in the right places!!")
})

//This is going to handle all the route which is coming in this application
app.use((req, res) => {
    res.send("Hi,express is runnings")
})



app.listen(7777, () => {
    console.log("Server is running successfully on port 7777...")
})