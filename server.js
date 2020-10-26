var path = require("path");
var express = require("express");
const bodyParser = require('body-parser');
var app = express();

var HTTP_PORT = process.env.PORT || 8081;

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/static', express.static('static'))
app.use(express.static('./views'))

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}


app.get("/", function(req,res){
  res.send("<a href='home.html'>Go to the home page</a>");
});

app.get("/home", function(req,res){
    res.sendFile(path.join(__dirname,"/views/home.html"));
  });

  app.get("/mealpackage", function(req,res){
    res.sendFile(path.join(__dirname,"/views/mealpackage.html"));
  });

  app.get("/signup", function(req,res){
    res.sendFile(path.join(__dirname,"/views/signup.html"));
  });

  app.get("/login", function(req,res){
    res.sendFile(path.join(__dirname,"/views/login.html"));
  });

app.get("/signup-user",  (req, res) => {
  res.sendFile(path.join(__dirname, "/views/signup.html"));
});

app.post("/signup-user",  (req, res) => {
res.send(req.body)
  });
  
  app.use((req, res) => {
    res.status(404).send("Page Not Found");
  });
  
app.listen(HTTP_PORT, onHttpStart);
