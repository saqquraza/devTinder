
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const joi = require("joi");

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


/**
 * Middleware to verify the user's access token.
 * If the token is valid, the user's ID is attached to the request object.
 */
const userAuthorization = async (req, res, next) => {
    try {
        // Get access token from cookies
        const accessToken = req.cookies.accessToken;

        const tokenSchema = joi.object().keys({
            accessToken: joi.string().required()
        })

        const { error, value } = tokenSchema.validate({ accessToken })
        /**
         * Return 401 if the access token is missing.
         */
        if (error) {
            return res.status(401).json({
                success: false,
                message: "Access token not found",
            });
        }

        // Verify JWT token
        const decodedToken = jwt.verify(accessToken, "DEV@1234");

        // Store authenticated user's ID for use in subsequent middleware/routes
        req._id = decodedToken._id;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        /**
         * Token verification failed.
         * This can happen if the token is expired, malformed, or has an invalid signature.
         */
        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token",
        });
    }
};

module.exports = {
    adminAuthorization,
    userAuthorization
}