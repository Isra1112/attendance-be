const axios = require('axios');
const jwt = require('jsonwebtoken');

const tokenValidation = async (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization) {
        if (authorization.startsWith("Bearer ")) {
            const token = authorization.slice(7, authorization.length);
            // const result = await axios.get(`http://ec2-18-136-210-143.ap-southeast-1.compute.amazonaws.com:3333/token/validate?t=${token}`);
            // if (result.data.status === "Token Valid") {
            //     next();
            // } else {
            //     res.sendStatus(401);
            // }
            jwt.verify(token, "secss", (err, decoded) => {
                if (err) {
                    res.sendStatus(401)
                } else {
                    if (Date.now >= decoded.exp * 1000) {
                        res.sendStatus(401);
                    } else {
                        next();
                    }
                }
            })
        }
    } else {
        res.sendStatus(401);
    }
};

module.exports = tokenValidation;
