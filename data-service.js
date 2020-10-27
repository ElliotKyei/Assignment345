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

    const reg = /^[^@]+@[^@]+\.[^@]+$/;

    if(!input.trim()){
        errors.isValid = false;
        errors.email += "Email field is required "
        return;
    }

    if(!input.match(reg)){
        errors.isValid = false;
        errors.email += "Please enter a valid email "
        return;
    }
}

function validateUserFormPassword(input, input2, errors){
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

    if(!input2.trim()){
        errors.isValid = false;
        errors.password2 += "Confirm Password field is required "
        return;
    }

    if(!(input===input2)){
        errors.isValid = false;
        errors.password2 += "The passwords do not match "
        return;
    }
}

module.exports.validateLoginForm = function(data){
    return true;
}

