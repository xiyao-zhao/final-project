const express = require("express");

const User = require("../models/user");

const router = express.Router();

router.get("/adminHome", (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const userQuery = User.find();
    let fetchedUsers;
    if (pageSize && currentPage) {
        userQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    userQuery
        .then(documents => {
            fetchedUsers = documents;
            return User.count();
        })
        .then(count => {
            res.status(200).json({
                message: "Users fetched successfully!",
                users: fetchedUsers,
                total: count
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching users failed"
            })
        })
});

router.get("/adminHome/:email", (req, res, next) => {
    User.findById(req.params.email).then(user => {
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found!' });
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "Fetching user failed"
        })
    })
})

router.delete("/adminHome/:email", (req, res, next) => {
    User.deleteOne({ email: req.params.email })
    .then(result => {
        if (result.deletedCount > 0) {
            res.status(200).json({ message: "Deletion successful!" });
        } else {
            res.status(401).json({ message: "Not authorized!" });
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "Fetching users failed"
        })
    })
});

module.exports = router;