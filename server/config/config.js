//config settings  

//heroku will set NODE_ENV to production and we have set it to test for testing suite
let env = process.env.NODE_ENV || "development";

if(env === "development" || env === "test"){
  let config = require('./config.json');
  let envConfig = config[env];
  Object.keys(envConfig).forEach(key => process.env[key] = envConfig[key]);
}
