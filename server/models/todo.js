var mongoose = require("mongoose");

//Create a todo model
let Todo = mongoose.model("Todo",{
  text:{
    type: String,
    required : true,
    minlength: 1,
    trim : true
  },
  completed :{
    type: Boolean,
    default: false
  },
  completedAt : {
    type : Number,
    default: null
  }
});

module.exports = {Todo};