//All the middleware
const middlewareObj = {};
const Campground = require("../models/campground");
const Comment = require("../models/comment");

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err || !foundCampground) {
        req.flash("error", "Oops, that didn't work!");
        res.redirect("back");
      } else {
        //is the user authorized
        if (
          foundCampground.author.id.equals(req.user._id) ||
          req.user.isAdmin
        ) {
          next();
        } else {
          req.flash("error", "You do not have permission to do that!");
          res.redirect(`/campgrounds/${req.params.id}`);
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that!");
    res.redirect(`/campgrounds/${req.params.id}`);
  }
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err || !foundComment) {
        req.flash("error", "Oops, something went wrong!");
        res.redirect(`/campgrounds/${req.params.id}`);
      } else {
        //is the user authorized
        if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
          req.flash("error", "You do not have permission to do that!");
          res.redirect(`/campgrounds/${req.params.id}`);
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in to do that!");
  res.redirect("/login");
};

module.exports = middlewareObj;
