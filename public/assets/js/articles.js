$(document).ready(function(){

  // when on the index or default, there aren't any articles yet so the reference will just take the user to that display of the page
  if (location.pathname.substring(1) != "articles" && location.pathname.substring(1) != "saved") {

      $("#articles-scroll").attr("href", "#articles");
      
  };
  
  // automatically scroll to the articles when the articles page or saved page is displayed
  if (location.pathname.substring(1) === "articles" || location.pathname.substring(1) === "saved") {

      var section = $("#articles");

      $("html, body").animate({
          scrollTop: $(section).offset().top
      });

      $("#articles-scroll").attr("href", "/articles");

  };


  // event handler for when the "save" button is clicked
  $(".saveArticle").on("click", function(event) {

      // get the id set with the button
      var id = $(this).data("id");

      console.log("Saving Article with ID:  " + id)
      // Send the PUT request to the controller
      $.ajax("/saved/" + id, {
      type: "PUT"
      }).then(
      function() {
          
          // Reload the page to get the updated list
          location.reload();

      });

  });

  // event handler for when the "deleteArticles" button is clicked
  $(".deleteArticles").on("click", function(event) {

      // Send the PUT request to the controller
      $.ajax("/clearUnsaved", {
      type: "GET"
      }).then(
      function() {
          
          // Reload the page to get the updated list
          location.reload();

      });

  });

  // event handler for when the "comment" button is clicked
  $(".comment").on("click", function(event) {

      // get the id set with the button
      var id = $(this).data("id");

      // Send the PUT request to the controller
      $.ajax("/comment/" + id, {
      type: "GET"
      }).then(
      function(data) {
          
          // Reload the page to get the updated list
          console.log("Made it back here!");
          location.replace("/comment/" + id);

      });

  });

  // When you click the savenote button
  $("#make-new").on("click", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/comments/" + thisId,
    data: {
      tagLine: $("#tagLine-input").val(),
      user: $("#user-input").val(),
      comment: $("#comment").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#tagLine-input").val("");
  $("#user-input").val("");
  $("#comment").val("");
});

});