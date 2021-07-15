
const Schedule = require('../models/scheduleModel');
const User = require('../models/userModel');

const scheduleCtrl = {

///////////////////////////////////////////      INSERT SCHEDULE      ////////////////////////////////////////////

    addSchedule: async (req, res) => {
        try {
            const { day, beginWork, endWork,restFrom, restTo} = req.body;
            const user = req.user.id
            let schedule = await Schedule.create({                         // creating schedule
                day, beginWork, endWork,restFrom,restTo, user
            });
            await User.findOneAndUpdate(req.user.id, {                     // adding schedule id to User collection
                $push: { schedule: schedule._id }
            });
            res.status(200).json({ success: true, data: schedule });
        
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

///////////////////////////////////////////      UPDATE SCHEDULE      ////////////////////////////////////////////

    editSchedule: async (req, res) => {
        try {
            const { day, beginWork, endWork,restFrom,restTo } = req.body;
            const updateFields = [];
            if (day) updateFields.day = day;
            if (beginWork) updateFields.beginWork = beginWork;
            if (endWork) updateFields.endWork = endWork;
            if (restFrom) updateFields.restFrom = restFrom;
            if (restTo) updateFields.restTo = restTo;
            const schedule = await Schedule.findByIdAndUpdate(req.params.id, {        // pushing updates
                $set: { ...updateFields } 
            },
                {
                    new: true, runValidators: true
                })
                res.status(200).json({msg:"Updated Successfully", data:schedule})
        
            } catch (err) {
            return res.statue(500).json({ msg: err.message });
        }
    },

///////////////////////////////////////////      DELETING SCHEDULE      ////////////////////////////////////////////

    deleteSchedule : async (req,res) =>{
        try {
            const schedule = await Schedule.findById(req.params.id);
            if(!schedule) return res.status(404).json({msg:"Schedule Not Found"});
            await User.findByIdAndDelete(req.user.id,{
                $pull :{schedule : req.params.id}
            })
            await schedule.remove();                                               // removing schedule from database
            res.status(200).json({msg:"Schedule successfully deleted"})
            
        } catch (err) {
            return res.status(500).json({msg:err.message});
        }
    },

///////////////////////////////////////////      SCHEDULE INFORMATION      ////////////////////////////////////////////

    getSchedule : async (req,res) =>{
        try {
            const schedule = await Schedule.find({user:req.user.id});         // find all schedules with user id
            res.status(200).json({schedule});
        } catch (err) {
            return res.status(500).json({msg:err.message});
        }
    }
}
module.exports = scheduleCtrl;