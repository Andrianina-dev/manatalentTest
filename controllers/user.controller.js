const userModel = require('../models/user.model');
const pool = require('../config/db');

// ➕ CREATE
exports.create = async (req, res) => {
  const { name, firstName, email, password } = req.body;

  if (!name || !firstName || !email || !password) {
    return res.status(400).json({ error: 'username, email et password sont requis' });
  }

  try {
    const user = await userModel.createUser({ name, firstName, email, password });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Erreur création', details: err.message });
  }
};

// 📥 READ ALL
exports.findAll = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Erreur récupération', details: err.message });
  }
};

// 📥 READ BY ID
exports.findById = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Erreur récupération', details: err.message });
  }
};


exports.checkEmailExists = async (email, excludeId = null) => {
    const connection = await pool.getConnection();
  
    try {
      let query = 'SELECT id FROM user WHERE email = ?';
      const params = [email];
  
      if (excludeId) {
        query += ' AND id != ?';
        params.push(excludeId);
      }
  
      const [rows] = await connection.execute(query, params);
      return rows.length > 0;
    } finally {
      connection.release();
    }
  };
  

// ✏️ UPDATE
exports.update = async (req, res) => {
    const { id } = req.params;
    const { name, firstName, email, password, language } = req.body;
  
    try {
        // 1. Vérification de l'existence de l'utilisateur
        const exists = await userModel.checkUserExists(id);
        if (!exists) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // 2. Préparation des champs à mettre à jour
        const updateFields = {};
        if (name) updateFields.name = name;
        if (firstName) updateFields.firstName = firstName;
        if (language) updateFields.language = language;
        
        // 3. Vérification de l'unicité de l'email
        if (email) {
            const emailExists = await userModel.checkEmailExists(email, id);
            if (emailExists) {
                return res.status(409).json({ error: 'Email déjà utilisé' });
            }
            updateFields.email = email;
        }

        // 4. Gestion du mot de passe (à hasher en production!)
        if (password) {
            updateFields.password = password; // À remplacer par un hash en production
        }

        // 5. Vérification qu'il y a bien des champs à mettre à jour
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ error: 'Aucun champ valide à mettre à jour' });
        }

        // 6. Mise à jour effective
        const updatedUser = await userModel.updateUser(updateFields, id);
        res.json(updatedUser);

    } catch (err) {
        console.error('Erreur lors de la mise à jour:', err);
        res.status(500).json({
            error: 'Erreur lors de la mise à jour',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};
  

// ❌ DELETE
exports.remove = async (req, res) => {
  try {
    const exists = await userModel.checkUserExists(req.params.id);
    if (!exists) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    await userModel.deleteUser(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Erreur suppression', details: err.message });
  }
};
