var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
var db = require("../models");
var passport = require("../config/passport");
var Sequelize = require("sequelize");

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: 'us-east-1'
});

var s3 = new aws.S3();

var path = "https://s3.amazonaws.com/snap-spot/public/";

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "snap-spot/public",
        key: function (req, file, cb) {
            console.log(file);
            var newImage = file.fieldname + Date.now();
            path += newImage;
            cb(null, newImage);
        }
    })
});

module.exports = function (app) {
    const Op = Sequelize.Op

    app.post("/api/login", passport.authenticate("local"), function (req, res) {
        res.json("home");
    });

    app.get("/logout", function (req, res) {
        req.logout();
        res.redirect("/");
    });

    app.post("/api/signup", function (req, res) {
        console.log(req.body);
        db.User.create({
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        }).then(function () {
            res.redirect(307, "/api/login");
        }).catch(function (err) {
            console.log(err);
            res.json(err);
        });
    });

    app.post("/api/upload", upload.single('photo'), function (req, res, next) {
        db.Spot.create({
            location: req.body.location,
            lat: req.body.lat,
            lng: req.body.lng,
            path: path,
            historical: req.body.historical,
            vista: req.body.vista,
            trendy: req.body.trendy,
            street_art: req.body.street_art,
            nature: req.body.nature,
            tod: req.body.tod,
            description: req.body.description,
            UserId: req.user.id
        }).then(function () {
            res.send("Uploaded!");
        }).catch(function (err) {
            console.log(err);
            res.json(err);
        });
        path = "https://s3.amazonaws.com/snap-spot/public/";
    });

    // GET route for getting all of the spots
    app.get("/api/spots/", function (req, res) {
        db.Spot.findAll({})
            .then(function (dbSpot) {
                res.json(dbSpot);
            });
    });

    app.get("/api/spots/:type/", function (req, res) {
        var typeArr = req.params.type.split("+");

        var typeArray = [];

        for (var i = 0; i < typeArr.length; i++) {
            var thisType = typeArr[i];
            var typeObj = {};
            typeObj[thisType] = true;

            typeArray.push(typeObj)
        }

        db.Spot.findAll({
            where: {
                [Op.or]: typeArray
            }
        })
            .then(function (dbSpot) {
                res.json(dbSpot);
                
            });
    });


    app.get("/api/spots/:type/:tod", function (req, res) {
        var typeArr = req.params.type.split("+");

        var typeArray = [];

        for (var i = 0; i < typeArr.length; i++) {
            var thisType = typeArr[i];
            var typeObj = {};
            typeObj[thisType] = true;
            typeArray.push(typeObj)
        }

        var todArr = req.params.tod.split("+");
        var todObj = {
            tod: todArr
        }


        db.Spot.findAll({
            where: {
                [Op.or]: [typeArray, todObj]
            }
        })
            .then(function (dbSpot) {
                res.json(dbSpot);
            });
    });

    app.get("/api/spots//:tod", function (req, res) {
        
        var todArr = req.params.tod.split("+");
        var todObj = {
            tod: todArr
        }


        db.Spot.findAll({
            where: {
                [Op.or]: todObj
            }
        })
            .then(function (dbSpot) {
                res.json(dbSpot);
            });
    });
    app.get("/api/spots/:type/:tod/popular", function (req, res) {
        var typeArr = req.params.type.split("+");
        var typeObj = {};
        for (var i = 0; i < typeArr.length; i++) {
            typeObj[typeArr[i]] = 1;
        }
        typeObj["tod"] = req.params.tod

        db.Spot.findAll({
            where: typeObj
        })
            .then(function (dbSpot) {
                res.json(dbSpot);
            });
    });




    // app.put("/api/spots/1/:id", function (req, res) {
    //     db.Spot.findById(req.params.id).then(Spot => {
    //         return db.Spot.increment('popularity', { by: 1 })
    //     })

    // });

    // app.put("/api/spots/2/:id", function (req, res) {
    //     db.Spot.findById(req.params.id).then(Spot => {
    //         return db.Spot.decrement('popularity', { by: 1 })
    //     })

    // });

    // app.delete("/api/favorites/:id", function (req, res) {
    //     db.Favorite.destroy({
    //         where: {
    //             spot_id: req.params.id,
    //             user_id: req.user.id
    //         }
    //     })
    //         .then(function (dbFavorites) {
    //             res.json(dbFavorites);
    //         });
    // });

    // app.post("/api/favorites/:id", function (req, res) {
    //     console.log(req.body);
    //     db.Favorite.create({
    //         user_id: req.user.id,
    //         spot_id: req.params.id,
    //         UserId: req.params.id
    //     }).then(function(dbFavorites) {
    //         res.json(dbfavorites);
    //     });
    // });
};
