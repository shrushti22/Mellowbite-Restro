function details_change(event) {
    event.preventDefault();
    var form = document.getElementById("editprofile");

    var name = form.elements.newname.value;

    var data = {
        name: name,
    }


    $.ajax({
        global: false,
        type: 'POST',
        url: '/profile',
        data: data,
        success: function (result) {
            window.location.reload();
        },
        error: function (request, status, error) {
            alert("error");
        }
    });
    $(document).ajaxSuccess(function () {
        alert("AJAX request successfully completed");
    });

}

function add_address(event) {
    event.preventDefault();
    var form = document.getElementById("newaddress");

    var address = form.elements.newaddress.value;

    var data = {
        name: "add",
        address: address,
    }

    $.ajax({
        global: false,
        type: 'POST',
        url: '/profileaddress',
        data: data,
        success: function (result) {
            window.location.reload();
        },
        error: function (request, status, error) {
            alert("error");
        }
    });
    $(document).ajaxSuccess(function () {
        alert("AJAX request successfully completed");
    });

}

function delete_address(event, data) {
    event.preventDefault();

    console.log(data);

    var address = data.value;

    var data = {
        name: "delete",
        address: address,
    }

    $.ajax({
        global: false,
        type: 'POST',
        url: '/profileaddress',
        data: data,
        success: function (result) {
            window.location.reload();
        },
        error: function (request, status, error) {
            alert("error");
        }
    });
    $(document).ajaxSuccess(function () {
        alert("AJAX request successfully completed");
    });

}

$('#profileimg').submit(function () {

    $(this).ajaxSubmit({
        success: function (result) {
            window.location.reload();
        },
        error: function (request, status, error) {
            alert("error");
        }
    });
    //Very important line, it disable the page refresh.
    return false;
});