var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MealPackageSchema = new Schema({

    "title": {
      "type": String,
      "unique": true
    },
    "price": Number,
    "category": String,
    "numberOfMeals": Number,
    "mealContent": String,
    "isTopPackage": Boolean,
    "imageURL": String 
  });
  
const MealPackages = mongoose.model("MealPackages", MealPackageSchema);
module.exports =  MealPackages;

module.exports.getAllMealPackages = function(){
  return new Promise(function(resolve,reject){

    MealPackages.find()
      .exec()
      .then((meals) => {
         mealList = meals.map(value => value.toObject());
          resolve(mealList);
      })
      .catch((err)=>{
          reject(err);
      });
  })
}, 

module.exports.updateMealPackageByTitle = function (companyId, companyData) {
  return new Promise(function (resolve, reject) {
      if (Object.keys(companyData).length > 0) { // if there is data to update
          Company.update({ _id: companyId }, // replace the current company with data from companyData
              {
                  $set: companyData
              },
              { multi: false })
              .exec()
              .then((data) => {
                  resolve(companyId);
              })
              .catch((err) => {
                  reject(err);
              });
      } else {
          resolve();
      }
  });
},

module.exports.addMealPackage = function (mealPackage) {
  return new Promise(function (resolve, reject) {
      
    mealPackage.save((err, addedMeal) => {
          if(err) {
              reject(err);
              
          } else {
              resolve(addedMeal);
          }
      });
  });
} 

