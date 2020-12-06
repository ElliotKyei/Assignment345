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


/*
*************************************************
Validate Data Entry Form
*************************************************
*/


module.exports.validateDataEntryForm = function(formData){
    var errors = {isValid: true, name: "", price: "", details: "", category: "", numMeals: "", photo: ""};
    
    validateDataEntryFormName(formData.mpName, errors);
    validateDataEntryFormPrice(formData.mpPrice, errors);
    validateDataEntryFormDetails(formData.mpDetail, errors);
    validateDataEntryFormCategory(formData.mpCategory, errors);
    validateDataEntryFormNumMeal(formData.mpNumMeals, errors);
    validateDataEntryFormPhoto(formData.mpPhoto, errors);
    // console.log("errors in validateUserForm()", errors)
    return errors;
}

function validateDataEntryFormName(input, errors){
    if(!input.trim()){
        errors.isValid = false;
        errors.name += "Meal Package Name is required"
        return;
    }
    
    if(input.length<4){ 
        errors.isValid = false;
        errors.name += "Meal Package Name must contain at least 4 characters"
        return;
    }
    
}

function validateDataEntryFormPrice(input, errors){
    if(!input.trim()){
        errors.isValid = false;
        errors.price += "Meal Package Price is required"
        return;
    }
    
    if(input < 0){ 
        errors.isValid = false;
        errors.price += "Please enter a valid price"
        return;
    }
    
}

function validateDataEntryFormDetails(input, errors){
    if(!input.trim()){
        errors.isValid = false;
        errors.details += "Meal Package Details are required"
        return;
    }
}

function validateDataEntryFormCategory(input, errors){
    if(!input.trim()){
        errors.isValid = false;
        errors.category += "Meal Package Category is required"
        return;
    }
    
    if(input.length<4){ 
        errors.isValid = false;
        errors.category += "Meal Package Category must contain at least 4 characters"
        return;
    }
}

function validateDataEntryFormNumMeal(input, errors){
    if(!input.trim()){
        errors.isValid = false;
        errors.numMeals += "Number of meals are required"
        return;
    }
    if(input < 0){
        errors.isValid = false;
        errors.numMeals += "Number of meals must be at least 1"
        return;
    }
    
}

function  validateDataEntryFormPhoto(input, errors){
    errors.photo += "Please Upload A Photo Of The Meal Package"
    
}

module.exports.emailOrder = function(user){

    var order = 'Order Information: ';

    user.cart.items.forEach(function(item){
        order += 
        '\n\nMeal Package: ' +item.title
        +'\nQuantity: ' +item.quantity
        +'\nPrice: ' +item.price
        +'\nTotal: ' +item.total
      })

      order += '\n\nTotal Cost: ' +user.cart.total

  return order;
}