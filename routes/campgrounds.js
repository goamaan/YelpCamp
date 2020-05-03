const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");
const NodeGeocoder = require("node-geocoder");

const options = {
  provider: "google",
  httpAdapter: "https",
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
};

const geocoder = NodeGeocoder(options);

//INDEX
router.get("/", (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {
        campgrounds: campgrounds,
        page: "campgrounds",
      });
    }
  });
});

router.post("/", middleware.isLoggedIn, (req, res) => {
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash("error", "Invalid address");
      return res.redirect("back");
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    const newCampground = {
      name: req.body.name,
      price: req.body.price,
      image: req.body.image,
      description: req.body.description,
      author: {
        id: req.user._id,
        username: req.user.username,
      },
      location: data[0].formattedAddress,
      lat: data[0].latitude,
      lng: data[0].longitude,
    };

    Campground.create(newCampground, (err, newlyCreated) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/campgrounds");
      }
    });
  });
});

//NEW ROUTE FORM
router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

//SHOW ROUTE
router.get("/:id", (req, res) => {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, foundCampground) => {
      if (err || !foundCampground) {
        req.flash("error", "Campground not found!");
        res.redirect("back");
      } else {
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      req.flash("error", "Could not find campground!");
      res.redirect("back");
    }
    res.render("campgrounds/edit", { campground: foundCampground });
  });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash("error", "Invalid address");
      return res.redirect("back");
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;

    Campground.findByIdAndUpdate(
      req.params.id,
      req.body.campground,
      (err, updatedCampground) => {
        if (err) {
          res.redirect("/campgrounds");
        } else {
          res.redirect(`/campgrounds/${req.params.id}`);
        }
      }
    );
  });
});

//DELETE CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
    if (err) {
      console.log(err);
    }
    Comment.deleteMany({ _id: { $in: campgroundRemoved.comments } }, (err) => {
      if (err) {
        console.log(err);
      }
      res.redirect("/campgrounds");
    });
  });
});

module.exports = router;
