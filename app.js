const app = require("express")(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

//SCHEMA SETUP
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
});

const Campground = mongoose.model("Campground", campgroundSchema);

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

// Campground.create(
//   {
//     name: "Granite Hill",
//     image:
//       "https://pixabay.com/get/57e1dd4a4350a514f1dc84609620367d1c3ed9e04e5074417d2d7fdd964fc7_340.jpg",
//     description:
//       "Starry night sky aoifsnesof asof aois fiose fo esaiofniosnfajsfoias fioa o",
//   },
//   (err, campground) => {
//     if (err) {
//       console.log(error);
//     } else {
//       console.log("Created new campground");
//       console.log(campground);
//     }
//   }
// );

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

app.get("/campgrounds/new", (req, res) => {
  res.render("new");
});

app.get("/campgrounds/:id", (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      res.render("show", { campground: foundCampground });
    }
  });
});

app.listen(3000, () => console.log("Listening on port 3000"));
