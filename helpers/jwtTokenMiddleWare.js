const jwt = require('jsonwebtoken');
const { jwtSecretKey } = require('../config');

module.exports = {
    jwtMiddleware : (req,res,next) => {
        if (req.method !== "OPTIONS") {
            // let success = true;
            jwt.verify(req.body.token, jwtSecretKey, (error, decoded) => {
                if (error) {
                    // success = false;
                    throw error
                }
           
                req.user =decoded;
                if(req.body.username != decoded.username){
                    return res.status(500).json({ error: true, message:"jwt tidak valid, username tidak sama",data:decoded,jwt:req.body.token});
                }
                if(req.body.id != decoded.id){
                    return res.status(500).json({ error: true, message:"jwt tidak valid, id user berbeda",data:decoded,jwt:req.body.token});
                }
                next();
            });
        } else {
            next();
        }
    }
}