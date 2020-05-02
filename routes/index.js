const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

//Landing page
router.get("/", (req, res) => {
  res.render("landing");
});

//GET REGISTER FORM
router.get("/register", (req, res) => {
  res.render("register");
});

//SIGNUP POST ROUTE
router.post("/register", (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect("/campgrounds");
    });
  });
});

//GET LOGIN FORM
router.get("/login", (req, res) => {
  res.render("login");
});

//LOG IN POST ROUTE
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
  }),
  (req, res) => {}
);

//LOG OUT ROUTE
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/campgrounds");
});

module.exports = router;
