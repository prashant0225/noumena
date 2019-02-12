const multer = require("multer");
var randomstring = require("randomstring");
var path=require("path")
var storage = multer.diskStorage({
    destination: function(req, file, callback) {
      callback(null, "./public/uploads");
    },
    filename: function(req, file, callback) {
      let str = randomstring.generate({
        length: 12,
        charset: "alphabetic"
      });
      var filename = str + Date.now() + path.extname(file.originalname);
      console.log(filename);  
      callback(null, filename);
    }
  });
  var upload = multer({ storage: storage });

  module.exports = upload;