var express = require("express");
var router = express.Router();
var connection = require("../libs/db");

router.get("/", function(req, res) {
  res.render("front/home");
});

router.get("/dashboard", isAuthenticated, function(req, res) {
  res.render("pages/hello", { user: req.user });
});

router.get("/categories", function(req, res) {
  res.send("categories card view");
});

router.get("/products", function(req, res) {
  res.send("products card view");
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/login");
}

module.exports = router;
