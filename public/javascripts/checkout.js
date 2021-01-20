if (message == "true" || message == "false") {
    $("#myModal").modal("show");
    const stateObj = {
        foo: 'bar'
    };
    history.replaceState(stateObj, '', 'profile');
} else {
    $("myModal").modal("hide");
}