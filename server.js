// Using Activity 11 and Activity 20 as Starting References
// =============================================================
// Dependencies
// =============================================================
var express = require("express");
var handlebars = require("express-handlebars");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Require all models
var db = require("./models");

// added PORT to either be assigned by HEROKU or default to 3000
var PORT = process.env.PORT || 3000;

// establish MongoDB var based on deployed or local
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true } );

// added the ./ static to allow the image to show
app.use(express.static("./"));

// the public folder static is needed for the css styling
app.use(express.static("public"));

// use the appropriate middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// set the express app to use handlebars
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// require the controller files
require("./controllers/articles_controller.js")(app);

// Start the Express app
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
