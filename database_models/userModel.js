var mongoose = require("mongoose");
var bcrypt = require('bcryptjs');
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
  
var User = mongoose.model("Users", UserSchema);
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

module.exports.addUser = function (data) {
  return new Promise(function (resolve, reject) {
    let passwordHash = bcrypt.hashSync(data.password);

    let newUser = new User({
    firstName: data.firstname,
    lastName: data.lastname,
    email: data.email,
    password: passwordHash,
    role: 'customer'
  });

    newUser.save((err, addedUser) => {
          if(err) {
              reject(err);
          } else {
              resolve(addedUser);
          }
      });
  });
}      