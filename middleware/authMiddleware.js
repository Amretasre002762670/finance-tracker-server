require('dotenv').config();
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRETKEY;

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if(!token) return res.status(401).json({ message: 'Access Denied; Authorization Header missing' });

    const authToken = token.split(' ')[1];
    console.log(authToken, secretKey);
    if(!authToken) return res.status(401).json({ message: 'Access Denied; Token missing' });

    // once user is verified add it to req object so that while transaction is called the id can be taken from there
    try {
        const decode = jwt.verify(authToken, secretKey);
        console.log("\n");
        req.user = decode;
        console.log(req.user, " user in request")
        next();
    } catch (error) {
        console.log(error);
        return res.status(403).json({ message: 'Invalid Token'});
    }
    // jwt.verify(token, secretKey, (err, user) => {
    //     if (err) return res.status(403).json({ message: 'Invalid Token'});
    //     req.user = user;
    //     next();
    // })
}

module.exports = authenticateToken;