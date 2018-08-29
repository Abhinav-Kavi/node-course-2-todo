const mongoose = require('mongoose');

//telling mongoose which promise library to use. Here we are using built-in JS promise
mongoose.Promise = global.Promise; 

mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser:true});

module.exports = {mongoose};