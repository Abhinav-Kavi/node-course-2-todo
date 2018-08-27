const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


let id = '5b8406d77c3e1d1630ce6f7b';

// Todo.find({_id : id })
//  .then(todos => console.log("todos :\n",todos));

// Todo.findOne({_id : id})
//  .then(todo => console.log("todo :\n",todo));

if(ObjectID.isValid(id)){
  Todo.findById(id)
  .then(todo =>{
    if(!todo)
     return console.log(`No todo found for id = ${id}`);
     
    console.log("todo :\n",todo);   
  })
  .catch(err => console.log(err));
}

else
 console.log(`${id} is an invalid id`);
 

 let userId = '5b839cdc503cd223d8c00a60';

User.findById(userId)
 .then(user =>{
  if(!user)
   return console.log(`No user found for id =  ${userId}`);
   
  console.log("user :\n",user);   
 })
 .catch(err => console.log(err));

