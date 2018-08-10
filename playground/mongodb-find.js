const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',{useNewUrlParser: true},(err,client)=>{
  if(err)
    return console.log("Unable to connect to TodoApp",err);

  const db = client.db('TodoApp');
  
  
  db.collection('Todos').find().toArray().then(docs=>{
    console.log("----------show all-------------");
     console.log(JSON.stringify(docs,undefined,2));
  }, err =>console.log("Error while fetching collection documents",err));

  
  
  db.collection('Todos').find({completed:false}).toArray().then(docs=>{
    console.log("----------show pending------------");
    console.log(JSON.stringify(docs,undefined,2));
  }, err =>console.log("Error while fetching collection documents",err));


   
  db.collection('Todos').find().count().then(count=>{
    console.log("----------show all count------------");
    console.log(count);
  }, err =>console.log("Error while fetching collection documents",err));

  db.collection('Users').find({name:'Abhinav'}).toArray().then(users=>{
    console.log("----------show all users with name Abhinav------------");
    console.log(JSON.stringify(users,undefined,2));
  }, err =>console.log("Error while fetching collection documents",err));

  client.close();
})