const Application = require('../models/appModel');
const Schedule = require('../models/scheduleModel')
const User = require('../models/userModel')

const appCtrl = {

///////////////////////////////////////////      ADD APPLICATION     ////////////////////////////////////////////

    addApplication: async (req, res) => {
        try {
            const { appName, appUrl, weekDayLimit, weekEndLimit } = req.body;
            const user = req.user.id
            const userDetails = await Application.find({user:req.user.id}).select("appName -_id")      // get array of limited apps
    
            const obj = userDetails.find((u)=>u.appName==req.body.appName);
            if(obj) return res.status(400).json({msg:"App already added",obj})      // check whether app already exists

            const limitedApps = new Application({
               appName , appUrl , weekDayLimit, weekEndLimit, user                  // create new App object
            })

            await User.findOneAndUpdate(req.user.id, {                              // adding app id to User Collection
                $push: { limitedApps: limitedApps._id }
            });

            await limitedApps.save();                                               // saving to mongodb
           return res.status(200).json({success:true, msg:"Application added Successfully"})
           
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

///////////////////////////////////////////      APPLICATION INFORMATION      ////////////////////////////////////////////

    getApplication: async (req, res) => {
        try {
            const apps = await Application.find({user:req.user.id});                  //  get all apps with user id
            res.status(200).json({apps})
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

///////////////////////////////////////////      EDIT APPLICATION      ////////////////////////////////////////////

    editApplication: async (req, res) => {
        try {
            const {weekDayLimit,weekEndLimit} = req.body;
            const updateFields = [];
            if(weekDayLimit) updateFields.weekDayLimit = weekDayLimit;
            if(weekEndLimit) updateFields.weekEndLimit = weekEndLimit;
            await Application.findByIdAndUpdate(req.params.id,{                      //  find app by params.id and updating fields
                $set:{...updateFields}
            },{new:true, runValidators:true})
            res.status(200).json({msg:"Limit changed Succesfully"})
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
///////////////////////////////////////////      DELETE APPLICATION      ////////////////////////////////////////////

    deleteApplication: async (req, res) => {
        try {
            const limitedApps = await Application.findById(req.params.id);
            if(!limitedApps){                                                            // Check whether app exists
                return res.status(404).json({msg:"Application Not found"})
            }
            await User.findOneAndUpdate(req.user.id, {                                   // Deleting app.id from User Collection
                $pull: { limitedApps: limitedApps._id }
            });

            await limitedApps.remove();                                                  // removing from application collection
            res.status(200).json({msg:"Application deleted Successfully"});
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
}

module.exports = appCtrl;