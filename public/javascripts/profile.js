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

var uploadField = document.getElementById("file");

uploadField.onchange = function () {
    console.log(this.files[0].size);
    if (this.files[0].size > 100000) {
        $(".validation")[0].style.display = "block";
        this.value = "";
    } else {
        $(".validation")[0].style.display = "none";
    }
};

// $('#profileimg').submit(function () {

//     $(this).ajaxSubmit({
//         success: function (result) {
//             window.location.reload();
//         },
//         error: function (request, status, error) {
//             alert("error");
//         }
//     });
//     //Very important line, it disable the page refresh.
//     return false;
// });