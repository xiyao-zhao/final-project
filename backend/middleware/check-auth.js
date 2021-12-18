// A. Check if there's a token attached with the request
// B. Check if the token is valid
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    //// One way to get token:
    // const token = req.query.auth
    //// Another way:
    // const token = req.headers.authorization.split(" ")[1];
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "secret_this_should_be_longer");
        next();
    } catch (error) {
        res.status(401).json({ message: "Auth failed!" });
    }
};