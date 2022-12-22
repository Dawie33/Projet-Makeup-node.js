const express = require('express');
const contactController = require('../controllers/contact.controller');
const router = express.Router();
const authValidator = require('../utils/auth');

// tous le monde peut visualiser les contacts
router.route('/')
    .get(authValidator.isAdmin(),async (req, res) => {
        const contacts = await contactController.getAll(req.auth);
        if (!contacts) {
            res.status(404).json();
        }
        res.status(200).json(contacts);
    })

// l'ajouter de contacts est limité uniquement à l'admin
    .put(async (req, res) => {
        const new_contact = await contactController.add(req.body);
        if (!new_contact) {
            res.status(404).json();
        }
        res.status(201).json(new_contact);
    })

;


router.route('/:id')
    .get(authValidator.isAdmin(),async (req, res) => {
        const contact = await contactController.getById(req.params.id);
       
        if (!contact) {
            res.status(404).json();
        }
        res.status(200).json(contact);
    })
// la modification de contact est limité à l'admin 
    .patch(authValidator.isAdmin(),async (req, res) => {
        const contact = await contactController.update(req.params.id, req.body);
        if (!contact) {
            res.status(404).json();
        }
        res.status(202).json(contact);
    })
// la modification de contact est limité à l'admin 
    .delete(authValidator.isAdmin(),async (req, res) => {
        const contact = await contactController.remove(req.params.id);
        if (!contact) {
            res.status(404).json();
        }
        res.status(202).json();
    })
;




module.exports = router;