// Importing Modules
const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const ejsLint = require('ejs-lint');
var fs = require('fs');
const fsExtra = require('fs-extra')
var path = require('path');
var multer = require('multer');
const {
    log
} = require('console');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

//Creating Database
const db = mongoose.connect('mongodb://localhost/Restro', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
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
    name: String,
    address: String,
    orderItems: [cartSchema],
    date: {
        type: Date
    },
    orderTotal: Number,
})

const reservationSchema = new mongoose.Schema({
    name: String,
    phoneNo: Number,
    date: {
        type: Date
    },
    people: Number,
})

const categoriesSchema = new mongoose.Schema({
    name: String,
})

const reviewSchema = new mongoose.Schema({
    name: String,
    email: String,
    phoneNumber: Number,
    review: String,
})

const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    reservations: [reservationSchema],
    orders: [orderSchema],
    cart: [cartSchema],
    cartTotal: Number,
    img: {
        data: Buffer,
        contentType: String
    },
    address: [],
})

//adding plugin to userSchema
userSchema.plugin(passportLocalMongoose);

//Create Collections
const User = new mongoose.model('User', userSchema);
const Menu = new mongoose.model("Menu", menuSchema);
const Cart = new mongoose.model("Cart", cartSchema);
const Reserve = new mongoose.model("Reserve", reservationSchema);
const Order = new mongoose.model("Order", orderSchema);
const Category = new mongoose.model("category", categoriesSchema)
const Review = new mongoose.model("review", reviewSchema)

//Creating Strategy for Authentication
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

//variables
var display = "";
var conf_info = "";
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({
    storage: storage
});


// GET Request
app.get("/security", function (req, res) {
    res.render("security", {
        display: display,
        message: true
    });
})

app.get("/", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("main", {
            message: true
        });
    } else {
        res.render("main", {
            message: false
        });
    }
});

app.get("/profile", function (req, res) {
    if (req.isAuthenticated()) {
        var person = req.user;

        res.render("profile", {
            name: person.name,
            username: person.username,
            reservations: person.reservations,
            orders: person.orders,
            image: person.img,
            addresses: person.address
        });
    } else {
        res.redirect("/security");
    }
})

app.get("/reservation", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("reservation", {
            name: req.user.name,
            message: "none",
        });
    } else {
        res.redirect("/security");
    }

})

var categories = ["fastfood"];
app.get("/menu", function (req, res) {
    if (req.isAuthenticated()) {
        Menu.find({}, function (err, menu) {
            if (err) {
                console.log(err);
                res.redirect("/menu");
            }
            Category.find({}, function (err, category) {
                var categories = [];
                category.forEach(function (i) {
                    categories.push(i.name);
                })
                res.render("menu", {
                    menu: menu,
                    category: categories,
                    cart: req.user.cart,
                });
            })


        });
    } else {
        res.redirect("/security");
    }


})

app.get("/addmenu", function (req, res) {
    if (req.isAuthenticated() && req.user.username == "rutvij.vamja@gmail.com" || req.user.username == "shrushtivasaniya@gmail.com") {
        res.render("addmenu");
    } else {
        res.redirect("/main");
    }

})

app.get("/checkout", function (req, res) {
    if (req.isAuthenticated()) {
        if (req.user.cart.length) {
            message = "none";
            res.render("checkout", {
                name: req.user.name,
                address: req.user.address,
                cart: req.user.cart,
                total: req.user.cartTotal,
                message: "none"
            })
        } else {
            res.redirect("/menu");
        }
    } else {
        res.redirect("/security");
    }
})

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
})

//POST Request
app.post("/security", function (req, res) {
    var button = req.body.button;

    if (button == "SignUp") {

        User.register({
            username: req.body.username,
        }, req.body.password, function (err, user) {
            if (err) {
                console.log(err);
                res.render("security", {
                    display: "User Already Exist",
                    message: false
                })
            } else {
                passport.authenticate("local")(req, res, function () {
                    res.redirect("/");
                })
            }
        })
    }

    if (button == "Login") {
        const person = new User({
            username: req.body.username,
            password: req.body.password
        })

        req.login(person, function (err) {
            if (err) {
                console.log(err);
                res.redirect("/security");
            } else {
                passport.authenticate("local", function (err, user, info) {
                    if (info) {
                        req.session.destroy();
                        res.render("security", {
                            display: "Incorrect username or password",
                            message: false
                        })
                    } else(res.redirect("/"));
                })(req, res, function () {});
            };
        })
    }
})

