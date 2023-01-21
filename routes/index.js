const express = require('express');

const userRoute = require('./user.route');
const prestationRoute = require('./prestation.route')
const authRoute = require('./auth.route');
const signRoute = require('./signup.route');
const resaRoute = require ('./reservation.route');
const contactRoute = require ('./contact.route');

const router = express.Router();

router.use('/users', userRoute);
router.use('/login', authRoute);
router.use('/signup',signRoute);
router.use('/prestations',prestationRoute);
router.use('/reservations',resaRoute);
router.use('/contacts',contactRoute);

module.exports = router;