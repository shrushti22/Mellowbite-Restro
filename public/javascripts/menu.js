var output = "";
var cartTotal;

displayCart(output, cart);

function displayCart(output, cart) {
    cartTotal = 0;
    for (var i = 0; i < cart.length; i++) {
        var name = '<div class="col-lg-4">' + cart[i].itemName + '</div>';
        var quantity = '<div class="col-lg-4">' + cart[i].itemQuantity + '</div>';
        var totalprice = '<div class="col-lg-4">' + cart[i].itemTotal + '</div>';
        output += name + quantity + totalprice;

        var container = $("#" + cart[i]._id)[0];
        var add = container.querySelectorAll(".add")[0];
        var plus = container.querySelectorAll(".plus")[0];
        var minus = container.querySelectorAll(".minus")[0];

        add.style.display = "none";
        plus.style.display = "";
        minus.style.display = "";

        cartTotal += cart[i].itemTotal;
    }

    document.getElementById("cartitems").innerHTML = output;
    document.getElementById("cartTotal").innerHTML = '<h3>' + cartTotal + '</h3>';
}

console.log(output);

function addToCart(event, item, x) {

    item = JSON.parse(item.value);
    event.preventDefault();

    if (x == 'add') {
        item.itemQuantity = 1;
        item.itemTotal = item.itemQuantity * item.itemPrice;
        cart.push(item);
        displayCart(output, cart);
    }

    if (x == 'plus') {
        var q, i = 0;

        while (i < cart.length) {
            if (cart[i]._id == item._id) {
                q = cart[i].itemQuantity;
                break;
            }
            i += 1;
        }

        item.itemQuantity = q + 1;
        item.itemTotal = item.itemQuantity * item.itemPrice;
        cart[i] = item;

        displayCart(output, cart);
    }

    if (x == 'minus') {
        var q, i = 0;

        while (i < cart.length) {
            if (cart[i]._id == item._id) {
                q = cart[i].itemQuantity;
                break;
            }
            i += 1;
        }

        if (q == 1) {
            var container = $("#" + cart[i]._id)[0];
            var add = container.querySelectorAll(".add")[0];
            var plus = container.querySelectorAll(".plus")[0];
            var minus = container.querySelectorAll(".minus")[0];
            add.style.display = "";
            plus.style.display = "none";
            minus.style.display = "none";
            cart.splice(i, 1);

        } else {
            item.itemQuantity = q - 1;
            item.itemTotal = item.itemQuantity * item.itemPrice;
            cart[i] = item;
        }

        displayCart(output, cart);
    }
    console.log(cartTotal);
    $.ajax({
        global: false,
        type: 'POST',
        url: '/menu',
        dataType: 'json',
        data: {
            mycart: cart,
            cartTotal: cartTotal,
        },
        success: function(result) {
            console.log(result);
        },
        error: function(request, status, error) {

        }
    });
};