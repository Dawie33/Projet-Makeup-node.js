
const db = require('../utils/db');

// la fonction getall permet de visualiser toute les prestations
const getAll = async () => {
    const [prestations, err] = await db.query("SELECT * FROM prestations");
    return prestations;
};
// la fonction getbyid permet de visualiser les prestations par son ID
const getById = async (id) => {
    const [prestation, err] = await db.query("SELECT * FROM prestations WHERE id = ?", [id]);
    if (!prestation || prestation.length == 0) {
        return null;
    }
  
    return prestation[0];
};
 // Une fois un user ajouté en base, on appelle la fonction getById, créée plus haut, qui permet d'aller
    // récupérer en base le user nouvellement créé, sans réécrire la fonction "SELECT * FROM users"
const add = async (data) => {

    const [req, err] = await db.query("INSERT INTO prestations ( name, duration, price, max_people_number,description,image) VALUES (?,?,?,?,?,?)", 
    [data.name, data.duration, data.price, data.max_people_number, data.description,data.image]);
    if (!req) {
        return null;
    }
    
    return getById(req.insertId);

};

// permet à l'administrateur de modifier une presatation
// Pour update, on va d'abord chercher en base le user correspondant
const update = async (id, data) => {
   
    const prestation = await getById(id);
    if (!prestation) {
        return null;
    } else {
       // On met à jour, en réécrivant les champs potentiellement manquant, grace au user récupéré
        const [req, err] = await db.query("UPDATE prestations SET name = ?, duration = ?, price=?, max_people_number=?, description=?, image=? WHERE id = ? LIMIT 1", 
        [
            data.name || prestation.name, 
            data.duration || prestation.duration, 
            data.price || prestation.price, 
            data.max_people_number || prestation.max_people_number, 
            data.description || prestation.description,
            data.image || prestation.image,
            id
        ]);
        if (!req) {
            return null;
        }
        // Finalement, on retourne le user modifié
        return getById(id);
    } 
};
// permet de supprimer une prestation
const remove = async (id) => {
    const [req, err] = await db.query("DELETE FROM prestations WHERE id = ? LIMIT 1", [id]);
   
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