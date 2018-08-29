//config settings  

//heroku will set NODE_ENV to production and we have set it to test for testing suite
let env = process.env.NODE_ENV || "development";

if(env=="development"){
  process.env.PORT  =  3000;
  process.env.MONGODB_URI ='mongodb://localhost:27017/TodoApp';
}
else if(env === "test"){
  process.env.PORT  =  3000;
  process.env.MONGODB_URI ='mongodb://localhost:27017/TodoAppTest';
}

