// When the documents are ready, establish the necessary action handlers
$(document).ready(function(){

  // when on the index or default, there aren't any articles yet so the reference will just take the user to that display of the page
  if (location.pathname.substring(1) != "articles" 
        && location.pathname.substring(1) != "saved"
        && location.pathname.substring(1,8) != "comment"  
      ) {

    // set the reference of the Articles navigation to the articles id
    $("#articles-scroll").attr("href", "#articles");

  };
  
  // automatically scroll to the articles when the articles page or saved page is displayed
  if (location.pathname.substring(1) === "articles" || location.pathname.substring(1) === "saved") {

      var section = $("#articles");

      $("html, body").animate({
          scrollTop: $(section).offset().top
      });

      // set the reference of the Articles navigation to the articles route to reload the articles page
      $("#articles-scroll").attr("href", "/articles");

  } 
  // automatically scroll to the comments when the comment page is displayed
  else if (location.pathname.substring(1,8) === "comment") {

    var section = $("#comments");

    $("html, body").animate({
        scrollTop: $(section).offset().top
    });

    // set the reference of the Articles navigation to the articles route to reload the articles page
    $("#articles-scroll").attr("href", "/articles");

  };

  // event handler for when the "save" button is clicked
  $(".saveArticle").on("click", function(event) {

      // get the id set with the button
      var id = $(this).data("id");

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

      // Send the GET request to the controller
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

      // Send the GET request to the controller
      $.ajax("/comment/" + id, {
      type: "GET"
      }).then(
      function(data) {
          
          // Reload the page to get the updated list
          location.replace("/comment/" + id);

      });

  });

  // event handler for when the make-new button is clicked
  $("#make-new").on("click", function() {
    
    // get the id set with the button
    var thisId = $(this).attr("data-id");

    // Send a POST request to create a comment with what was entered
    $.ajax({
      method: "POST",
      url: "/comments/" + thisId,
      data: {
        tagLine: $("#tagLine-input").val(),
        user: $("#user-input").val(),
        comment: $("#comment").val()
      }
    })
    .then(function(data) {
      // Reload the page to get the updated list
      location.reload();
    });

    // Remove the values entered in the inputs
    $("#tagLine-input").val("");
    $("#user-input").val("");
    $("#comment").val("");
  });

  // event handler for when the deleteComment button is clicked
  $(".deleteComment").on("click", function() {

    // get the id set with the button
    var thisId = $(this).attr("data-id");

    // Send a GET request to the controller to delete the comment
    $.ajax({
      method: "GET",
      url: "/comments/delete/" + thisId
    })
    .then(function(data) {
      // Reload the page to get the updated list
      location.reload();
    });

  });

  // event handler for when the removeSaved button is clicked
  $(".removeSaved").on("click", function() {

    // get the id set with the button
    var id = $(this).data("id");

    // Send the PUT request to the controller to change the isSaved status
    $.ajax("/removesaved/" + id, {
    type: "PUT"
    }).then(
    function() {
      
      // Reload the page to get the updated list
      location.reload();

    });

  });

});