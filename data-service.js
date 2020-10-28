//Top Meal Packages

var topMealPackages = [
{
    title: "Chicken Breast with Tomatoes", 
    price: 10.99,
    imgURL: "/static/Meal1.jpg",
    isTopPackage: true
},
{
    title: "Pea and Spinach Carbonara", 
    price: 10.99,
    imgURL: "/static/Meal2.jpg",
    isTopPackage: true
},
{
    title: "Potato Salad with Mackeral", 
    price: 11.99,
    imgURL: "/static/Meal3.jpg",
    isTopPackage: true
},
{
    title: "Beef and Vegetable Stir Fry", 
    price: 12.99,
    imgURL: "/static/Meal4.jpg",
    isTopPackage: true
}];

// Meal Package Listings

var mealPackages =  [
{
title: "Muscle Gain", 
price: 25.99,
category: "meats, fish, eggs and poultry",
numberOfMeals: 4,
mealContent: "4 meals of lean cuts of meats, fish, eggs and poultry, which are very high in protein and calories, low in carbs",
imgURL: "/static/MealPackage1.jpg"
},
{
title: "Weight Loss", 
price: 27.99,
category: "lean and nutritious cuts of meat, whole wheat grains, fruits and vegetables",
numberOfMeals: 7,
mealContent: "7 small meals of very lean and nutritious cuts of meat, whole wheat grains, fruits and vegetables. Each meal is high in protein and low in carbs & calories",
imgURL: "/static/MealPackage2.jpg"
},
{
title: "Keto", 
price: 25.99,
category: "nuts, lean meats and fish, fruits and vegetables",
numberOfMeals: 4,
mealContent: "4 meals featuring nuts, lean meats and fish, fruits and vegetables. Each meal is high in healthy fats with adequate protein, and minimal in carbs & calories",
imgURL: "/static/MealPackage3.jpg"
},
{
title: "Paleo", 
price: 25.99,
category: "lean meats and fish, whole wheat grains, fruits and vegetables",
numberOfMeals: 4,
mealContent: "4 meals of lean meats and fish, whole wheat grains, fruits and vegetables. Each meal is moderate in protein, carbs, and healthy fats. 100% All Natural Produce",
imgURL: "/static/MealPackage4.jpg"
}];

module.exports.getMealPackages = function(){
    return mealPackages;
}

module.exports.getTopMealPackages = function () {
    return topMealPackages;
}

var users = [{
    firstname: "Elliot", lastname: "Kyei", email: "elliotkyei@gmail.com", password: "abc123", password2: "abc123"
}];

module.exports.getAllUsers = function(){
    return users;
}

module.exports.registerUser = function(user){
    users.push(user);
    console.log("users:", users)
}


module.exports.validateUserForm = function(formData){
    var errors = {isValid: true, firstname: "", lastname: "", email: "", password: "", password2: ""};

    validateUserFormFirstName(formData.firstname, errors);
    validateUserFormLastName(formData.lastname, errors);
    validateUserFormEmail(formData.email, errors);
    validateUserFormPassword(formData.password, formData.password2, errors);
    // console.log("errors in validateUserForm()", errors)
    ;
    return errors;
}


module.exports.validateLoginForm = function(formData){
    var loginErrors = {isValid: true, loginEmail: "", loginPass: ""};

    validateLoginDetails(formData.loginEmail, formData.loginPass, loginErrors);
    // console.log("errors in validateUserForm()", errors)
    ;
    return loginErrors;
}

function validateUserFormFirstName(input, errors){
    if(!input.trim()){
        errors.isValid = false;
        errors.firstname += "First name is required "
        return;
    }

}

function validateUserFormLastName(input, errors){
    if(!input.trim()){
        errors.isValid = false;
        errors.lastname += "Last name is required "
        return;
    }

}

function validateUserFormEmail(input, errors){

    const emailReg = /^[^@]+@[^@]+\.[^@]+$/;

    if(!input.trim()){
        errors.isValid = false;
        errors.email += "Email field is required "
        return;
    }

    if(!input.match(emailReg)){
        errors.isValid = false;
        errors.email += "Please enter a valid email "
        return;
    }
}

function validateUserFormPassword(input, input2, errors){
    const passReg = /^[A-Za-z0-9]+$/;

    if(!input.trim()){
        errors.isValid = false;
        errors.password += "Password field is required "
        return;
    }

    if(input.length<4){ 
        errors.isValid = false;
        errors.password += "Password must contain at least 4 characters "
        return;
    }

    if(!input.match(passReg)){
        errors.isValid = false;
        errors.password += "Password can only contain letters and numbers "
        return;
    }

    if(!(input===input2)){
        errors.isValid = false;
        errors.password2 += "The passwords do not match "
        return;
    }
}

function validateLoginDetails(input, input2, loginErrors){

    if(!input.trim()){
        loginErrors.isValid = false;
        loginErrors.loginEmail += "Email field is required "
        return;
    }

    if(!input2.trim()){
        loginErrors.isValid = false;
        loginErrors.loginPass += "Password field is required "
        return;
    }
/*     if (users === undefined || users.length == 0) {
       return;
    }
    else{
        users.forEach(function(element) {
            if (input===element.email || input2===element.password){
               // console.log("Undefined list not caught")
                errors.isValid = false;
                errors.loginPass += "The Email or Password was not correct, try again "
                return;
            }
    });
} */
}