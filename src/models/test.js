const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
    testCase:{
        type:String
    },
    testId:{
        type:Number
    },
    testTime:{
        type:String
    }
})

module.exports = mongoose.model("Test",testSchema);