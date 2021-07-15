const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cors());
app.use(cookieParser());

mongoose.connect(process.env.MONGOURL,{
    useNewUrlParser:true,
    useFindAndModify:false,
    useCreateIndex:true,
    useUnifiedTopology:true,
},()=>{
    console.log("COnnected to MongoDB")
})

app.get('/',(req,res)=>{
    res.send('Hello World')
})
require('./routes/appRoutes')(app);
require('./routes/userRoutes')(app);
require('./routes/scheduleRoutes')(app);
require('./routes/appRoutes')(app);
require('./routes/logicRoutes')(app);

app.listen(process.env.PORT || 8000,()=>{
    console.log('Listening to port 3000 ...')
})