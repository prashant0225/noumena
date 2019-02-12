var express = require("express");
var router = express.Router();
var connection = require("../libs/db");
var upload = require("../libs/multer");

router.get("/", isAdminAuthenticated, function(req, res) {
  var query = connection.query(
    "SELECT  p.*, GROUP_CONCAT(DISTINCT c.cat_name) as cate  FROM products p  LEFT JOIN categories_products cp ON(cp.pro_id = p.pro_id) LEFT JOIN categories c ON(c.cat_id = cp.cat_id) GROUP BY p.pro_id",
    function(error, results, feilds) {
      if (error) throw error;
      connection.query("SELECT * FROM categories", function(
        error,
        cat,
        feilds
      ) {
        res.render("admin/products", {
          user: req.user,
          results_pro: results,
          cat: cat
        });
      });
    }
  );
});

router.get("/:pro_id", function(req, res) {
  console.log(req.params.pro_id);
  var query = connection.query(
    "SELECT * FROM products WHERE pro_id = ?",
    [req.params.pro_id],
    function(error, results, feilds) {
      if (error) throw error;
      let products = results.length > 0 ? results[0] : {};
      connection.query(
        "SELECT * FROM categories_products cp LEFT JOIN categories c ON (c.cat_id = cp.cat_id) WHERE pro_id = ?",
        [req.params.pro_id],
        function(error, pro_cats, feilds) {
          pro_cats = pro_cats.map(e => e.cat_id);
          res.json({ products: products, pro_cats: pro_cats });
        }
      );
    }
  );
});

router.post("/", upload.single("file-to-upload"), function(req, res) {
  var post = {
    pro_name: req.body.pro_name,
    pro_cost: req.body.pro_cost,
    pro_img_name: req.file.filename,
    pro_img_ogname: req.file.originalname
  };
  var query = connection.query("INSERT INTO products SET ?", post, function(
    error,
    results, 
    feilds
  ) {
    if (error) throw error;
    console.log(results.insertId);
    const cat_pro =
      typeof  req.body.pro_categories === "object"
        ? req.body.pro_categories.map(e => [e, results.insertId])
        : [[req.body.pro_categories, results.insertId]];
    connection.query(
      "insert into categories_products (cat_id, pro_id) values ?",
      [cat_pro],
      function(err, r) {
        console.log(err);
        res.redirect("/admin/products");
      }
    );
  });
});

router.post("/:pro_id", upload.single("file-to-upload"), function(req, res) {
  var pro_id = req.params.pro_id;
  var post = {
    pro_name: req.body.pro_name,
    pro_cost: req.body.pro_cost,
    pro_img_name: req.file.filename,
    pro_img_ogname: req.file.originalname
  };
  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [post, { pro_id: pro_id }],
    function(error, results, feilds) {
      if (error) throw error;
      connection.query(
        "DELETE FROM categories_products WHERE pro_id = ?",
        [pro_id],
        function(err, r) {
          const cat_pro = typeof req.body.pro_categories=== "object" ? req.body.pro_categories.map(e => [e, pro_id]):[[req.body.pro_categorie,cat_pro]];
          console.log(cat_pro);
          connection.query(
            "insert into  categories_products (cat_id, pro_id) values ?",
            [cat_pro],
            function(err, r) {
              console.log(err);
              res.redirect("/admin/products");
            }
          );
        }
      );
    }
  );
});

router.delete("/:pro_id", function(req, res) {
  console.log(req.params.pro_id);
  var query = connection.query(
    "DELETE FROM products WHERE pro_id=?",
    [req.params.pro_id],
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
