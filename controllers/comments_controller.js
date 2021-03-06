// Require the models
var db = require("../models");

// require necessary package
var mongoose = require("mongoose");

// export the constructor to make available in other files
module.exports = function(app) {

  // get route for all comments for a given article
  app.get("/comment/:id", function(req, res) {

    // Grab the Article and Populate with the associated notes
    db.Article.find({ _id: req.params.id })
      .populate("comments")
      .then(function(dbArticle) {

        if (dbArticle.length > 0 ) {

          var articleArray = [];
          for (i=0; i < dbArticle.length; i++) {
            var commentArray = [];
            for (j=0; j < dbArticle[i].comments.length; j++) {
              commentArray.push({
                "_id": dbArticle[i].comments[j]._id,
                "tagLine": dbArticle[i].comments[j].tagLine,
                "user": dbArticle[i].comments[j].user,
                "comment": dbArticle[i].comments[j].comment,
                "userCreated": dbArticle[i].comments[j].userCreated
              });
            };
            articleArray.push({
              "_id": dbArticle[i]._id, 
              "headline": dbArticle[i].headline,
              "link": dbArticle[i].link,
              "summary": dbArticle[i].summary,
              "Comments": commentArray
            })
          };

          // create an object to hold the handlebars array just built
          var hbsObject = {
            Articles: articleArray
          };

        } else {

          // create an object to hold the dbArticle from the find
          var hbsObject = {
            Articles: dbArticle

          };

        }
        
        // send the object to the comments handlebar for display
        return res.render("comments", hbsObject);

      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });

  });

  // Route for saving/updating an Article's associated Comment
  app.post("/comments/:id", function(req, res) {
    // Create a new comment
    db.Comment.create(req.body)
      // if comment is created, update the article to hold the id in the comments array
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

  // route to delete comments and remove them from the associated articles comments
  app.get("/comments/delete/:id", function(req, res) {

    // delete the comment itself
    db.Comment.remove({_id: req.params.id})
    .then(function(dbComment) {
      // After the comment is removed, remove the corresponding entry in the Article it was related
      // find the Article that has the comment id within it's comments array and then remove that id from the array
      db.Article.updateOne({comments: mongoose.Types.ObjectId(req.params.id)}, 
                            {$pull: {comments: mongoose.Types.ObjectId(req.params.id)}})
      .then(function(dbArticle) {
        res.json(dbArticle);  
      })
      .catch(function(error) {
        // If an error occurred, send it to the client
        res.json(error);
      });
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
  
  });

};
  