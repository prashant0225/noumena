var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var randomstring = require("randomstring");
//to send mail using smtp
var connection = require("./libs/db");
const multer = require("multer");

var passport = require("passport");
var flash = require("connect-flash"); //alert message
var path = require("path");

var admin = require("./routes/admin");
var products = require("./routes/products");

var auth = require("./routes/auth");
var frontend = require("./routes/frontend");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(flash());

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  session({
    secret: "2C44-4D44-WppQ38S",
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine", "ejs");

require("./libs/auth");
require("./libs/multer");

app.use("/", frontend);
app.use("/", auth);



app.use("/admin", admin);
app.use("/admin/products", products);
app.listen(3000);
console.log("creation done!!!");
