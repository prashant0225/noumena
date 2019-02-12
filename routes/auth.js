var crypto = require("crypto-random-string");
var express = require("express");
var router = express.Router();
var sendmail = require("../libs/mail");
var connection = require("../libs/db");
var passport = require("passport");

router.get("/register", function(req, res) {
  res.render("pages/register");
});
router.post("/reg", function(req, res) {
  console.log(req.body);
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const token = crypto(16);
    const username = req.body.username;
    // Store hash in your password DB.
    var post1 = {
      firstname: req.body.name,
      lastname: req.body.lastname,
      phone: req.body.phone,
      user_name: username,
      user_pass: hash,
      is_verified: 0,
      verify_token: token
    };

    var query = connection.query("INSERT INTO reg_login SET ?", post1, function(
      error,
      results,
      fields
    ) {
      if (error) throw error;
      const link = `Please click to verify your email http://localhost:3000/verify?token=${token}&username=${username}`;
      sendmail(username, "Activate your email", link);
      res.redirect("/login");
    });
  });
});
router.get("/login", function(req, res) {
  if (req.isAuthenticated()) {
    res.redirect("/dashboard");
  } else {
    res.render("pages/login", {
      expressError: req.flash("error"),
      success: req.flash("success")
    });
  }
});



router.post(
  "/auth",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  function(req, res) {
    if (req.user.role == "ADMIN") {
      res.redirect("/admin");
    } else {
      res.redirect("/dashboard");
    }
  }
);

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

router.get("/verify", function(req, res) {
  //log in purpose
  console.log(req.query);
  connection.query(
    "SELECT * FROM reg_login WHERE user_name = ? AND verify_token = ?",
    [req.query.username, req.query.token],
    function(err, user) {
      if (err) throw err;
      if (user.length > 0) {
        connection.query(
          "UPDATE reg_login SET is_verified = 1 WHERE user_id = ?",
          [user[0].user_id],
          function(err) {
            req.flash("success", "Email Verified! Please login");
            res.redirect("/login");
          }
        );
      } else {
        req.flash("error", "Invalid link");
        res.redirect("/login");
      }
    }
  );
});
router.get("/resend-link", function(req, res) {
  connection.query(
    "SELECT * FROM reg_login WHERE user_name = ?",
    [req.query.username],
    function(err, user) {
      if (err) throw err;
      if (user.length > 0) {
        const link = `Please click to verify your email http://localhost:3000/verify?token=${
          user[0].verify_token
        }&username=${user[0].user_name}`;
        sendmail(user[0].user_name, "Activate your email", link);
        req.flash("success", "Verification Link Sent");
        res.redirect("/login");
      } else {
        req.flash("error", "Invalid link");
        res.redirect("/login");
      }
    }
  );
});

router.get("/validate-user", function(req, res) {
  console.log(req.query);
  connection.query(
    "SELECT user_name FROM reg_login WHERE user_name = ?",
    req.query.username,
    function(err, user) {
      if (err) throw err;
      if (user.length > 0) {
        res.json("Email already exist");
      } else {
        res.json(true);
      }
    }
  );
});

module.exports = router;
