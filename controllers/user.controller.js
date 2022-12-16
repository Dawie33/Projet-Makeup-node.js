const bcrypt = require('bcrypt');
const db = require('../utils/db');

// la fonction getall permet de visualiser tous les utilisateurs
const getAll = async () => {
    const [users, err] = await db.query("SELECT first_name,name,telephone,adresse,email FROM users");
    return users;
};

const getById = async (id) => {
    const [user, err] = await db.query("SELECT first_name,name,adresse,email,telephone  FROM users WHERE id = ?", [id]);
    if (!user || user.length == 0) {
        return null;
    }
  
    return user[0];
};

const add = async (data) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const [req, err] = await db.query("INSERT INTO users ( first_name, name, adresse,telephone, email, password,roles, created_at) VALUES (?,?,?,?,?,?,?, NOW())", 
    [data.first_name, data.name,data.telephone, data.adresse, data.email, hashedPassword,'user']);
    if (!req) {
        return null;
    }
    
    return getById(req.insertId);

};

// permet à l'utilisateur de modifier son mot de passe 
const update = async (id, data) => {
   
    const user = await getById(id);
    if (!user) {
        return null;
    } else {
        let password;
        
        if (data.password) {
            password = await bcrypt.hash(data.password, 10);
        } else {
            password = user.password;
        }
        const [req, err] = await db.query("UPDATE users SET  email = ?, password = ? WHERE id = ? LIMIT 1", 
        [
            data.email || user.email,
          
            password, 
            id
        ]);
        if (!req) {
            return null;
        }
        return getById(id);
    } 
};

const remove = async (id) => {
    const [req, err] = await db.query("DELETE FROM users WHERE id = ? LIMIT 1", [id]);
   
    if (!req) {
        return false;
    }
    return true;
};

const getByEmailAndPassword = async (data) => {
    const user = await getByEmail(data);
    if (!user) { 
        return null;
    }

    const hashedPassword = await bcrypt.compare(data.password, user.password);
    
    if (hashedPassword) {
        return user; 
    } else {
        return null;
    }
}

const getByEmail = async (data) => {
    const [user, err] = await db.query("SELECT * FROM users WHERE email = ?", [data.email]);
    if (!user || user.length == 0) {
        return null;
    }
    return user[0];
}

// On exporte toutes les fonctions écrites ici
module.exports = {
    getAll,
    getById,
    add,
    update,
    remove,
    getByEmailAndPassword,
    getByEmail
};