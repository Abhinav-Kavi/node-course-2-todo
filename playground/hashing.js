const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


/*
var message = "My name is abhi";
var encrypted_message = SHA256(message);

console.log(message,"\n",encrypted_message.toString());

let data = {
  id: 123
}

let token = {
  data,
  hash : SHA256(JSON.stringify(data)).toString()
}

console.log("sent data");
console.table(token);

token.data.id ="111";

console.log("received data");
console.table(token);

if(SHA256(JSON.stringify(data)).toString()=== token.hash)
  console.log('Data is intact');
else
  console.log('Data has been modified. Expected hash =',SHA256(JSON.stringify(data)).toString());
*/



 /*
For subsequent req : at backend we will calculate the hash of the data sent back and compare it with hash value sent back. This helps us ensure the authenticity of the data

Also password are always hashed(using salt) and stored in databases

Case 1: hakcer changes the data only 
        - at the backend we will know that data has been changed since the hashes won't match

Case 2:  hacker changes data and hash (using same algo/lib)
        - this will trick a naive system since hashes will match
        - To overcome this we use fixed/random salt (randomly generated salts are even better) and add it to data before hashing
        - Thus the hecker cannot generate a hash that will match our hash since he does not know the salt

Case 3: hacker can hack the db and use pre compiled table (rainbow tables) to compute the password from hashed password stored in db
        - salting makes this difficult since the salts are usually (and should be) randomly generated
*/

/*

let secretSalt = "my secret";

token.data.id =123;

 token = {
  data,
  hash : SHA256(JSON.stringify(data)+secretSalt).toString()
}

console.log("sent data");
console.table(token);

token.data.id ="111";
token.hash =  SHA256(JSON.stringify(data)).toString();

console.log("received data");
console.table(token);

if(SHA256(JSON.stringify(data)+secretSalt).toString()=== token.hash)
  console.log('Data is intact');
else
  console.log('Data has been modified. Expected hash =',SHA256(JSON.stringify(data)+secretSalt).toString());
*/

//Section --------------------bcrypt -- it has built in hashing with salt (random) and comparing capability

let password = "1@Abhi";

bcrypt.genSalt(10)
 .then(salt=>{
   return bcrypt.hash(password,salt);
 })
 .then(hash =>console.log(password, " = ", hash))
 .catch(e => console.log("Error : ", e));

let receivedPassword = "1@Abhi3";
let hashedPassword = "$2a$10$9jMuSoTfNU3klmzzpvpaQerwg7x4bnPXQv8ULWXfczkZ/DOhQnvdW";


bcrypt.compare(receivedPassword,hashedPassword)
.then(result => console.log(`Is ${receivedPassword} correct ? \n`,result))
.catch(e => console.log("Error : ", e));





//Section 2 --------JWT is a token standard use to sign/verify documents/data using a secret key or a pair of
//public and private key

/*
console.log("*****JWT*******");
 data =  {id : 122};

var jwtToken = {
  data,
  token : jwt.sign(data,'secretKey')
}

console.log("sent data : ", JSON.stringify(jwtToken,null,2));

console.log("recieved data ", JSON.stringify(jwtToken,null,2));

//jwt.verify is used to decode the encoded data back and it throws error if Encoded-data or secret is not correct
var decodedData;
try{
  decodedData = jwt.verify(jwtToken.token,'secretKey');
}
catch(e){
  console.log("error = ", e);
}

if(decodedData)
  console.log("verify : ", decodedData );
*/