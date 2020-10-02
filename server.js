var path = require("path");
var express = require("express");
var app = express();

var HTTP_PORT = process.env.PORT || 8081;


function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.get("/", function(req,res){
    res.send("Hello World<br /><a href='/home.html'>Go to the home page</a>");
});

app.get("/home", function(req,res){
    res.sendFile(path.join(__dirname,"/views/home.html"));
  });


  app.use('/static', express.static('static'))
  app.use(express.static('./views'))

app.listen(HTTP_PORT, onHttpStart);
