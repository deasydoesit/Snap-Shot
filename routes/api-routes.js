var db = require("../models");

module.exports = function (app) {

    // GET route for getting all of the spots
    app.get("/api/spots/", function (req, res) {
        db.Spots.findAll({})
            .then(function (dbSpot) {
                res.json(dbSpot);
            });
    });
    app.get("/api/spots/:type/", function (req, res) {
        var typeArr = req.params.type.split("+");
        var typeObj = {};
        for (var i = 0; i < typeArr.length; i++) {
            typeObj[typeArr[i]] = 1;
        }

        db.Spots.findAll({
            where: typeObj
        })
            .then(function (dbSpot) {
                res.json(dbSpot);
            });
    });

    app.get("/api/spots/:type/:ToD", function (req, res) {
        var typeArr = req.params.type.split("+");
        var typeObj = {};
        for (var i = 0; i < typeArr.length; i++) {
            typeObj[typeArr[i]] = 1;
        }
        typeObj["ToD"] = req.params.ToD

        db.Spots.findAll({
            where: typeObj
        })
            .then(function (dbSpot) {
                res.json(dbSpot);
            });
    });

    app.get("/api/spots/:type/:ToD/popular", function (req, res) {
        var typeArr = req.params.type.split("+");
        var typeObj = {};
        for (var i = 0; i < typeArr.length; i++) {
            typeObj[typeArr[i]] = 1;
        }
        typeObj["ToD"] = req.params.ToD

        db.Spots.findAll({
            where: typeObj
        })
            .then(function (dbSpot) {
                res.json(dbSpot);
            });
    });

    // app.get("/api/spots/vista/", function (req, res) {
    //     db.Spots.findAll({
    //         where: {
    //             vista: 1
    //         }
    //     })
    //         .then(function (dbSpot) {
    //             res.json(dbSpot);
    //         });
    // });

    // app.get("/api/spots/streetart/", function (req, res) {
    //     db.Spots.findAll({
    //         where: {
    //             streetart: 1
    //         }
    //     })
    //         .then(function (dbSpot) {
    //             res.json(dbSpot);
    //         });
    // });

    // app.get("/api/spots/trendy/", function (req, res) {
    //     db.Spots.findAll({
    //         where: {
    //             trendy: 1
    //         }
    //     })
    //         .then(function (dbSpot) {
    //             res.json(dbSpot);
    //         });
    // });

    // app.get("/api/spots/nature/", function (req, res) {
    //     db.Spots.findAll({
    //         where: {
    //             nature: 1
    //         }
    //     })
    //         .then(function (dbSpot) {
    //             res.json(dbSpot);
    //         });
    // });


    app.put("/api/spots/:id", function (req, res) {
        db.Spots.findById(req.params.id).then(Spots => {
            return db.Spots.increment('popularity', { by: 1 })
        })

    });

    app.delete("/api/favorites/:id/:userid", function (req, res) {
        db.Favorites.destroy({
            where: {
                id: req.params.id,
                user_id: req.params.userid
            }
        })
            .then(function (dbFavorites) {
                res.json(dbFavorites);
            });
    });
}