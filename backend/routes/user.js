const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const router = express.Router();

router.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash,
                role: req.body.role
            });
        user.save()
            .then(result => {
                res.status(201).json({
                    message: 'User created!',
                    result: result
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    message: "Invalid authentication credentials!"
                });
            });
    })
});

router.post("/login", (req, res, next) => {
    let fetchedUser;
    // if email exists
    User.findOne({ email: req.body.email })
        .then(user => {
            // check if user exists
            if (!user) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            } 
            fetchedUser = user;
            // compare password
            return bcrypt.compare(req.body.password, user.password); 
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            // if password match, create a new token based on input data of your choice
            const token = jwt.sign(
                { email: fetchedUser.email, userId: fetchedUser._id }, 
                "secret_this_should_be_longer", 
                { expiresIn: "1h" }
            );
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                user: fetchedUser,
                userId: fetchedUser._id
            });
        })
        .catch(err => {
            return res.status(401).json({
                message: "Invalid authentication credentials!"
            });
        })
})

module.exports = router;