
const db = require('../utils/db');


const getAll = async (auth) => {

    if (auth.roles == 'admin') {
    const [response, err] = await db.query("SELECT * FROM reservations");
    const reservations = [];
        for (let reservation of response) {
            reservation.users = await findUsersById(reservation.id);
            reservations.push(reservation);
        }
        return reservations; 
        
    } else {
        const [response, err] = await db.query("SELECT name, first_name, prestation,date,adress,people_number, description  FROM reservations WHERE id_users = ?", [auth.id]);
        const reservations = [];
        for (let reservation of response) {
            reservation.users = await findUsersById(reservation.id);
            reservations.push(reservation);
        }
        return reservations;
    }
};

const getById = async (id) => {

    const [reservation, err] = await db.query("SELECT * FROM reservations WHERE id = ?", [id]);
    if (!reservation || reservation.length == 0) {
        return null;
    }
    return reservation[0];
};

const add = async (data, id_users) => {
    // jutilise la requête SQL insert into pour insérer les données dans la table réservation 
    // la constante db me permet de récupérer toute les données de connexion à ma BDD
    const [req, err] = await db.query("INSERT INTO reservations ( name, first_name,prestation,date,adress,people_number, description, id_users ) VALUES (?,?,?,?,?,?,?,?)", 
    [data.name,data.first_name, data.prestation, data.date, data.adress, data.people_number, data.description,id_users]);
    if (!req) {
        return null;
    }
     // Une fois la résa ajoutée en base, j'appelle getById qui permet d'aller
    // récupérer en base la résa nouvellement créée, sans réécrire la fonction "SELECT * FROM reservations"
    return getById(req.insertId);

};

// permet à l'administrateur de modifier une reservation
const update = async (id, data) => {
    // je récupère ma réservation par son id en utilisant la fonction getById, fonction qui utilise la requête SQL "SELECT * FROM reservations WHERE id = ?"   
    const reservation = await getById(id);
    if (!reservation) {
        return null;
    } else {
        // jutilise la requête SQL UPDATE pour modifier les champs 
        // la constante db me permet de récupérer toute les données de connexion à ma BDD
        const [req, err] = await db.query("UPDATE reservations SET name=?, first_name=?,prestation=?, date = ?, adress = ?, people_number=?, description=?  WHERE id = ? LIMIT 1", 
        [
        // j'ulise le 'ou' pour indiquer que la modification de tous les champs n'est pas obligatoire. par exemple soit je modifie la donnée date ou bien je conserve la donnée date et je modifie un autre champs.
            data.name || reservation.name,
            data.first_name || reservation.first_name,
            data.prestation || reservation.prestation,
            data.date || reservation.date, 
            data.adress || reservation.adress, 
            data.people_number || reservation.people_number, 
            data.description|| reservation.description, 
            id
        ]);
       
        if (!req) {
            return null;
        }
        // Finalement, on retourne la réservation modifiée
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
    const [ids_users, err] = await db.query("SELECT id_users FROM reservations WHERE id = ?", [id]);
    const users = [];

    for (let use of ids_users) {
        const user = await userController.getById(use.id_users);
        users.push(user);
    }
    return users;
};

module.exports = {
    getAll,
    getById,
    add,
    update,
    remove,
   
    
};