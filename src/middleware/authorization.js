const adminAuthorization = (req, res, next) => {
    console.log("Calling from app.js")
    const token = "xyz";
    const isAdmin = token === "xyz";
    if (!isAdmin) {
        res.status(401).send("Forbidden for other user except admin");
    } else {
        next();
    }
}

const userAuthorization = (req,res,next)=>{
    const token = "abx";
    const isValidUser = token === "abx";
    if(!isValidUser){
        res.status(401).message("Not a valid User");
    }else{
        next();
    }
}
module.exports = {
    adminAuthorization,
    userAuthorization
}