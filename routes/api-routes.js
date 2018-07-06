// var db = require("../models");
// var passport = require("../config/passport");

//Access Key ID:AKIAIV3PHOY5GHE23SXA
//Secret Access Key: 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

var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');

aws.config.update({
    secretAccessKey: 'hY9sXUk6PH6sY35kjBbMDlWrIYMQ0Y71THrIR5x2',
    accessKeyId: 'AKIAIV3PHOY5GHE23SXA',
    region: 'us-east-1'
});

var s3 = new aws.S3();

module.exports = function(app) {

  var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "snap-spot",
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.fieldname + Date.now()); //use Date.now() for unique file keys
        }
    })
  });

  app.post("/upload", upload.single('photo'), function (req, res, next) {
    res.send("Uploaded!");
    console.log(req.body);
  });

};