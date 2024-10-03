const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDbSession = require("connect-mongodb-session")(session);

const errorController = require("./controllers/error");

const app = express();
const store = new MongoDbSession({
  uri: "mongodb+srv://muzammil176:Muzammil%40176@cluster0.wsqbt.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0",
  collection: "session",
});

app.set("view engine", "ejs");
app.set("views", "views");

const mongoose = require("mongoose");
const User = require("./models/user");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

// db.execute("SELECT * FROM products")
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user; // now we can access the user schema with all its methods
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://muzammil176:Muzammil%40176@cluster0.wsqbt.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const newUser = new User({
          name: "Muz",
          email: "muz@test.com",
          cart: { items: [] },
        });
        newUser.save();
      }
    });
    app.listen(3001);
  });
