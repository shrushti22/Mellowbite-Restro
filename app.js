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
    itemCategory: String,
    itemPrice: Number,
})

const orderSchema = new mongoose.Schema({
    itemName: String,
    itemPrice: Number,
})

const reservationSchema = new mongoose.Schema({
    date: { type: Date },
    people: Number,
})

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    reservations: [reservationSchema],
    orders: [orderSchema]
})

//adding plugin to userSchema
userSchema.plugin(passportLocalMongoose);

//Create Collections
const User = new mongoose.model('User', userSchema);
const Reserve = new mongoose.model("Reserve", reservationSchema);

//Creating Strategy for Authentication
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

//variables
var display = "Your Favorite Dishes, only a step ahead";
var conf_info = "";

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
        res.render("menu");
    } else {
        res.redirect("/");
    }
})

app.get("/confirm", function(req, res) {
    if (req.isAuthenticated()) {
        if (conf_info) {
            res.render("confirmation", { display: conf_info })
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
                    console.log(info);
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

app.post("/reservation", function(req, res) {
    var date = req.body.date;
    var people = req.body.no_of_people;

    const reservation = new Reserve({
        date: date,
        people: people
    })

    conf_info = "Your Reservation was successfully done";

    console.log(req.user.username);
    User.findOne({ username: req.user.username }, function(err, founduser) {
        founduser.reservations.push(reservation);
        founduser.save();
    });

    res.redirect("/confirm");

})

// Server Hosting
app.listen(3000, function() {
    console.log("server started");
})