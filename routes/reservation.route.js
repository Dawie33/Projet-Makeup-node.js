const express = require('express');
const resaController = require('../controllers/reservation.controller');
const router = express.Router();
const authValidator = require('../utils/auth');


router.route('/')
    .get(authValidator.isAuth(),async (req, res) => {
        const reservation = await resaController.getAll(req.auth);
       
        if (!reservation) {
            res.status(404).json();
        } 
            res.status(200).json(reservation);
        
    })
// j'utilise la méthode HTTP PUT
// je limite la possibilité de modifier uniquement aux personnes authentifiées grâce à mon middleware isAuth
    .put(authValidator.isAuth(),async (req, res) => {
// j'appelle la fonction add définie dans mon controller en premier parametre je récupère les données saisies dans le body et en second l'id de l'utilisateur
        const new_reservation = await resaController.add(req.body,req.auth.id);
        if (!new_reservation) {
            res.status(404).json();
        }
        // je renvoi statut 201 créé 
        res.status(201).json(new_reservation);
    })
;

router.route('/:id')
    .get(authValidator.isAdmin(),async (req, res) => {
        const reservation = await resaController.getById(req.params.id);
        if (req.auth.roles != "admin" ) {
            res.status(403).json({message: "ce n'est pas votre réservation"});
        } else if (!reservation) {
            res.status(404).json();
        } else {
            res.status(200).json(reservation);
        }
    })
// j'utilise la méthode HTTP Patch
// je limite la possibilité de modifier uniquement aux administrateurs grâce à mon middleware isAdmin
    .patch(authValidator.isAdmin(),async (req, res) => {
        // j'appelle la fonction update définie dans mon controller en premier parametre je récupère l'id en 2nd les données saisies dans le body
        const reservation = await resaController.update(req.params.id, req.body);
        // si pas de réservation je renvoie un statut erreur not found
        if (!reservation) {
            res.status(404).json();
        }
        // sinon statut 202 accepté
        res.status(202).json(reservation);
    })

    .delete(authValidator.isAdmin(),async (req, res) => {
        const reservation = await resaController.remove(req.params.id);
        if (!reservation) {
            res.status(404).json();
        }
        res.status(202).json();
    })
;

module.exports = router;