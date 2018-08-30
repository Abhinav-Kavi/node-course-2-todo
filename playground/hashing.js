const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

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




 /*
For subsequent req : at backend we will calculate the hash of the data sent back and compare it with hash value sent back. This helps us ensure the authenticity of the data

Case 1: hakcer changes the data only 
        - at the backend we will know that data has been changed since the hashes won't match

Case 2:  hacker changes data and hash (using same algo/lib)
        - this will trick a naive system since hashes will match
        - To overcome this we use fixed/random salt (randomly generated salts are even better) and add it to data before hashing
        - Thus the hecker cannot generate a hash that will match our hash since he does not know the salt
*/


let secret = "my secret";

token.data.id =123;

 token = {
  data,
  hash : SHA256(JSON.stringify(data)+secret).toString()
}

console.log("sent data");
console.table(token);

token.data.id ="111";
token.hash =  SHA256(JSON.stringify(data)).toString();

console.log("received data");
console.table(token);

if(SHA256(JSON.stringify(data)+secret).toString()=== token.hash)
  console.log('Data is intact');
else
  console.log('Data has been modified. Expected hash =',SHA256(JSON.stringify(data)+secret).toString());


//Section 2


console.log("*****JWT*******");
 data =  {id : 122};

var jwtToken = {
  data,
  token : jwt.sign(data,'secret')
}

console.log("sent data : ", JSON.stringify(jwtToken,null,2));

console.log("recieved data ", JSON.stringify(jwtToken,null,2));

//jwt.verify is used to decode the encoded data back and it throws error if Encoded-data or secret is not correct
var decodedData;
try{
  decodedData = jwt.verify(jwtToken.token,'secret');
}
catch(e){
  console.log("error = ", e);
}

if(decodedData)
  console.log("verify : ", decodedData );
