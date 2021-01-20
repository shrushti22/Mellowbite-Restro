if (message == "true" || message == "false") {
    $("#myModal").modal("show");
    const stateObj = {
        foo: 'bar'
    };
    history.replaceState(stateObj, '', 'profile');
    window.onclick = function (event) {
        location.reload();
    }
} else {
    $("myModal").modal("hide");
}