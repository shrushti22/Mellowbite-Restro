var p = $("p.slogan").last();
var offset = p.offset();
var topvalue = offset.top;

$(window).scroll(function() {
    $("nav, a.navbar-brand, a.nav-link, button.navbar-toggler, li.nav-item").toggleClass('scrolled', $(this).scrollTop() > topvalue);
})



if (message) {
    $("#signup")[0].style.display = "none";
    $("#profile")[0].style.display = "";
} else {
    console.log("no");
    $("#signup")[0].style.display = "";
    $("#profile")[0].style.display = "none";
}