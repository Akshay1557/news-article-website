require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const User = require("./models/User");
const articleRoutes = require("./routes/articleRoutes");

const userRoutes = require("./routes/userRoutes");
const commentRoutes = require("./routes/commentRoutes");
const reactionRoutes = require("./routes/reactionRoutes");
const methodOverride = require("method-override");

const app = express();

// Middleware for parsing form data & JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallbacksecret",
    resave: false,
    saveUninitialized: false,
  })
);


app.use(passport.initialize());
app.use(passport.session());


// Passport Config (thanks to passport-local-mongoose)
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set EJS as template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));


app.use((req, res, next) => {
  res.locals.user = req.user; // available in all EJS templates
  next();
});

app.use(methodOverride("_method"));


// Routes
app.use("/articles", articleRoutes);
app.use("/users", userRoutes);
app.use(commentRoutes);
app.use("/", reactionRoutes);


app.get("/", (req, res) => {
    res.redirect("/articles");
});


module.exports = app;