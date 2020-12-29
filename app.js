// Importing Modules
const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

//Creating Database
const db = mongoose.connect('mongodb://localhost/Restro', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//Session prperties
app.use(session({
    secret: 'A little Secret.',
    resave: false,
    saveUninitialized: true
}));

//Initializing passport with session
app.use(passport.initialize());
app.use(passport.session());

//Creating Schema
const menuSchema = new mongoose.Schema({
    itemName: String,
    itemPrice: Number,
    itemCategory: String,
})

const cartSchema = new mongoose.Schema({
    itemName: String,
    itemQuantity: Number,
    itemPrice: Number,
    itemTotal: Number,
})

const orderSchema = new mongoose.Schema({
    orderItems: [cartSchema],
})

const reservationSchema = new mongoose.Schema({
    date: { type: Date },
    people: Number,
})

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    reservations: [reservationSchema],
    orders: [orderSchema],
    cart: [cartSchema],
    cartTotal: Number,
})

//adding plugin to userSchema
userSchema.plugin(passportLocalMongoose);

//Create Collections
const User = new mongoose.model('User', userSchema);
const Menu = new mongoose.model("Menu", menuSchema);
const Cart = new mongoose.model("Cart", cartSchema);
const Reserve = new mongoose.model("Reserve", reservationSchema);
const Order = new mongoose.model("Order", orderSchema);


/*
const item1 = new Menu({
    itemName: "Burger",
    itemPrice: 80,
    itemCategory: "Fastfood"
})
const item2 = new Menu({
    itemName: "Pizza",
    itemPrice: 200,
    itemCategory: "Fastfood",
})


item1.save();
item2.save();
*/

//Creating Strategy for Authentication
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

//variables
var display = "Your Favorite Dishes, only a step ahead";
var conf_info = "";
var categories = ["Fastfood", "Soups", "beverages"];

// GET Request
app.get("/", function(req, res) {
    res.render("security", { display: display });
})

app.get("/main", function(req, res) {
    res.render("main");
});

app.get("/profile", function(req, res) {
    if (req.isAuthenticated()) {
        var person = req.user;
        res.render("profile", { name: person.username, reservations: person.reservations, orders: person.orders });
    } else {
        res.redirect("/");
    }
})

app.get("/reservation", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("reservation");
    } else {
        res.redirect("/");
    }

})

app.get("/menu", function(req, res) {
    if (req.isAuthenticated()) {
        Menu.find({}, function(err, menu) {

            res.render("menu", {
                menu: menu,
                category: categories,
                cart: req.user.cart,
            });
        });
    } else {
        res.redirect("/");
    }


})

app.get("/checkout", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("checkout", { cart: req.user.cart })
    } else {
        res.redirect("/");
    }
})

app.get("/confirmed", function(req, res) {
    if (req.isAuthenticated()) {
        if (conf_info) {
            res.render("confirmed", { display: conf_info })
            conf_info = "";
        } else {
            res.redirect("/main")
        };
    } else {
        res.redirect("/");
    }

})

app.get("/logout", function() {
    req.logout();
    res.redirect("/");
})

//POST Request
app.post("/", function(req, res) {
    var button = req.body.button;

    if (button == "SignUp") {

        User.register({ username: req.body.username }, req.body.password, function(err, user) {
            if (err) {
                console.log(err);
                res.render("security", { display: "User Already Exist" })
            } else {
                passport.authenticate("local")(req, res, function() {
                    res.redirect("/main");
                })
            }
        })
    }

    if (button == "Login") {
        const person = new User({
            username: req.body.username,
            password: req.body.password
        })

        req.login(person, function(err) {
            if (err) {
                res.redirect("/");
            } else {
                passport.authenticate("local", function(err, user, info) {
                    if (info) {
                        req.session.destroy();
                        res.render("security", { display: "Incorrect username or password" })
                    } else(res.redirect("/main"));
                })(req, res, function() {});
            };
        })
    }
})

app.post("/main", function(req, res) {
    button = req.body.button;
    if (button == "DineIn") {
        res.redirect("/reservation");
    }

    if (button == "BeeHome") {
        res.redirect("/menu");
    }
})

app.post("/menu", function(req, res) {
    req.user.cart = req.body.mycart;
    req.user.save();
    res.redirect("/menu");
})

app.post("/checkout", function(req, res) {
    const order = new Order({
        orderItems: req.user.cart
    });

    req.user.orders.push(order);
    req.user.cart = [];
    req.user.save();

    conf_info = "order successfull";
    res.redirect("/confirmed");
})

app.post("/reservation", function(req, res) {
    var date = req.body.date;
    var people = req.body.no_of_people;

    const reservation = new Reserve({
        date: date,
        people: people
    })

    conf_info = "Reservation successfull";

    User.findOne({ username: req.user.username }, function(err, founduser) {
        founduser.reservations.push(reservation);
        founduser.save(function() {
            res.redirect("/confirmed");
        });

    });



})

// Server Hosting
app.listen(3000, function() {
    console.log("server started");
})