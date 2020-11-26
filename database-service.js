const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const UserSchema = require('./database_models/userModel.js');

module.exports = function(mongoDBConnectionString){

    let User;

    return {
        connect: function(){
            return new Promise(function(resolve,reject){
                let db = mongoose.createConnection(mongoDBConnectionString, 
                    { 
                        useNewUrlParser: true, 
                        useUnifiedTopology: true, 
                        useCreateIndex: true 
                    });
                
                db.on('error', (err)=>{
                    reject(err);
                });
        
                db.once('open', ()=>{
                    User = db.model("Users", UserSchema);
                    resolve();
                });
            });
        },

        getAllUsers: function(){
            return new Promise(function(resolve,reject){

                UserSchema.User.find()
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

        getUserByEmail: function(userEmail){
            return new Promise(function(resolve,reject){

                UserSchema.User.find({email: userEmail})
                .limit(1)
                .exec()
                .then((user) => {
                    userFound = user.map(value => value.toObject());
                    console.log(userFound);
                    resolve(userFound);
                })
                .catch((err)=>{
                    reject(err);
                });
            })
        },

        addUser: function (User) {
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
    }

}