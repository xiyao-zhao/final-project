const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const path = require("path");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const { db } = require("./models/user");

const app = express();

mongoose
    .connect(
        "mongodb+srv://xiyao:6RK3sD8HJHxEMZs@cluster0.vnuz5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    )
    .then(() => {
        console.log('Connected to database!')
    })
    .catch(() => {
        console.log('Connection failed!')
    })
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Auth-Token"
    );
    res.setHeader(
        "Access-Control-Allow-Methods", 
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;