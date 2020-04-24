// Require the models
var db = require("../models");

var axios = require("axios");
var cheerio = require("cheerio");

// export the constructor to make available in other files
module.exports = function(app) {

  // default route - get all unsaved articles
  app.get("/", function(req, res) {

    // Grab every document in the Articles collection that was not saved
    db.Article.find({isSaved: false})
      .then(function(dbArticle) {

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
          
          res.render("articles", hbsObject);

        } else {

          res.render("index");
        
        }
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });

      // res.render("index");

  });

    // Route for getting all Articles from the db that are not saved!
    app.get("/articles", function(req, res) {

      // Grab every document in the Articles collection
      db.Article.find({isSaved: false})
        .then(function(dbArticle) {
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
            
            res.render("articles", hbsObject);
  
          } else {
  
            res.render("index");
          
          }
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          res.json(err);
        });
    });

  // A GET route for scraping the www.inquirer.com/ website
  app.get("/scrape", function(req, res) {

    // First, we grab the body of the html with axios
    axios.get("http://www.inquirer.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      // Grab every 'card' that also has a 'card-content' child that also has a 'text-container' child
      // For EACH of those tags, grab the headline, link, and summary information!
      $("div.card > div.card-content > div.text-container").each(function(i, element) {
        // Save an empty result object
        var result = {};

        // First set of headings are 'h3' tags
        result.headline = $(this)
          .children("h3")
          .children("a")
          .text();
        
        result.link = $(this)
          .children("h3")
          .children("a")
          .attr("href");

        result.summary = $(this).children("div.preview-text")
          .text();

        result.byLine = $(this)
          .children("div.byline-timestamp-container")
          .children("div.byline-wrapper")
          .children("div.card-byline")
          .text();
        
        // If not found using the 'h3' tag, try the 'h4' heading
          if (!result.headline) {
          result.headline = $(this)
            .children("h4")
            .children("a")
            .text();
          
          result.link = $(this)
            .children("h4")
            .children("a")
            .attr("href");

          result.summary = $(this).children("div.spaced.preview-text")
            .text();

          if (!result.summary) {
            result.summary = $(this)
            .children("div.container-row.row-reverse.text-image-container")
            .children(".text-image-container")
            .children(".preview-text")
            .text();
          }

          result.byLine = $(this)
            .children("div.byline-timestamp-container")
            .children("div.byline-wrapper")
            .children("div.card-byline")
            .text();

        }

                // If not found using the 'h3' tag, try the 'h4' heading
          if (!result.headline) {
          result.headline = $(this)
            .children("h4")
            .children("a")
            .text();
          
          result.link = $(this)
            .children("h4")
            .children("a")
            .attr("href");

          result.summary = $(this).children("div.preview-text")
            .text();

          // some 'h4' summaries are further down in divs - check if no summary was found
          if (!result.summary) {
            result.summary = $(this)
            .children("div.container-row.row-reverse.text-image-container")
            .children(".text-image-container")
            .children(".preview-text")
            .text();
          }

          result.byLine = $(this)
            .children("div.byline-timestamp-container")
            .children("div.byline-wrapper")
            .children("div.card-byline")
            .text();

        }

        // If not found using the 'h3' or 'h4' tags, try the 'h5' heading
        if (!result.headline) {
          result.headline = $(this)
            .children("h5")
            .children("a")
            .text();
          
          result.link = $(this)
            .children("h5")
            .children("a")
            .attr("href");

          result.summary = $(this)
            .children("div.preview-text")
            .text();

          if (!result.summary) {
            result.summary = $(this)
            .children("div.container-row.row-reverse.text-image-container")
            .children(".text-image-container")
            .children(".preview-text")
            .text();
          }

          result.byLine = $(this)
            .children("div.byline-timestamp-container")
            .children("div.byline-wrapper")
            .children("div.card-byline")
            .text();
        }

        // when we reach here we should have grabbed headlines by all possible means!
        // ONLY create a new record if the required headline, link, and summary are populated
        if (result.headline && result.link && result.summary) {
          // Create a new Article using the `result` object built from scraping
          db.Article.create(result)
            .then(function(dbArticle) {
              // View the added result in the console
              console.log(dbArticle);
            })
            .catch(function(err) {
              // If an error occurred, log it
              console.log(err);
            });
        };
          
      });

      // Send a message to the client
      // res.send("Scrape Complete");
      res.redirect("/articles");

    });

  });

  // Route for getting all the saved Articles from the db
  app.get("/saved", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({isSaved: true})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        // res.json(dbArticle);

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
          Saved: articleArray
        };
        
        res.render("saved", hbsObject);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for saving an Article
  app.put("/saved/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    
      db.Article.updateOne({ _id: req.params.id }, {$set: {"isSaved": true}})
      
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for removing any unsaved articles
  app.get("/clearUnsaved", function(req, res) {

    // Remove every article from the DB where the isSaved is false
    db.Article.remove({isSaved: false}, function(error, response) {
      // Log any errors to the console
      if (error) {
        // console.log(error);
        res.send(error);
      }
      else {
        // This will fire off the success function of the ajax request
        console.log(response);
        res.send(response);
      }
    });

  });

};
  