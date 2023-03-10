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
        // je lis le header
        const header = req.headers.authorization;
        
        if (!header) {
            res.status(401).json({message: "Vous devez être connecté"});
        }

        const access_token = header.split(" ")[1];
        // Le header doit être de la forme :"Authorization: Bearer {token}"

        // Je vérifie si le token est toujours valide, et si c'est mon serveur qui l'a signé (grace au mot de passe jwt dans le config.json)

        jwt.verify(access_token, config.jwtPass, (err, decodedToken) => {
            if (err) {
                res.status(401).json({message: "JWT invalide"});
            } else if (decodedToken.roles == 'admin') {
                // je rajoute le token décodé (i.e. les données de l'utilisateur) dans la requete
                req.auth = decodedToken;
                 // Je valide que si le user a le role "admin" dans son token
                next();
                   // next = je permet de passer a la suite de la requete
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