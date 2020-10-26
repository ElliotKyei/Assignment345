//Top Meal Packages

let TopMealPackage = [
{
    name: "Chicken Breast with Tomatoes", 
    price: 10.99
},
{
    name: "Pea and Spinach Carbonara", 
    price: 10.99
},
{
    name: "Potato Salad with Mackeral", 
    price: 11.99
},
{
    name: "Beef and Vegetable Stir Fry", 
    price: 12.99
}];

// Meal Package Listings

let MealPackageListing =  [
{
name: "Muscle Gain", 
description: "4 meals of lean cuts of meats, fish, eggs and poultry, which are very high in protein and calories, low in carbs",
price: 25.99
},
{
name: "Weight Loss", 
description: "7 small meals of very lean and nutritious cuts of meat, whole wheat grains, fruits and vegetables. Each meal is high in protein and low in carbs & calories",
price: 27.99
},
{
name: "Keto", 
description: "4 meals featuring nuts, lean meats and fish, fruits and vegetables. Each meal is high in healthy fats with adequate protein, and minimal in carbs & calories",
price: 25.99
},
{
name: "Paleo", 
description: "4 meals of lean meats and fish, whole wheat grains, fruits and vegetables. Each meal is moderate in protein, carbs, and healthy fats. 100% All Natural Produce",
price: 25.99
}];

module.exports.getMealPackages = function(){
    return mealPackages;
}

module.exports.getTopMealPackages = function () {
    var topMealPackages = [];
    //...
    return topMealPackages;
}

var users = [
    {name: "John Smith", username: "js@seneca.ca", password: "P@$$w0rd", role: "admin"}
];

module.exports.getAllUsers = function(){
    return users;
}

module.exports.register = function(user){
    users.push(user);
    console.log("users:", users)
}

module.exports.login = function(user){
    if(true) { 
        return true;
    } else {
        return false
    }
}


module.exports.validatFirstName = function(fname){
    if (!fname) { return false; }
    else { return ture; }
}

module.exports.validatLastName = function(n){
    return ture;
}