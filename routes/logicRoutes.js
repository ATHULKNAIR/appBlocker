const logicCtrl = require('../controllers/logicCtrl');
const auth = require('../middleware/requireLogin')

module.exports = (app) =>{
    app.get('/blocked',auth,logicCtrl.isBlocked)
}