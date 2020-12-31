console.log(message);

if (message) {
    console.log("here");
    $(".loginButton")[0].style.display = "none";
    $(".profileButton")[0].style.display = "";
} else {
    console.log("no");
    $(".loginButton")[0].style.display = "";
    $(".profileButton")[0].style.display = "none";
}