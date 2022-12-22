
const db = require('../utils/db');
const userController = require ('../controllers/user.controller')


// // la fonction getall permet à l'administrateur de visualiser tous les contacts mais le user peut voir uniquement ses contacts
const getAll = async () => {
    // si admin on renvoi un tableau avec les contacts et les utilisateurs associés au contact
   
     const [contacts, err] = await db.query("SELECT * FROM contacts");
     return contacts;
       
  
};


// la fonction getbyid permet de visualiser les contacts par son ID
const getById = async (id) => {
    const [contact, err] = await db.query("SELECT * FROM contacts WHERE id = ?", [id]);
    if (!contact || contact.length == 0) {
        return null;
    }
  
    return contact[0];
};
// fonction add pour ajouter une contact
const add = async (data) => {

    const [req, err] = await db.query("INSERT INTO contacts (first_name,name,telephone,email,description) VALUES (?,?,?,?,?)", 
    [data.first_name, data.name,data.telephone,data.email,data.description]);
    if (!req) {
        return null;
    } 
    
    return getById(req.insertId);

};

// permet à l'administrateur de modifier une presatation
const update = async (id, data) => {
   
    const contact = await getById(id);
    if (!contact) {
        return null;

    } else {
  
    const [req, err] = await db.query("UPDATE contacts SET first_name = ?, name = ?, telephone =? ,email =?,description=? WHERE id = ? LIMIT 1", 
    [
        data.first_name || contact.first_name,
        data.name || contact.name,
        data.description || contact.description, 
        date.telephone || contact.telephone, 
        date.email || contact.email, 
        id
    ]);
   
    if (!req) {
        return null;
    }
    return getById(id);
    } 
};

const remove = async (id) => {
    const [req, err] = await db.query("DELETE FROM contacts WHERE id = ? LIMIT 1", [id]);
   
    if (!req) {
        return false;
    }
    return true;
};

// On exporte toutes les fonctions écrites ici
module.exports = {
    getAll,
    getById,
    add,
    update,
    remove,
    
};