var express = require("express");
var router = express.Router({mergeParams : true});
var Campground = require("../models/campgrounds");
var Comment    = require("../models/comment");
var middlewareObj = require("../middleware");

//ADDING A NEW COMMENT
router.get("/new", middlewareObj.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

//POST ROUTE TO COMMENT
router.post("/", middlewareObj.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();

                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "comment added!");
                    res.redirect("/campgrounds/"+req.params.id);
                }
            });
        }
    });
});

//EDITING COMMENT
router.get("/:comment_id/edit", middlewareObj.checkCommentAuthority,function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment not found");
                res.redirect("/campgrounds");
            } else {
                res.render("comments/edit",{comment : foundComment, campground_id : req.params.id});
            }
        });
    });
});

//UPDATING COMMENT
router.put("/:comment_id", middlewareObj.checkCommentAuthority, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("/campgrounds");
        }else{
            req.flash("success", "comment updated!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DELETEING COMMENT
router.delete("/:comment_id", middlewareObj.checkCommentAuthority, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Comment deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//EXPORT
module.exports = router;