const scheduleCtrl = require('../controllers/scheduleCtrl');
const auth = require('../middleware/requireLogin');

module.exports = function(app){
    app.post('/schedule',auth,scheduleCtrl.addSchedule);
    app.get('/schedule',auth,scheduleCtrl.getSchedule);
    app.put('/schedule/:id',auth,scheduleCtrl.editSchedule);
    app.delete('/schedule/:id',auth,scheduleCtrl.deleteSchedule);
}