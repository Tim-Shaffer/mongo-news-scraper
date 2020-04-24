// Require the models
var db = require("../models");

var axios = require("axios");
var cheerio = require("cheerio");

// export the constructor to make available in other files
module.exports = function(app) {

  // get all comments for a given article
  app.get("/comment/:id", function(req, res) {

    // Grab the Article and Populate with the associated notes
    db.Article.find({ _id: req.params.id })
      .populate("comments")
      .then(function(dbArticle) {

        console.log("Article found: " + JSON.stringify(dbArticle));

        if (dbArticle.length > 0 ) {

          var articleArray = [];
          for (i=0; i < dbArticle.length; i++) {
            articleArray.push({
              "_id": dbArticle[i]._id, 
              "headline": dbArticle[i].headline, 
              "link": dbArticle[i].link,
              "byLine": dbArticle[i].byLine,
              "summary": dbArticle[i].summary,
              "isSaved": dbArticle[i].isSaved
            })
          };

          var hbsObject = {
            Articles: articleArray
          };

        } else {

          var hbsObject = {
            Articles: dbArticle

          };

        }
        
        return res.render("comments", hbsObject);

      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });

  });

  // Route for saving/updating an Article's associated Comment
  app.post("/comments/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Comment.create(req.body)
      .then(function(dbComment) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { comments: dbComment._id }}, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

};
  