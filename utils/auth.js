const config = require('../config');
const jwt = require('jsonwebtoken');

const isAuth = () => {
    return (req, res, next) => {
     
        const header = req.headers.authorization;
        
        if (!header) {
            res.status(401).json({message: "Vous devez être connecté"});
        }

        const access_token = header.split(" ")[1];

      
        jwt.verify(access_token, config.jwtPass, (err, decodedToken) => {
            if (err) {
                res.status(401).json({message: "JWT invalide"});
            } else {

                req.auth = decodedToken;
                
                next();
            }
        });
    }
};

const isAdmin = () => {
    return (req, res, next) => {
        const header = req.headers.authorization;
        
        if (!header) {
            res.status(401).json({message: "Vous devez être connecté"});
        }

        const access_token = header.split(" ")[1];


        jwt.verify(access_token, config.jwtPass, (err, decodedToken) => {
            if (err) {
                res.status(401).json({message: "JWT invalide"});
            } else if (decodedToken.roles == 'admin') {
                req.auth = decodedToken;
                next();
            } else {
                res.status(401).json({message: "Vous devez être administrateur"});
            }
        });
    }
};

module.exports = {
    isAuth,
    isAdmin
};