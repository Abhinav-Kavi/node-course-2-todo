var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} =  require('./models/todo');
var {User} =  require('./models/user');

var app = express();
var port = process.env.PORT || 3000;

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

app.listen(port, ()=>console.log(`Started on port ${port} ...`));


module.exports = {app};