const app = require("express")(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  Campground = require("./models/campground"),
  seedDB = require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost/yelp_camp", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

//SCHEMA SETUP

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//Landing page
app.get("/", (req, res) => {
  res.render("landing");
});

//Index
app.get("/campgrounds", (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { campgrounds: campgrounds });
    }
  });
});

app.post("/campgrounds", (req, res) => {
  const newCampground = {
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
  };

  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

//NEW ROUTE FORM
app.get("/campgrounds/new", (req, res) => {
  res.render("new");
});

//SHOW ROUTE
app.get("/campgrounds/:id", (req, res) => {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err);
      } else {
        res.render("show", { campground: foundCampground });
      }
    });
});

app.listen(3000, () => console.log("Listening on port 3000"));
