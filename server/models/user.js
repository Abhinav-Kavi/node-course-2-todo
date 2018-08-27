var mongoose = require("mongoose");


//User model
let User = mongoose.model("User",{
  email : {
    type : String,
    trim: true,
    minlength : 1,
    required: true
  }
});

module.exports = {User};