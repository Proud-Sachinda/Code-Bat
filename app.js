const express = require('express');
const path = require('path');
const logger = require('morgan');
const fs = require('fs');

let app = express();

//logging middleware
app.use(logger("dev"));

//static files  middleware
app.use(express.static(__dirname+'/public'))
app.set("views", __dirname+"/views");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html")


//routes
app.get("/", (req, res)=>{
    res.render("index.html")
});

app.get("/about", (req, res)=>{
    res.render("about.html")
})
app.get("/howto", (req, res)=>{
    res.render('howto.html')
})

app.use((req, res)=>{
    res.status(404).send("404 - Page Not Found!")
})

//run the server
app.listen(3001, ()=>{
    console.log("Application is running at localhost:3001 ");
})