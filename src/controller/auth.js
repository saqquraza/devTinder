const express = require("express");
const router = express.Router();
const { validateUserData } = require("../utils/validateUserData");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const User = require("../models/user");


router.post("/signup", async (req, res) => {
    try {
        let userData = req.body;

        let { error, value } = validateUserData(userData);

        console.log("value", value);
        if (error) {
            return res.status(400).json({
                message:"Validation failed",
                errors:error.details,
                success: false,
            })
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
router.post("/login", async (req, res) => {
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
         //const isValidUser = await bcrypt.compare(password, userData.password); 
        const isValidUser = await userData.validPassword(password);

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

        //const accessToken = await jwt.sign({ _id: userData._id }, "DEV@1234");
        
        const accessToken = await userData.getJwtToken(); // it will return the jwt token for the user and we can send it to the cookie.

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

module.exports = router;