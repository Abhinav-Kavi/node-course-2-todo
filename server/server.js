var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} =  require('./models/todo');
var {User} =  require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post("/todos",(req,res)=>{
 let todo = new Todo(req.body);
 todo.save().then(data => res.send(data), err =>res.status(400).send(err));
});

app.listen(3000, ()=>console.log("listening on port 3000 ..."));