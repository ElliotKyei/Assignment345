var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

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

module.exports.getMealPackageById = function(mealPackageId){
  return new Promise(function(resolve,reject){

      MealPackages.findOne({_id: mealPackageId})
      .exec()
      .then((mealPackage) => {
          resolve(mealPackage.toObject());
      })
      .catch((err)=>{
          reject(err);
      });
  })
},

module.exports.updateMeal = function (data, file) {
    MealPackages.updateOne(
      {title: data.mpName},
      { $set: { 
        price: data.mpPrice,
        mealContent: data.mpDetail,
        category: data.mpCategory,
        numberOfMeals: data.mpNumMeals,
        isTopPackage: data.mpTopPackage ? true : false,
        imageURL: file
       } 
    }
    ).exec();
},

module.exports.addMealPackage = function (data, file) {
  return new Promise(function (resolve, reject) {
      
    let newMealPackage = new MealPackages({
      title: data.mpName,
      price: data.mpPrice,
      mealContent: data.mpDetail,
      category: data.mpCategory,
      numberOfMeals: data.mpNumMeals,
      isTopPackage: data.mpTopPackage ? true : false,
      imageURL: file
    });

    newMealPackage.save((err, addedMeal) => {
          if(err) {
              reject(err);
              
          } else {
              resolve(addedMeal);
          }
      });
  });
} 

