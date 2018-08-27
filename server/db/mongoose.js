const mongoose = require('mongoose');

//telling mongoose which promise library to use. Here we are using built-in JS promise
mongoose.Promise = global.Promise; 

mongoose.connect('mongodb://localhost:27017/TodoApp',{useNewUrlParser:true});

module.exports = {mongoose};