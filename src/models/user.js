const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minLength: 3,
        maxLength: 14,
        required: [true, "User first name required"]
    },
    lastName: {
        type: String,
        minLength: 3,
        maxLength: 14,
    },
    emailId: {
        type: String,
        lowercase: true, // Always convert `email` to lowercase
        required: true,
        unique: true,
    },
    password: {
        type: String,
        validate: {
            validator: function (value) {
                if (value.length < 4) {
                    throw new Error("Password must be atleast 4 character")
                }
            }
        },
        // validate(value) {
        //     if (value.length < 4) {
        //         throw new Error("Password must be atleast 4 character")
        //     }
        // }
    },
    phone: {
        type: String,
        validate: {
            validator: function (value) {
                return /^\d{10}$/.test(value);
            },
            message: (props) => `${props.value} must be a valid 10-digit phone number`
        },
        required: [true, "User phone number is required"]
    },
    age: {
        type: Number,
        min: [18, 'Age must be atleast 18 , got a {VALUE}'],
        max: 65
    },
    photoUrl: {
        type: String,
        default: "https://www.vecteezy.com/vector-art/5276776-logo-icon-vector-person-on-white-background"
    },
    gender: {
        type: String,
        enum: {
            values: ["male", "female", "others"],
            message: '{VALUE} is not supported'
        }
    },
    skills: {
        type: Array
    }
}, { timestamps: true, strict: true })   // Mongoose provide the feature where timestamps it self add two field one createdAt and updatedAt.

// const User = mongoose.model("User", userSchema);
// module.exports = {
//     User
// }
userSchema.methods.getJwtToken = async function () {
    const user = this; // when ever it call it will return the user object
    const _id = user._id;
    return await jwt.sign({ _id }, "DEV@1234", { expiresIn: "1h" });
}

userSchema.methods.validPassword = async function(passwordInputByUser){
    const user = this ; // when ever it call it will return the user object
    const passwordHash = user.password; // password hash stored in the database
    return await bcrypt.compare(passwordInputByUser, passwordHash);
}
module.exports = mongoose.model("User", userSchema);