const mongoose = require("mongoose");
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


//User model
let userSchema = new mongoose.Schema({
  email : {
    type : String,
    trim: true,
    minlength : 1,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password :{
    type : String,
    minlength: 6,
    required: true
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

//overriding the toJSON method which determines what is returned when json of model is sent
userSchema.methods.toJSON = function(){
  let user = this;
  userObj = user.toObject(); //convert to regular obj
  return _.pick(userObj,['email','_id']);
};

userSchema.methods.generateAuthToken = function(){
  let user = this;
  let access = "auth";
  let token = jwt.sign({_id: user._id.toHexString(), access},"secret_key");
  user.tokens.push({access,token});
 
  return user.save()
             .then(()=>token)
             .catch(e=> console.log(e));
};

userSchema.statics.findByToken = function(token){
  let User = this;
  let decodedToken;

  try{
    decodedToken = jwt.verify(token,"secret_key");
  }
  catch(e){
   return Promise.reject();
  }

  return User.findOne({
        '_id' : decodedToken._id,
        'tokens.token' : token,
        'tokens.access': decodedToken.access
        });
};

//Mongoose middleware --- used to execute some code on a model before a particular action like save/update etc is executed

userSchema.pre("save", function(next){
  let user = this;

 //we need to compute hash only if the password has been changed otherwise this method will keep hashing the already hashed password if save is called for updating any property other than password
 
  if(user.isModified('password')) {
    bcrypt.genSalt(10)
     .then(salt=> bcrypt.hash(user.password,salt))
     .then(hash =>{
       user.password = hash;
       next();
     })
     .catch(e => console.log(e));
  }
  else 
   next();
});

let User = mongoose.model("User",userSchema);

module.exports = {User};