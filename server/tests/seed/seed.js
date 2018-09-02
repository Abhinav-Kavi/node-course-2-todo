const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const testUser1_id = new ObjectID();
const testUser2_id = new ObjectID();

const testUsers = [{
  _id: testUser1_id,
  email : 'testUser1@gmail.com',
  password: 'testUser1_password',
  tokens : [{
    access: 'auth',
    token : jwt.sign({_id: testUser1_id, access:'auth' }, "secret_key")
  }]
 },
 {
  _id: testUser2_id,
  email : 'testUser2@gmail.com',
  password: 'testUser2_password',
}];

const testTodos = [{
  _id : new ObjectID(),
	text: "test task 1"
},
{
  _id : new ObjectID(),
  text: "test task 2",
  completed : true,
  completedAt : 123
}];

let populateTodos = (done)=>{
  Todo.remove({})
  .then(()=> Todo.insertMany(testTodos))
  .then(()=> done())
  .catch(e => console.log(e));
};

let populateUsers = (done)=>{
  //when we use insertMany the middleware is not called therefore we will save the users individually

  User.remove({})
   .then(()=>{
    let saveUser1 = new User(testUsers[0]).save();
    let saveUser2 = new User(testUsers[1]).save();
  
    return Promise.all([saveUser1,saveUser2]);
   })
   .then(()=> done())
   .catch(e=> console.log(e));
};

module.exports = {testTodos, populateTodos, populateUsers, testUsers};