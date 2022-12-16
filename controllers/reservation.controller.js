const bcrypt = require('bcrypt');
const db = require('../utils/db');



// la fonction getall permet de visualiser toute les reservations
const getAll = async (auth) => {

    if (auth.roles == 'admin') {
    const [response, err] = await db.query("SELECT name, first_name, prestation,date,adress,people_number, event email FROM reservations");
    const reservations = [];
        for (let reservation of response) {
            reservation.users = await findUsersById(reservation.id);
            reservations.push(reservation);
        }
        return reservations; 
        
    } else {
        const [response, err] = await db.query("SELECT name, first_name, prestation,date,adress,people_number, event email  FROM reservations WHERE id_users = ?", [auth.id]);
        const reservations = [];
        for (let reservation of response) {
            reservation.users = await findUsersById(reservation.id);
            reservations.push(reservation);
        }
        return reservations;
    }
};


// la fonction getbyid permet de visualiser les reservations par son ID
const getById = async (id) => {
    const [reservation, err] = await db.query("SELECT * FROM reservations WHERE id = ?", [id]);
    if (!reservation || reservation.length == 0) {
        return null;
    }
  
    return reservation[0];
};
// fonction add pour ajouter une reservation
const add = async (data, id_users) => {

    const [req, err] = await db.query("INSERT INTO reservations ( name, first_name,prestation,date,adress,people_number, event, id_users ) VALUES (?,?,?,?,?,?,?,?)", 
    [data.name,data.first_name, data.prestation, data.date, data.adress, data.people_number, data.event,id_users]);
    if (!req) {
        return null;
    // } else {
    //     for (let prestation of data.prestations) {
    //         const [reqPrestation, err] = await db.query("INSERT INTO reserver (id_prestations, id_reservations) VALUES (?, ?)", [req.insertId, prestation]);
    //     }
    }
    return getById(req.insertId);

};

// permet à l'administrateur de modifier une presatation
const update = async (id, data) => {
   
    const reservation = await getById(id);
    if (!reservation) {
        return null;
    } else {
        let password;
        
        if (data.password) {
            password = await bcrypt.hash(data.password, 10);
        } else {
            password = reservation.password;
        }
        const [req, err] = await db.query("UPDATE reservations SET name=?, first_name=?,date = ?, adress = ?, people_number=?, event=?  WHERE id = ? LIMIT 1", 
        [
            data.name || reservation.name,
            data.first_name || reservation.first_name,
            data.date || reservation.date, 
            data.adress || reservation.adress, 
            data.people_number || reservation.people_number, 
            data.event|| reservation.event, 
            
            id
        ]);
        if (data.prestations) {
            const [reqDelete, err] = await db.query("DELETE FROM reserver WHERE id_reservations = ?", [id]);
            if (reqDelete) {
                for (let prestation of data.prestations) {
                    const [reqPrestation, err] = await db.query("INSERT INTO reserver (id_reservations, id_prestations) VALUES (?, ?)", [id, prestation]);
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
    const [req, err] = await db.query("DELETE FROM reservations WHERE id = ? LIMIT 1", [id]);
   
    if (!req) {
        return false;
    }
    return true;
};

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