const Application = require('../models/appModel')
const Schedule = require('../models/scheduleModel')
const User = require('../models/userModel')
const moment = require('moment')

const logicCtrl = {

    ///////////////////////////////////////////      APPLICATION LOGIC      ////////////////////////////////////////////

    isBlocked: async (req, res) => {

        const weekDay = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        const today = moment().format('dddd')
        const schedule = await Schedule.findOne({ day: today }).where('user').in(req.user.id);  // get schedule using day

        if (schedule) {

            //  if workday then app is limited according to weekDayLimit field
            //   or else to weekEndLimit

            const WEEKDAY = schedule.day;
            let IsWeekDay;
            if (weekDay.includes(WEEKDAY)) {                                     // if today is presnt in weekday array then,
                await Schedule.findOneAndUpdate({ day: today }, {                //  updating Schedule Collection 
                    isWeekDay: true
                })
                IsWeekDay = true;
            } else {
                await Schedule.findOneAndUpdate({ day: today }, {                //  updating Schedule Collection 
                    isWeekDay: false
                })
                IsWeekDay = false;
            }

            //   if worktime then, app is blocked
            //    else, app can be used in limited time

            //   weekDay ------->  weekDayLimit
            //   weekEnd ------->  weekEndLimit

            //  if the Limit is over app becomes blocked , but when app is closed usagetime is updated in mongodb 
            //  if 

            const time = moment().format('H:mm')
            const startingTime = schedule.beginWork;
            const endingTime = schedule.endWork
            const freeTimeStarts = schedule.restFrom;
            const freeTimeEnds = schedule.restTo;
            let IsWorkTime;
            if ((startingTime <= time && time <= freeTimeStarts) || (freeTimeEnds<=time && time <= endingTime)) {
                await Schedule.findOneAndUpdate({ day: today }, { isWorkTime: true })
                IsWorkTime = true
            } else {
                await Schedule.findOneAndUpdate({ day: today }, { isWorkTime: false })
                IsWorkTime = false
            }

            let appArray = await Application.find({ user: req.user.id })
            if (IsWeekDay) {
                if (IsWorkTime) {
                    for (let i = 0; i < appArray.length; i++) {
                        await Application.findOneAndUpdate({ _id: appArray[i]._id }, {
                            isBlocked: true , isLimited:false
                        })
                        res.json({ msg: `${appArray[i].appName} is blocked` })
                    }

                } else {
                    for (let i = 0; i < appArray.length; i++) {
                        await Application.findOneAndUpdate({ _id: appArray[i]._id }, {
                            isBlocked: false, isLimited: true
                        })
                        res.json({ msg: `${appArray[i].appName} is unblocked but limited` })
                        
                    }

                    ////////////////////////////////  PSEUDO CODE FOR BROWSER USAGE  //////////////////////////


                    //  forEach app in Application{
                    //     if(app.appUrl is opened){
                    //         let openTime =  time ( when application is opened in browser )
                    //         let dayLimit = app.weekDayLimt
                    //         let UsageTime = currentTime - openTime;
                    //         await Application.findOneAndUpdate({_id:app._id},{usageTime : UsageTime})
                    //         
                    //         if(app.appUrl is closed && app.usageTime < dayLimit){
                    //              await Application.findOneAndUpdate({_id:app._id},{
                    //                  usageTime : UsageTime
                    //              })
                    //         }
                    //         if((dayLimit - UsageTime)<=0 ){
                    //             await Application.findOneAndUpdate({_id:app._id},{
                    //                 isBlocked : true , isLimited : false 
                    //             })
                    //         }
                    //         if( currenTime == 00:00 ){
                    //             await Application.findOneAndUpdate({_id:app._id},{
                    //               usageTime : 00:00
                    //             })
                    //         }
                    //
                    //      }
                    //      
                    //   }  


                }
            } else {

                //  forEach app in Application{
                //     if(app.appUrl is opened){
                //         let openTime =  time ( when application is opened in browser )
                //         let dayLimit = app.weekEndLimt
                //         let UsageTime = currentTime - openTime;
                //         await Application.findOneAndUpdate({_id:app._id},{usageTime : UsageTime})
                //         
                //         if(app.appUrl is closed && app.usageTime < dayLimit){
                //              await Application.findOneAndUpdate({_id:app._id},{
                //                  usageTime : UsageTime
                //              })
                //         }
                //         if((dayLimit - UsageTime)<=0 ){
                //             await Application.findOneAndUpdate({_id:app._id},{
                //                 isBlocked : true , isLimited : false 
                //             })
                //         }
                //         if( currenTime == 00:00 ){
                //             await Application.findOneAndUpdate({_id:app._id},{
                //               usageTime : 00:00
                //             })
                //         }
                //
                //      }
                //      
                //   }  


            }



        } else {
            res.json(`No restrictions mentioned on ${today}`)
        }

    }

}



module.exports = logicCtrl;