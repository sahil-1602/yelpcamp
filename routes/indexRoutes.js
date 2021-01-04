var express = require("express");
var router = express.Router();
var passport = require("passport");

//HOME PAGE
router.get("/", function(req, res){
    res.render("home");
});

//SIGNUP PAGE
router.get("/register", function(req, res){
    res.render("register");
});

//SIGNUP LOGIC
router.post("/register", function(req, res){
    var newUser = new User({username : req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//LOGIN PAGE
router.get("/login", function(req, res){
    res.render("login");
});

//LOGIN LOGIC
router.post("/login", passport.authenticate("local",
    {   
        successRedirect : "/campgrounds",
        failureRedirect : "/login"
    }),function(req, res){
});

//LOGOUT
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});


//MIDDLEWARE
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//EXPORTS
module.exports = router;