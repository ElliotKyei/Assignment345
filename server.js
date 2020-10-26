var path = require("path");
var express = require("express");
const bodyParser = require('body-parser');
const dataService = require('./data-service');
var app = express();

var HTTP_PORT = process.env.PORT || 8081;

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/static', express.static('static'))
app.use(express.static('./views'))

const exphbs = require("express-handlebars");

app.engine('.hbs', exphbs({ 
  extname: '.hbs',
  defaultLayout: 'main',
  helpers: { 
      // helper1: function(options){
      //     // helper without "context", ie {{#helper}} ... {{/helper}}
      // },
      strong: function(options){
          return '<strong>' + options.fn(this) + '</strong>';
      },
  

      // helper2: function(context, options){
      //     // helper with "context", ie {{#helper context}} ... {{/helper}}
      // }
      list: function(context, options) {
          var ret = "<ul>";
          
          for(var i = 0; i < context.length; i++) {
              ret = ret + "<li>" + options.fn(context[i]) + "</li>";
          }
          
          return ret + "</ul>";
      }
      
      
  }
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
      data: { }
      // ,layout: false // do not use the default Layout (main.hbs)
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
   
  } else {
      // dataService.registerUser(req.body);
      res.send("<h5> User" + req.body.firstname + " was registered!</h5>" 
               + "<p><a href='/userformbs'>Register more user</a></p>"
               + "<p><a href='/getData2'>Go to User List page</a></p>");
  }

  });
  
  app.use((req, res) => {
    res.status(404).send("Page Not Found");
  });
  
app.listen(HTTP_PORT, onHttpStart);
