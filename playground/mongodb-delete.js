const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp",{useNewUrlParser:true},(err,client)=>{
  if(err)
    return console.log("Unable to connect to the database :", err);

  let db = client.db("TodoApp");

  //deleteMany -- delete all meeting a specified criteria
  // db.collection("Todos").deleteMany({text:"eat lunch"}).then(response =>{
  //   console.log(response.result);
  // }, (err)=> console.log("Unable to delete", err));
  

  //delete -- delete first record meeting the criteria
  // db.collection("Todos").deleteOne({text:"eat lunch"}).then(response =>{
  //     console.log(response.result);
  //   }, (err)=> console.log("Unable to delete", err));

  //findOneAndDelete -- delete first record meeting the criteria and return the deleted object
  // db.collection("Todos").findOneAndDelete({text:"eat lunch"}).then(response =>{
  //       console.log(response);
  //     }, (err)=> console.log("Unable to delete", err));


  db.collection("Users").deleteMany({name:'Abhinav'})
    .then(response => console.log(response.result))
    .catch(err => console.log("Unable to delete : ", err));

  db.collection("Users").findOneAndDelete({_id : new ObjectID("5b6c1fe6555a8c07188764a2")})
  .then(response => console.log(response))
  .catch(err => console.log("Unable to delete : ", err));

  client.close();

 });