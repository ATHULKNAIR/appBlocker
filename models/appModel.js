const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const applicationSchema = new mongoose.Schema({

    user : {
        type : ObjectId,
        ref : "User"
    },
    appName : {
        type : String,
        required : true
    },
    appUrl : {
        type : String,
        required : true
    },
    weekDayLimit : {
        type : String,
        required : true
    },
    weekEndLimit : {
        type : String,
        required : true
    },
    usageTime : {
        type : String,
    },
    isBlocked : {
        type : Boolean,
    },
    isLimited :{
        type:Boolean
    }


})

module.exports = mongoose.model('Application',applicationSchema);