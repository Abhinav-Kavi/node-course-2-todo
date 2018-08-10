const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp',{ useNewUrlParser: true },(err,client)=>{
  if(err)
    return console.log('Unable to connect to MongoDB Server');

  console.log('Connected to MongoDB Server');

  const db = client.db('TodoApp');

  // db.collection('Todos').insertOne({
  //   text: "Do something 2",
  //   completed: false
  // },(err,result)=>{
  //   if(err)
  //    return console.log('Unable to insert todo',err);
    
  //   console.log(JSON.stringify(result.ops,undefined,2));

  // });

  db.collection('Users').insertOne({
    name:'Abhinav',
    age: 24,
    location: 'Hyderabad'
  },(err,result)=>{
    if(err)
     return console.log('Unable to insert users',err);

    console.log(JSON.stringify(result.ops,undefined,2));
  });

  client.close();
  
});