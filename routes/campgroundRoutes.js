var express =require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var MethodOverride = require("method-override");
var Comment    = require("../models/comment");
var middlewareObj = require("../middleware");

//CAMPGROUND STARTER PAGE
router.get("/", function(req, res){
    Campground.find({},function(err, campgrounds){
        if(err){
            console.log(err);
        } else {
            console.log(campgrounds);
            res.render("campgrounds/index",{campgrounds:campgrounds});
        }
    });
});

//CAMPGROUND POSTING
router.post("/", middlewareObj.isLoggedIn, function(req, res){
    var name   = req.body.name;
    var price  = req.body.price;
    var image  = req.body.image;
    var desc   = req.body.description;
    var author = {
        id : req.user._id,
        username : req.user.username
    }

    var newCamp = {name: name, price: price, image: image, description: desc, author:author};
    Campground.create(newCamp, function(err, newlyCamp){
        if(err){
            console.log(err);
        } else {
            console.log(newlyCamp);
        }
    })
    req.flash("success", "Campground created!");
    res.redirect("/campgrounds");

});

//ADDING A NEW CAMPGROUND
router.get("/new", middlewareObj.isLoggedIn, function(req, res){
    res.render("campgrounds/newCampsground");
});

//SHOWING THE ENTIRE CAMPGROUND DETAILS
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            res.render("campgrounds/show", {campground : foundCampground});
        }
    });
});

//EDITING THE CAMPGROUNDS
router.get("/:id/edit", middlewareObj.checkCampgroundAuthority, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", {campground : foundCampground});
        }
    });
});

//UPDATING THE CAMPGROUNDS
router.put("/:id", middlewareObj.checkCampgroundAuthority, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, foundCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Changes applied!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DELETING THE CAMPGROUND
router.delete("/:id", middlewareObj.checkCampgroundAuthority, function(req, res){
    // Campground.findById(req.params.id).populate("comments").exec(function(err, campground){
    //     for(var i=0; i<campground.comments.length; i++){
    //         campground.comments[i].findByIdAndRemove(comment.author.id, function(err){
    //             if(err){
    //                 console.log(err);
    //             } else {
    //                 console.log("comment deleted");
    //             }
    //         });
    //     }
    // });
    Campground.findByIdAndRemove(req.params.id).populate("comments").exec(function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground Deleted!");
            res.redirect("/campgrounds");
        }
    });
});

//EXPORTING
module.exports = router;