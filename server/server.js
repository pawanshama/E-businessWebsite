const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const port = process.env.port || 5000;

app.use(express.json());
app.use(cookieParser());

app.listen(port,()=>{
    console.log('server is running');
})

//Routes
app.use('/user',require('./routes/useRouter'));
app.use('/api',require('./routes/categoryRouter'));
const URI = process.env.MongoDb_URL;

mongoose.connect(URI).then(()=>{
    console.log('mongodb Connected')
})
.catch((error)=>console.log(error));