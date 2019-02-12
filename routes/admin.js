var express = require("express");
var router = express.Router();
var connection = require("../libs/db");
var upload = require("../libs/multer");


router.get("/", isAdminAuthenticated, function(req, res) {
  res.render("admin/main", { user: req.user });
});

router.get("/categories", isAdminAuthenticated, function(req, res) {
  var query = connection.query("SELECT * FROM categories", function(
    error,
    results,
    feilds
  ) {
    if (error) throw error;
    res.render("admin/categories", { user: req.user, results_cat: results });
  });
});

router.get("/categories/:categ_id", function(req, res) {
  var query = connection.query(
    "SELECT * FROM categories WHERE cat_id =?",
    [req.params.categ_id],
    function(err, results, feilds) {
      if (err) throw err;
      let categ = {};
      if (results.length > 0) {
        categ = results[0];
      }
      res.json({ categ: categ });
    }
  );
});


router.post("/categories", upload.single("file-to-upload"), function(req, res) {
  var post = {
    cat_name: req.body.cat_name,
    cat_description: req.body.cat_description,
    cat_img_name: req.file.filename,
    cat_img_ogname: req.file.originalname
  };
  var query = connection.query("INSERT INTO categories SET ?", post, function(
    error,
    results,
    feilds
  ) {
    if (error) throw error;

    res.redirect("categories");
  });
});

router.post("/categories/:cat_id", upload.single("file-to-upload"),function(req, res) {
  var cat_id = req.params.cat_id;
  var post = {
    cat_name: req.body.cat_name,
    cat_description: req.body.cat_description,
    cat_img_name: req.file.filename,
    cat_img_ogname: req.file.originalname
  };
  var query = connection.query(
    "UPDATE categories SET ? WHERE ?",
    [post, { cat_id: cat_id }],
    function(error, results, feilds) {
      if (error) throw error;
      res.redirect("categories");
    }
  );
});



router.delete("/categories/:categ_id", function(req, res) {
  console.log(req.params.categ_id);
  var query = connection.query(
    "DELETE FROM categories WHERE cat_id=?",
    [req.params.categ_id],
    function(error, results, feilds) {
      if (error) throw error;
      res.json({ success: "submitted" });
    }
  );
});



function isAdminAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user.role == "ADMIN") return next();

  res.redirect("/login");
}
module.exports = router;
