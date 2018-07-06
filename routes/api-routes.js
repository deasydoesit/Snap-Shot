var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
var db = require("../models");
var passport = require("../config/passport");

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: 'us-east-1'
});

var s3 = new aws.S3();

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "snap-spot",
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.fieldname + Date.now()); 
        }
    })
  });

module.exports = function(app) {

    app.post("/api/login", passport.authenticate("local"), function(req, res) {
        res.json("test");
    });

    app.post("/api/signup", function(req, res) {
        console.log(req.body);
        db.User.create({
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        }).then(function() {
            res.redirect(307, "/api/login");
        }).catch(function(err) {
            console.log(err);
            res.json(err);
        });
    });

    app.post("/api/upload", upload.single('photo'), function (req, res, next) {
        res.send("Uploaded!");
        console.log(req.body);
    });

};