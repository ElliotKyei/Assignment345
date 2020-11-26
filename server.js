/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Elliot Kyei Student ID: 122982192 Date: 10/27/2020 
*
* Online (Heroku, https://...) Link: https://gentle-depths-73284.herokuapp.com/
*
* GitHub or Bitbucket repo Link: https://github.com/ElliotKyei/Assignment-2
*
********************************************************************************/

var path = require("path");
var express = require("express");
const multer = require("multer");
const bodyParser = require('body-parser');
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
let pass = encodeURIComponent("Azure2761!");
const connectionString = `mongodb+srv://dbUser:${pass}@users.1eqa3.mongodb.net/dbUser?retryWrites=true&w=majority`;



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
  defaultLayout: 'main'
}));

app.set("view engine", ".hbs");

app.use(clientSessions({
  cookieName: "session", 
  secret: "assignment345_web322_/./.././Elliot_Kyei_;.,", 
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
  if (req.session.user){
    if(req.session.user.role === "customer"){
      let test = MealPackageModel.getAllMealPackages();

      test.then(function (result) {
      res.render("userDashboard", {
        data: dataService.getTopMealPackages(),
        user: req.session.user,
        dataEntry: result
    });
    }).catch(function (err) {
      console.log(err);
    });
  }

  else if (req.session.user.role === "data entry"){
    res.render('userDashboard', {
      data: dataService.getTopMealPackages(),
      user: req.session.user,
      layout: 'dataEntryLayout'
  });
  }
}

  else{
  res.render('home', {
    data: dataService.getTopMealPackages()
});
  }
});

app.get("/mealpackage",  (req, res) => {

  let test = MealPackageModel.getAllMealPackages();

  test.then(function (result) {
  
  if (req.session.user){
  if (req.session.user.role === "data entry"){
    res.render('mealpackage', {
      data: dataService.getMealPackages(),
      dataEntry: result,
      user: req.session.user,
      layout: 'dataEntryLayout'
  });
  }
  else if (req.session.user.role === "customer"){
    res.render('mealpackage', {
      data: dataService.getMealPackages(),
      dataEntry: result,
      user: req.session.user,
      layout: 'customerLayout'
  });
  }
}

else{
  res.render('mealpackage', {
      data: dataService.getMealPackages(),
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
    console.log(req.body.password)
      let passwordHash = bcrypt.hashSync(req.body.password);

        let newUser = new UserModel({
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        email: req.body.email,
        password: passwordHash
      });

      UserModel.addUser(newUser);

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

    console.log("USER EMAIL " +userEmail);

    if(userEmail === "" || userPassword === "") {
     return res.render('login', { errorMsg: "Missing email and/or password. Please try again"});  
  } 

  UserModel.findOne({"email": userEmail}, function(error, user) { 
    if (user){
    console.log(user); 
    console.log(user.password); 
    let validPass = bcrypt.compareSync(userPassword, user.password);

    console.log("Bool = " +validPass); 
    
    if(userEmail === user.email && validPass === true){
      req.session.user = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        role: user.role
      };

        if (req.session.user.role === "customer"){
          
 let test = MealPackageModel.getAllMealPackages();

 test.then(function (result) {
      res.render("userDashboard", {
        data: dataService.getTopMealPackages(),
        user: req.session.user,
        layout: 'customerLayout',
        dataEntry: result
    });
  }).catch(function (err) {
    console.log(err);
  });
  }

      else if (req.session.user.role === "data entry"){
      res.render("dataEntryDashboard", {
        user: req.session.user,
        layout: 'dataEntryLayout'
    });
    } 
  }
  }
  else {
    res.render("login", { errorMsg: "Sorry, you entered the wrong email and/or password. Please try again"});
  }
  });

});

app.post("/data-entry", upload.single("photo"), ensureLogin, (req, res) => {
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
    MealPackageModel.updateOne(
      {title: req.body.mpName},
      { $set: { 
        price: req.body.mpPrice,
        mealContent: req.body.mpDetail,
        category: req.body.mpCategory,
        numberofMeals: req.body.mpNumMeals,
        isTopPackage: req.body.mpTopPackage ? true : false,
        imageURL: formFile.originalname
       } 
    }
    ).exec();
  }

  else{
    let newMealPackage = new MealPackageModel({
      title: req.body.mpName,
      price: req.body.mpPrice,
      mealContent: req.body.mpDetail,
      category: req.body.mpCategory,
      numberofMeals: req.body.mpNumMeals,
      isTopPackage: req.body.mpTopPackage ? true : false,
      imageURL: formFile.originalname
    });

    MealPackageModel.addMealPackage(newMealPackage);
  }
});

res.render('dataEntrySuccess', {
  layout: false
});
  }
});

app.get("/logout", function(req, res) {
  req.session.reset();
  res.redirect("/login");
});
  
app.get("/userDashboard", ensureLogin, (req, res) => {
  let test = MealPackageModel.getAllMealPackages();

  test.then(function (result) {
  res.render("userDashboard", {
    data: dataService.getTopMealPackages(),
    user: req.session.user,
    dataEntry: result
});
}).catch(function (err) {
  console.log(err);
});
});

app.get("/dataEntryDashboard", ensureLogin, (req, res) => {
  res.render("dataEntryDashboard", {
    user: req.session.user,
    layout: 'dataEntryLayout'
});
});


app.get("/createdMealPackages", ensureLogin, (req, res) => {

 let test = MealPackageModel.getAllMealPackages();

 test.then(function (result) {
 
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
  
  http.createServer(app).listen(HTTP_PORT, onHttpStart);
  https.createServer(https_options, app).listen(HTTPS_PORT, onHttpsStart);