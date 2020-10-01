var path = require("path");
var express = require("express");
var app = express();

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/home", function(req,res){
    res.send("Hello World<br /><a href='/Home'>Go to the home page</a>");
});

// setup another route to listen on /about
app.get("/home", function(req,res){
    res.sendFile(path.join(__dirname,"/views/Home.html"));
  });

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);