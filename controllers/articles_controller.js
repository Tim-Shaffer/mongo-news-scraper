// Require the models
var db = require("../models");

// export the constructor to make available in other files
module.exports = function(app) {

  // default for the index view
  app.get("/", function(req, res) {

    // call the index handlebar to render the index file
    res.render("index");

  });

};
  