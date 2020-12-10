/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Elliot Kyei 
  Student ID: 122982192 
  Date: 12/10/2020 
*
* Online (Heroku) Link: https://mysterious-crag-33945.herokuapp.com/
* GitHub or Bitbucket repo Link: https://github.com/ElliotKyei/Assignment345
*
********************************************************************************/

var path = require("path");
var express = require("express");
const multer = require("multer");
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config()
const dataService = require('./data-service');
const clientSessions = require("client-sessions");

const fs = require("fs");
const http = require("http");
const https = require("https");

var mongoose = require("mongoose");
var nodemailer = require('nodemailer');
var bcrypt = require('bcryptjs');
var app = express();

var HTTP_PORT = process.env.PORT || 8081;
const HTTPS_PORT = 4433;
const SSL_KEY_FILE = "./assets/" + "server.key";
const SSL_CRT_FILE = "./assets/" + "server.crt";

const https_options = {
  key: fs.readFileSync(__dirname + "/" + SSL_KEY_FILE),
  cert: fs.readFileSync(__dirname + "/" + SSL_CRT_FILE)
};

const UserModel = require("./database_models/userModel");
const MealPackageModel = require("./database_models/mealPackageModel");

const connectionString = process.env.MONGODB_CONN_STR;



app.use(bodyParser.urlencoded({ extended: true }));

app.use('/static', express.static('static'))
app.use('/public', express.static('public'))
app.use(express.static('./views'))
const exphbs = require("express-handlebars");

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

mongoose.connection.on("open", () => {
  console.log("Database connection open.");
});

app.engine('.hbs', exphbs({ 
  extname: '.hbs',
  defaultLayout: 'main',
}));

app.set("view engine", ".hbs");

app.use(clientSessions({
  cookieName: "session", 
  secret: process.env.SECRET, 
  duration: 5 * 60 * 1000, 
  activeDuration: 5 * 1000 * 60,
}));


function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

function onHttpsStart() {
  console.log("Express https server listening on: " + HTTPS_PORT);
}

const storage = multer.diskStorage({
  destination: "./public/photos/",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.get("/", function(req,res){
  let allMeals = MealPackageModel.getAllMealPackages();
  allMeals.then(function (result) {
  if (req.session.user){
    if(req.session.user.role === "customer"){
      res.render("userDashboard", {
        dataEntry: result,
        user: req.session.user,
        layout: 'customerLayout'
    });
  }

  else if (req.session.user.role === "data entry"){
    res.render('userDashboard', {
      dataEntry: result,
      user: req.session.user,
      layout: 'dataEntryLayout'
  });
  }
}

  else{
  res.render('home', {
    dataEntry: result
});
  }
}).catch(function (err) {
  console.log(err);
});
});

app.get("/mealpackage",  (req, res) => {

  let allMeals = MealPackageModel.getAllMealPackages();

  allMeals.then(function (result) {
  
  if (req.session.user){
  if (req.session.user.role === "data entry"){
    res.render('mealpackage', {
      dataEntry: result,
      user: req.session.user,
      layout: 'dataEntryLayout'
  });
  }
  else if (req.session.user.role === "customer"){
    res.render('mealpackage', {
      dataEntry: result,
      user: req.session.user,
      layout: 'customerLayout'
  });
  }
}

else{
  res.render('mealpackage', {
      dataEntry: result
  });
}

}).catch(function (err) {
  console.log(err);
});
});

app.get("/login",  (req, res) => {
  res.render('login', {
      data: { },

  });
});

app.get("/mealPackage/:id", ensureLogin, (req, res) => {
if (req.session.user.role == "customer"){
  req.session.user.selectedItem = req.params.id;
  MealPackageModel.getMealPackageById(req.params.id).then((mpData)=>{

    res.render('MealPackageDescription', {
      data: mpData,
      layout: 'customerLayout'
    }); 
  })
  .catch((err)=>{
      res.status(500).end();
  })
}
else{
  req.session.reset();
  res.redirect("/login");
}
});

  app.get("/signup",  (req, res) => {
    res.render('signup', {
        data: { }
    });
});

app.post("/signup-user",  (req, res) => {
  var formData = req.body;
  var errors = dataService.validateUserForm(formData)

  if (!errors.isValid) {
      res.render('signup', {
          data: {"formData": formData, "errors": errors}
     
      });
   
  } 
  else {

      UserModel.addUser(req.body);

      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'FreshFoodFix.2020@gmail.com',
          pass: 'freshfood123/'
        }
      });
      
      var mailOptions = {
        from: 'FreshFoodFix.2020@gmail.com',
        to: formData.email,
        subject: 'Welcome to Fresh Food Fix',
        text: 'Hello '+formData.firstname+',\n\nYour sign up was successful. We are so excited to have you apart of our community!'
        +'\nPlease feel free to reply back with any question or concerns you may have'
        +'\n\nBest Regards,'
        +'\nFresh Food Fix'
      };
    
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      res.render('registerSuccess', {
        layout: false
  });

}

  });

  app.post("/login-user",  (req, res) => {

    const userEmail = req.body.loginEmail;
    const userPassword = req.body.loginPass;

    if(userEmail === "" || userPassword === "") {
     return res.render('login', { errorMsg: "Missing email and/or password. Please try again"});  
  } 

  UserModel.findOne({"email": userEmail}, function(error, user) { 
    if (user){

    let validPass = bcrypt.compareSync(userPassword, user.password);
    
    if(userEmail === user.email && validPass === true){
      req.session.user = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        role: user.role
      };

        if(req.session.user.role && req.session.user.role==="customer"){

          req.session.user.cart = { items: [], total: 0 }
          
 let allMeals = MealPackageModel.getAllMealPackages();

 allMeals.then(function (result) {
      res.render("userDashboard", {
        user: req.session.user,
        layout: 'customerLayout',
        dataEntry: result
    });
  }).catch(function (err) {
    console.log(err);
  });
  }

      else if (req.session.user.role && req.session.user.role === "data entry"){
      res.render("dataEntryDashboard", {
        user: req.session.user,
        layout: 'dataEntryLayout'
    });
    } 
  }
  else {
    res.render("login", { errorMsg: "Sorry, you entered the wrong email and/or password. Please try again"});
  }
  }
  else {
    res.render("login", { errorMsg: "Sorry, you entered the wrong email and/or password. Please try again"});
  }
  });

});

