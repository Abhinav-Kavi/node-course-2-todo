const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


let id = '5b8530ab94ba483c2ce98f7b';
let id2 = '5b853123ce90694884a36c60';


// Todo.remove({})
//  .then(res => console.log(res))
//  .catch(err => console.log(err));

Todo.findOneAndRemove({_id: id})
.then(res => console.log(res))
.catch(err => console.log(err));


Todo.findByIdAndRemove(id2)
.then(res => console.log(res))
.catch(err => console.log(err));