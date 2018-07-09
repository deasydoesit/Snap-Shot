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

var path = "https://s3.amazonaws.com/snap-spot/";

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "snap-spot",
        key: function (req, file, cb) {
            console.log(file);
            var newImage = file.fieldname + Date.now();
            path += newImage;
            cb(null, newImage); 
        }
    })
});

module.exports = function(app) {

    app.post("/api/login", passport.authenticate("local"), function(req, res) {
        res.json("home");
    });

    app.get("/logout", function(req, res) {
        req.logout();
        res.redirect("/");
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
        
        console.log(path);
        db.Spot.create({
            uploader_id: req.user.id,
            location: req.body.location,
            lat: req.body.lat,
            lng: req.body.lng,
            path: path,
            historical: req.body.historical,
            vista: req.body.vista,
            trendy: req.body.trendy,
            street_art: req.body.street_art,
            nature: req.body.nature,
            tod: req.body.tod
        }).then(function() {
            res.send("Uploaded!");
        }).catch(function(err) {
            console.log(err);
            res.json(err);
        });
    });

};