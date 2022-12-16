const express = require('express');
const prestationController = require('../controllers/prestation.controller');
const router = express.Router();
const authValidator = require('../utils/auth');

// tous le monde peut visualiser les prestations
router.route('/')
    .get(async (req, res) => {
        const prestations = await prestationController.getAll();
        if (!prestations) {
            res.status(404).json();
        }
        res.status(200).json(prestations);
    })

// l'ajouter de prestations est limité uniquement à l'admin
    .put(authValidator.isAdmin(),async (req, res) => {
        const new_prestation = await prestationController.add(req.body);
        if (!new_prestation) {
            res.status(404).json();
        }
        res.status(201).json(new_prestation);
    })

;


router.route('/:id')
    .get(async (req, res) => {
        const prestation = await prestationController.getById(req.params.id);
       
        if (!prestation) {
            res.status(404).json();
        }
        res.status(200).json(prestation);
    })
// la modification de prestation est limité à l'admin 
    .patch(authValidator.isAdmin(),async (req, res) => {
        const prestation = await prestationController.update(req.params.id, req.body);
        if (!prestation) {
            res.status(404).json();
        }
        res.status(202).json(prestation);
    })
// la modification de prestation est limité à l'admin 
    .delete(authValidator.isAdmin(),async (req, res) => {
        const prestation = await prestationController.remove(req.params.id);
        if (!prestation) {
            res.status(404).json();
        }
        res.status(202).json();
    })
;




module.exports = router;