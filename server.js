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
  res.render('home');
});

app.get("/mealpackage",  (req, res) => {
  res.render('mealpackage', {
      data: { }
      // ,layout: false // do not use the default Layout (main.hbs)
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

/* app.get("/registerSuccess",  (req, res) => {
  res.render('registerSuccess', {
      data: { }
     
  });
}); */

app.post("/signup-user",  (req, res) => {
  var formData = req.body;
  var errors = dataService.validateUserForm(formData)

  if (!errors.isValid) {
      res.render('signup', {
          data: {"formData": formData, "errors": errors}
     
      });
   
  } 
  else {
      // dataService.registerUser(req.body);
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
        text: 'Hello '+formData.firstname+'\n\nYour sign up was successful. We are so excited to have you apart of our community!'
        +'\nPlease feel free to reply back with any question or concerns you may have'
        +'\n\nFresh Food Fix'
      };
    
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      res.render('registerSuccess', {
        data: {"formData": formData, "errors": errors},
        layout: false
  });

}

  });
  
  app.use((req, res) => {
    res.status(404).send("Page Not Found");
  });
  
app.listen(HTTP_PORT, onHttpStart);
