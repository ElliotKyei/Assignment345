const express = require("express");
const app = express();

const HTTP_PORT = process.env.PORT || 8081;

app.get("/", (req,res)=>{
    res.header('Set-Cookie', 'helloworld=Hello World;username=elliot;email=ek@example.com');
});

app.get("/cookieData",(req,res)=>{
    res.json({cookieData: req.header("cookie")});
});

app.listen(HTTP_PORT,()=>{
    console.log(`server listening on: ${HTTP_PORT}`);
});