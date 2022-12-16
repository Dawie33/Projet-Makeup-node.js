const express = require('express');
const resaController = require('../controllers/reservation.controller');
const router = express.Router();
const authValidator = require('../utils/auth');

// tous le monde peut visualiser les reservation
router.route('/')
    .get(authValidator.isAuth(),async (req, res) => {
        const reservation = await resaController.getAll(req.auth);
       
        if (!reservation) {
            res.status(404).json();
        } 
            res.status(200).json(reservation);
        
    })

// l'ajouter de reservation est limité uniquement à l'admin
    .put(authValidator.isAuth(),async (req, res) => {
        const new_reservation = await resaController.add(req.body,req.auth.id);
        if (!new_reservation) {
            res.status(404).json();
        }
        res.status(201).json(new_reservation);
    })

;


router.route('/:id')
    .get(authValidator.isAuth(),async (req, res) => {
        const reservation = await resaController.getById(req.params.id);
        if (req.auth.roles != "admin" ) {
            res.status(403).json({message: "ce n'est pas votre réservation"});
        } else if (!reservation) {
            res.status(404).json();
        } else {
            res.status(200).json(reservation);
        }
    })
// la modification de reservation est limité à l'admin 
    .patch(authValidator.isAdmin(),async (req, res) => {
        const reservation = await resaController.update(req.params.id, req.body);
        if (!reservation) {
            res.status(404).json();
        }
        res.status(202).json(reservation);
    })
// la modification de reservation est limité à l'admin 
    .delete(authValidator.isAdmin(),async (req, res) => {
        const reservation = await resaController.remove(req.params.id);
        if (!reservation) {
            res.status(404).json();
        }
        res.status(202).json();
    })
;




module.exports = router;