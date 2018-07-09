var path = require("path");

var isAuthenticated = require("../config/middleware/isAuthenticated"); 

module.exports = function(app) {

  app.get("/", function(req, res) {
    if (req.user) { //if user is logged in, render home page, otherwise render landing page
      res.render("home");
    }
    res.render("landing");
  });

  app.get("/home", isAuthenticated, function(req, res) { //if user is logged in, render home page
    res.render("home");
  });

  //experimental route here for testing upload
  // app.get("/home", function(req, res) {
  //   res.render("home");
  // });

};