// Require the models
var db = require("../models");

var axios = require("axios");
var cheerio = require("cheerio");

// export the constructor to make available in other files
module.exports = function(app) {

  // default for the index view
  app.get("/", function(req, res) {

    // call the index handlebar to render the index file
    res.render("index");

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
      res.send("Scrape Complete");

    });

  });

};
  