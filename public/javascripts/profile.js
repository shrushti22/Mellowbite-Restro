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
        success: function(result) {
            window.location.reload();
        },
        error: function(request, status, error) {
            alert("error");
        }
    });
    $(document).ajaxSuccess(function() {
        alert("AJAX request successfully completed");
    });

}

function img_change(event) {
    event.preventDefault();
    var form = document.getElementById("profileimg");

    var img = form.elements.image.value;

    var data = {
        img: img,
    }


    $.ajax({
        global: false,
        type: 'POST',
        url: '/profileimg',
        data: data,
        success: function(result) {
            window.location.reload();
        },
        error: function(request, status, error) {
            alert("error");
        }
    });
    $(document).ajaxSuccess(function() {
        alert("AJAX request successfully completed");
    });

}