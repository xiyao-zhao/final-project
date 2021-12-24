const express = require("express");
const multer = require("multer");

const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const MEDIA_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MEDIA_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type")
        if (isValid) {
            error = null;
        }
        cb(error, "backend/images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const extension = MEDIA_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + extension);
    }
});

router.post(
    "", 
    checkAuth,
    multer({storage: storage}).single("image"), 
    (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({ 
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: 'Post added successfully',
            post: {
                ...createdPost,
                id: createdPost._id
            }
        });
    })
    .catch(error => {
        res.status(500).json({
            message: 'Creating a post faiiled!'
        });
    });
});

router.put(
    "/:id", 
    checkAuth,
    multer({storage: storage}).single("image"), 
    (req, res, next) => {
    let imagePath;
    // if return true, it means it's not a string, a new file was uploaded
    if (req.file) {
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename
    } else {
        imagePath = req.body.imagePath
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    Post.updateOne(
        { _id: req.params.id, creator: req.userData.userId }, 
        post
    ).then(result => {
        if (result.matchedCount > 0) {
            res.status(200).json({ message: "Update successful!" });
        } else {
            res.status(401).json({ message: "Not authorized!" });
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "Couldn't update post!"
        })
    })
})

router.get("", (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    postQuery
        .then(documents => {
            fetchedPosts = documents;
            return Post.count();
        })
        .then(count => {
            res.status(200).json({
                message: "Posts fetched successfully!",
                posts: fetchedPosts,
                myPosts: count
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching posts failed"
            })
        })
});

router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'Post not found!' });
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "Fetching post failed"
        })
    })
})

router.delete("/:id", checkAuth, (req, res, next) => {
    if (req.userData.role === "Admin") {
        Post.deleteOne({ _id: req.params.id })
        .then(result => {
            if (result.deletedCount > 0) {
                res.status(200).json({ message: "Deletion successful!" });
            } else {
                res.status(401).json({ message: "Not authorized!" });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching posts failed"
            })
        })
    } else {
        Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
        .then(result => {
            if (result.deletedCount > 0) {
                res.status(200).json({ message: "Deletion successful!" });
            } else {
                res.status(401).json({ message: "Not authorized!" });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching posts failed"
            })
        })
    } 
});

module.exports = router;