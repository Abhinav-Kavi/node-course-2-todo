const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp",{useNewUrlParser:true},(err,client)=>{
  if(err)
    return console.log("Unable to connect to the database :", err);

  let db = client.db("TodoApp");

  // db.collection("Todos").findOneAndUpdate({
  //   _id: new ObjectID("5b6c126c171bf904609fecc9")
  // },{
  //   $set :{
  //     completed: true
  //   }
  // },{
  //   returnOriginal : false  //so that this function returns the updated object
  // })
  // .then(result => console.log(result))
  // .catch(err=>console.log("Unable to update : ",err));


  //Note : Update will insert the fields if not present

  db.collection("Users").findOneAndUpdate({
    _id: new ObjectID("5b6c1fdef8dbb51078438212")
  },{
    $set : {name: "Tarun"},
    $inc : {age : 1}
  },{
    returnOriginal : false
  })
  .then(result => console.log(result))
  .catch(err=>console.log("Unable to update : ",err));

  client.close();

 });