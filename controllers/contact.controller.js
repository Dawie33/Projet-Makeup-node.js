
const db = require('../utils/db');
const userController = require ('../controllers/user.controller')


// // la fonction getall permet à l'administrateur de visualiser tous les contacts mais le user peut voir uniquement ses contacts
const getAll = async (auth) => {
    // si admin on renvoi un tableau avec les contacts et les utilisateurs associés au contact
    if (auth.roles == 'admin') {
        const [response, err] = await db.query("SELECT * FROM contacts");
        const contacts = [];
        for (let contact of response) {
            contact.users = await findUsersById(contact.id);
            contacts.push(contact);
        }
        return contacts;
    } else {
        const [response, err] = await db.query("SELECT * FROM contacts WHERE id_users = ?", [auth.id]);
        const contacts = [];
        for (let contact of response) {
            contact.users = await findUsersById(contact.id);
            contacts.push(contact);
        }
        return contacts;
    }
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
const add = async (data, id_users) => {

    const [req, err] = await db.query("INSERT INTO contacts (first_name,name,description,id_users) VALUES (?,?,?,?)", 
    [data.first_name, data.name,data.description,id_users]);
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
  
    const [req, err] = await db.query("UPDATE contacts SET first_name = ?, name = ?, description=? WHERE id = ? LIMIT 1", 
    [
        data.first_name || contact.first_name,
        data.name || contact.name,
        data.description || contact.description, 
        id
    ]);
    if (data.users) {
        const [reqDelete, err] = await db.query("DELETE FROM contact WHERE id_users = ?", [id]);
        if (reqDelete) {
            for (let user of data.users) {
                const [reqUSer, err] = await db.query("INSERT INTO contact (id, id_users) VALUES (?, ?)", [id, user]);
            }
        }
    }
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
// cette fonction permets de retrouver les données de l'utilisateurs qui à ajouté un contact.
const findUsersById = async (id) => {
    const [ids_users, err] = await db.query("SELECT id_users FROM contacts WHERE id = ?", [id]);
    const users = [];
    // pour chaque valeur des ids de users je selectionne l'id de l'utilisateur que je renvois
    for (let use of ids_users) {
        const user = await userController.getById(use.id_users);
        users.push(user);
    }
    return users;
};


// On exporte toutes les fonctions écrites ici
module.exports = {
    getAll,
    getById,
    add,
    update,
    remove,
    
};