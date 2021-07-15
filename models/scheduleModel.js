const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const scheduleSchema = new mongoose.Schema({

    user: { 
        type: ObjectId, 
        ref: "User" 
    },
    day : {
        type : String,
        required : true
    },
    beginWork : {
        type : String,
        required : true
    },
    endWork : {
        type : String,
        required : true
    },
    restFrom : {
        type : String,
        required : true
    },
    restTo : {
        type : String,
        required : true
    },
   
    isWeekDay : {
        type : Boolean,
        
    },
    isWorkTime : {
        type : Boolean,
        
    }
},{
    timestamps:true
})

module.exports = mongoose.model('Schedule', scheduleSchema)