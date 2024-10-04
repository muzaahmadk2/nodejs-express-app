const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDbSession = require("connect-mongodb-session")(session);
const csrf = require("csurf");

const errorController = require("./controllers/error");

const app = express();
const store = new MongoDbSession({
  uri: "mongodb+srv://muzammil176:Muzammil%40176@cluster0.wsqbt.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0",
  collection: "session",
});

const csrfProtection = csrf();

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

app.use(csrfProtection);

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

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
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
    app.listen(3001);
  });
