require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {Todo} =  require('./models/todo');
const {User} =  require('./models/user');
const {authenticate} = require('./middleware/authenticate');

let app = express();
let port = process.env.PORT;


app.use(bodyParser.json());

app.post("/todos",(req,res)=>{
 let todo = new Todo(req.body);
 todo.save()
  .then(data => res.send(data))
  .catch(err => res.status(400).send(err));
});

app.get("/todos",(req,res)=>{
  Todo.find()
   .then(todos => res.send({todos}))
   .catch(e => res.status(400).send(e));
});

app.get("/todos/:id",(req,res)=>{
  let id = req.params.id;

  if(!ObjectID.isValid(id))
   return res.status(404).send({'message':"Invalid todo Id"});
 
  Todo.findById(id)
   .then(todo => {
     if(!todo)
      return res.status(404).send({'message':"No todo exists with the given id"});
      
     res.send({todo});
   })
   .catch(err => res.status(400).send());
});

app.delete("/todos/:id",(req,res)=>{
  let id = req.params.id;

  if(!ObjectID.isValid(id))
   return res.status(404).send({'message':"Invalid todo Id"});

  Todo.findByIdAndRemove(id)
   .then(removedTodo =>{
     if(!removedTodo)
      return res.status(404).send({'message':"No todo exists with the given id"});
     
     res.send({todo: removedTodo});
   })
   .catch(err => res.status(400).send());
});

app.patch('/todos/:id',(req,res)=>{
  let id = req.params.id;
  let body = _.pick(req.body,['text','completed']);

  if(!ObjectID.isValid(id))
   return res.status(404).send({'message':"Invalid todo Id"});

  if(_.isBoolean(body.completed) && body.completed)
    body.completedAt = new Date().getTime();
  else{
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id,{$set:body},{new: true})
   .then(todo => {
     if(!todo)
       return res.status(404).send({'message':"No todo exists with the given id"});
     
     res.send({todo});
   })
   .catch(err => res.status(400).send());
})

app.post('/users',(req,res)=>{
  let data = _.pick(req.body,['email','password']);
  let user = new User(data);

  user.save()
   .then(()=> user.generateAuthToken())
   .then(token=> res.header('x-auth',token).send(user))
   .catch(e=>res.status(400).send(e));
});

app.get('/users/me',authenticate,(req,res)=>{
  res.send(req.user);
});


app.listen(port, ()=>console.log(`Started on port ${port} ...`));

module.exports = {app};