app.post("/data-entry", upload.single("photo"), ensureDataClerk, (req, res) => {
  const dataEntryFormData = req.body;
  const formFile = req.file;

  var dataEntryErrors = dataService.validateDataEntryForm(dataEntryFormData)

  if (!dataEntryErrors.isValid || !formFile) {
      res.render('dataEntryDashboard', {
         data:{"formData": dataEntryFormData, 
          "errors": dataEntryErrors},
          user: req.session.user, 
          layout: 'dataEntryLayout'
      });
  }
  
  else {


MealPackageModel.findOne({"title": req.body.mpName}, function(error, mealPackage) { 

  if (mealPackage){
    MealPackageModel.updateMeal(req.body, formFile.originalname)
  }

  else{
    MealPackageModel.addMealPackage(req.body, formFile.originalname);
  }
});

res.render('dataEntrySuccess', {
  layout: false
});
  }
});

app.post("/add-to-cart", ensureCustomer, (req, res) => {

  var newItem = {
    title: req.body.title, 
    imageURL: req.body.imgURL,
    mealContent: req.body.mealContent, 
    quantity: req.body.quantity, 
    price: req.body.price,
    total: req.body.quantity * req.body.price
    };

  req.session.user.cart.items.push(newItem);
  req.session.user.cart.total += newItem.total;

  res.redirect("/ShoppingCart");
});

app.post("/checkout",  ensureCustomer, (req, res) => {

      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'FreshFoodFix.2020@gmail.com',
          pass: 'freshfood123/'
        }
      });
      
      var mailOptions = {
        from: 'FreshFoodFix.2020@gmail.com',
        to:  req.session.user.email,
        subject: 'Order Completed',
        text: dataService.emailOrder(req.session.user)
      };
    
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      req.session.user.cart.items.splice(0, req.session.user.cart.items.length)
      req.session.user.cart.total = 0;
      res.render('CheckoutSuccess', {
        layout: false
  });

  });

app.get("/logout", function(req, res) {
  req.session.reset();
  res.redirect("/login");
});
  
app.get("/ShoppingCart", ensureCustomer, (req, res) => {
  res.render("ShoppingCart", {
    user: req.session.user,
    data: req.session.user.cart.items,
    cart: req.session.user.cart,
    layout: 'customerLayout'
  });
});

app.get("/userDashboard", ensureLogin, (req, res) => {
  let allMeals = MealPackageModel.getAllMealPackages();

  allMeals.then(function (result) {
  res.render("userDashboard", {
    user: req.session.user,
    dataEntry: result
});
}).catch(function (err) {
  console.log(err);
});
});

app.get("/dataEntryDashboard", ensureDataClerk, (req, res) => {
  res.render("dataEntryDashboard", {
    user: req.session.user,
    layout: 'dataEntryLayout'
  });
});


app.get("/createdMealPackages", ensureDataClerk, (req, res) => {

 let allMeals = MealPackageModel.getAllMealPackages();

 allMeals.then(function (result) {
 
  res.render("createdMealPackages", {
    user: req.session.user,
    layout: 'dataEntryLayout',
    data: result
});

}).catch(function (err) {
  console.log(err);
});

});

function ensureLogin(req, res, next) {
    if (!req.session.user) {
      res.redirect("/login");
    } else {
      next();
    }
  }
  function ensureCustomer(req, res, next) {
    if (!req.session.user.role || req.session.user.role != "customer") {
      res.redirect("/login");
    } else {
      next();
    }
  }
  
  function ensureDataClerk(req, res, next) {
    if (!req.session.user.role ||req.session.user.role != "data entry") {
      res.redirect("/login");
    } else {
      next();
    }
  }

  http.createServer(app).listen(HTTP_PORT, onHttpStart);
  https.createServer(https_options, app).listen(HTTPS_PORT, onHttpsStart);