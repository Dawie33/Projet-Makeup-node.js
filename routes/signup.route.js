
const express = require('express');
const jwt = require('jsonwebtoken');
const userController = require('../controllers/user.controller');
const signSchema = require('../models/sign');
const validator = require('../utils/validator');
const config = require('../config');


const router = express.Router();

router.route('/')
    .post(validator(signSchema), async (req, res) => {
        const user = await userController.getByEmail(req.body);
        if (user) {
            res.status(400).json({message: "Un compte avec cet email existe déjà"});
        } else {
            const new_user = await userController.add(req.body);
            
            const token = jwt.sign({
                id: new_user.id,
                email: new_user.email,
                roles: new_user.roles
            }, config.jwtPass, { expiresIn: config.jwtExpireLength });
    
            res.json({
                access_token: token
            });
        }
    })
;
module.exports = router;