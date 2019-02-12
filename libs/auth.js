var passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var connection = require("./db");

const bcrypt = require("bcrypt"); //for encryption

passport.serializeUser(function(user, done) {
  console.log(user);
  done(null, user.user_id);
});
passport.deserializeUser(function(id, done) {
  connection.query("select * from reg_login where user_id = " + id, function(
    err,
    rows
  ) {
    done(err, rows[0]);
  });
});

passport.use(
  new LocalStrategy(function(username, password, done) {
    connection.query(
      "SELECT * FROM reg_login WHERE user_name = ?",
      [username],
      function(err, user, fields) {
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false, { message: "Email-Id not Register." });
        }
        if (user.length > 0) {
          bcrypt.compare(password, user[0].user_pass, function(err, isMatch) {
            if (err) {
              return done(err);
            }
            if (isMatch) {
              if (user[0].is_verified) {
                return done(null, user[0]);
              } else {
                return done(null, false, {
                  message: `Please verifiy your email. <a href="/resend-link?username=${
                    user[0].user_name
                  }">Click here</a> to resend verification email`
                });
              }
            } else {
              return done(null, false, { message: "Email-Id not Register" });
            }
          });
        } else {
          return done(null, false, { message: "Incorrect password." });
        }
      }
    );
  })
);

module.exports = passport;
