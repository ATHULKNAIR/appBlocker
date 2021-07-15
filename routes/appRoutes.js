const appCtrl = require('../controllers/appCtrl');
const auth = require('../middleware/requireLogin')


module.exports = function(app){

    app.get('/application',auth,appCtrl.getApplication);
    app.post('/application',auth,appCtrl.addApplication)
    app.put('/application/:id',auth,appCtrl.editApplication);
    app.delete('/application/:id',auth,appCtrl.deleteApplication);
 

}



