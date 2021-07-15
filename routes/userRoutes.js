const userCtrl = require('../controllers/userCtrl');
const auth = require('../middleware/requireLogin')

module.exports = (app)=>{
    app.post('/register',userCtrl.register);
    app.post('/login',userCtrl.login);
    app.get('/dashboard',auth,userCtrl.getDetails);
}