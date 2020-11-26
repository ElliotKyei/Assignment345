var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    "firstName":  String,
    "lastName": String,
    "email":{
      "type": String,
      "unique": true
    },
    "password": String,
    "role": {
      "type": String,
      "default": 0
    }   
  });
  
const User = mongoose.model("Users", UserSchema);
module.exports =  User;

module.exports.getAllUsers = function(){
  return new Promise(function(resolve,reject){

      User.find()
      .exec()
      .then((users) => {
         userList = users.map(value => value.toObject());
         console.log("Users", userList);
          resolve(userList);
      })
      .catch((err)=>{
          reject(err);
      });
  })
}, 

module.exports.getUserByEmail = function(userEmail){
  return new Promise(function(resolve,reject){

    User.find({email: "flamingskull12@gmail.com"})
    .limit(1)
    .exec()
    .then((user) => {
      console.log("USER FOUND "+user.toObject());
      resolve(user.toObject());
    })
    .catch((err)=>{
        reject(err);
    });
})
},

module.exports.addUser = function (User) {
  return new Promise(function (resolve, reject) {
      
    User.save((err, addedUser) => {
          if(err) {
              reject(err);
          } else {
              resolve(addedUser);
          }
      });
  });
}      