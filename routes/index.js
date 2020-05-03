const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

//Landing page
router.get("/", (req, res) => {
  res.render("landing");
});

//GET REGISTER FORM
router.get("/register", (req, res) => {
  res.render("register", { page: "register" });
});

//SIGNUP POST ROUTE
router.post("/register", (req, res) => {
  const newUser = new User({ username: req.body.username });
  if (req.body.adminCode === "admin123") {
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("register");
    }
    passport.authenticate("local")(req, res, () => {
      req.flash("success", `Welcome to YelpCamp ${user.username}`);
      res.redirect("/campgrounds");
    });
  });
});

//GET LOGIN FORM
router.get("/login", (req, res) => {
  res.render("login", { page: "login" });
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
  req.flash("success", "Logged out!");
  res.redirect("/campgrounds");
});

module.exports = router;
