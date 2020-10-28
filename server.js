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
const bodyParser = require('body-parser');
const dataService = require('./data-service');
var nodemailer = require('nodemailer');
var app = express();


var HTTP_PORT = process.env.PORT || 8081;

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/static', express.static('static'))
app.use(express.static('./views'))

const exphbs = require("express-handlebars");

app.engine('.hbs', exphbs({ 
  extname: '.hbs',
  defaultLayout: 'main'
}));

app.set("view engine", ".hbs");

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}


app.get("/", function(req,res){
  res.render('home', {
    data: dataService.getTopMealPackages()
});
});

app.get("/mealpackage",  (req, res) => {
  
  res.render('mealpackage', {
      data: dataService.getMealPackages()
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
      dataService.registerUser(req.body);
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
    var formData = req.body;
    var users = dataService.getAllUsers()
    var errors = dataService.validateLoginForm(formData)
  
    if (!errors.isValid) {
        res.render('login', {
            data: {"formData": formData, "errors": errors}
        });
     
    } 
    else {
      res.render('loginSuccess', {
        layout: false
  });
  }
});
  
  app.use((req, res) => {
    res.status(404).send("Page Not Found");
  });
  
app.listen(HTTP_PORT, onHttpStart);
