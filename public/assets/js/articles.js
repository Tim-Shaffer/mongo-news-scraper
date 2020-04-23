$(document).ready(function(){
    
    // automatically scroll to the articles when the articles page is displayed
    if (location.pathname.substring(1) === "articles") {
        console.log("Articles Page!")
        
        var section = $("#articles");
        
        $("html, body").animate({
            scrollTop: $(section).offset().top
        });
    }

});