app.post("/", function (req, res) {
    button = req.body.button;
    if (button == "DineIn") {
        res.redirect("/reservation");
    }

    if (button == "BeeHome") {
        res.redirect("/menu");
    }

    if (button == "Review") {
        const review = new Review({
            name: _.capitalize(req.body.name),
            email: req.body.email,
            phoneNumber: req.body.phone,
            review: req.body.review,
        })

        review.save(function () {
            res.redirect("/");
        })
    }
})

app.post("/addmenu", function (req, res) {
    if (req.isAuthenticated() && req.user.username == "rutvij.vamja@gmail.com" || req.user.username == "shrushtivasaniya@gmail.com") {
        var itemname = _.capitalize(req.body.itemname);
        var itemprice = req.body.itemprice;
        var itemcategory = _.capitalize(req.body.itemcategory);

        Category.findOne({
            name: itemcategory
        }, function (err, found) {
            if (!found) {
                var category = new Category({
                    name: itemcategory,
                })
                category.save(function () {

                    const item = new Menu({
                        itemName: itemname,
                        itemPrice: itemprice,
                        itemCategory: itemcategory,
                    })

                    item.save(function () {
                        res.redirect("/addmenu");
                    })
                })
            } else {
                const item = new Menu({
                    itemName: itemname,
                    itemPrice: itemprice,
                    itemCategory: itemcategory,
                })

                item.save(function () {
                    res.redirect("/addmenu");
                })
            }

        })


    } else {
        res.redirect("/main");
    }

})

app.post("/profile", function (req, res) {
    var name = _.capitalize(req.body.name);

    req.user.save(function () {
        res.redirect("/profile");
    });
})

app.post("/profileaddress", function (req, res) {
    var address = req.body.address;
    var button = req.body.name;

    if (button == "add") {
        req.user.address.push(address);
        req.user.save(function () {
            res.redirect("/profile");
        });
    } else {
        const index = req.user.address.indexOf(address);
        if (index > -1) {
            req.user.address.splice(index, 1);
        }
        req.user.save(function () {
            res.redirect("/profile");
        });
    }
})

app.post("/profileimg", upload.single('image'), function (req, res) {
    req.user.img = {
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
        contentType: 'image/png'
    }

    req.user.save(function () {
        fsExtra.emptyDirSync(__dirname + '/uploads')
        res.redirect("/profile");
    });
})

app.post("/menu", function (req, res) {
    req.user.cart = req.body.mycart;
    req.user.cartTotal = req.body.cartTotal;
    req.user.save();
    res.redirect("/menu");
})

app.post("/checkout", function (req, res) {

    if (req.body.name) {
        req.user.name = _.capitalize(req.body.name);
    }
    if (!req.user.address.length) {
        req.user.address.push(req.body.address);
    }

    const order = new Order({
        address: req.body.address,
        name: req.user.name,
        orderItems: req.user.cart,
        date: new Date(),
        orderTotal: req.user.cartTotal,
    });

    req.user.orders.push(order);
    req.user.cart = [];
    req.user.cartTotal = 0;
    conf_info = "true";


    req.user.save(function (err) {
        if (err) {
            console.log(err);
            conf_info = "false";
        }

        res.render("checkout", {
            cart: req.user.cart,
            total: req.user.cartTotal,
            message: conf_info,
            name: req.user.name,
            address: req.user.address,
        });
    });
})

app.post("/reservation", function (req, res) {

    if (req.body.name) {
        req.user.name = _.capitalize(req.body.name);
    }

    var date = req.body.date;
    var people = req.body.no_of_people;

    const reservation = new Reserve({
        name: req.user.name,
        phoneNo: req.body.number,
        date: date + "T" + req.body.time + "+05:30",
        people: people,
    })

    conf_info = "true";

    req.user.reservations.push(reservation);

    req.user.save(function (err) {
        if (err) {
            console.log(err);
            conf_info = "false";
        }
        res.render("reservation", {
            name: req.user.name,
            message: conf_info,
        });
    });

})

// Server Hosting
app.listen(3000, function () {
    console.log("server started");
})