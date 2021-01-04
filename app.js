var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    Campground            = require("./models/campgrounds"),
    Comment               = require("./models/comment");
    seedDB                = require("./seeds");
    User                  = require("./models/user"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    passport              = require("passport"),
    MethodOverride        = require("method-override"),
    flash                 = require("connect-flash");

//seedDB(); //seeding from db

//REQUIRING ROUTES
var indexRoutes       = require("./routes/indexRoutes"),
    campgroundRoutes  = require("./routes/campgroundRoutes"),
    commentRoutes     = require("./routes/commentRoutes");

//MONGOOSE SETUP
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true});

//APP CONFIG
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(flash());

app.use(require("express-session")({
    secret : "Sahil is going to be one of the best developers in the world",
    resave : false,
    saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error       = req.flash("error");
    res.locals.success     = req.flash("success");
    next();
});
app.use(MethodOverride("_method"));

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

//LISTENING
app.listen(8000,function(){
    console.log("Yelpcamp Server Has Started");
})

