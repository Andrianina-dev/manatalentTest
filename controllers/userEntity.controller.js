const userEntityModel = require('../models/userEntity.model');

// ➕ CREATE
exports.create = async (req, res) => {
  const { user_id, entity_id } = req.body;
  if (!user_id || !entity_id) {
    return res.status(400).json({ error: 'user_id et entity_id sont requis' });
  }

  try {
    const result = await userEntityModel.createUserEntity({ user_id, entity_id });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la création', details: err.message });
  }
};

// 📥 READ ALL
exports.findAll = async (req, res) => {
  try {
    const results = await userEntityModel.getAllUserEntities();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Erreur récupération', details: err.message });
  }
};

// 📥 READ BY ID
exports.findById = async (req, res) => {
  try {
    const result = await userEntityModel.getUserEntityById(req.params.id);
    if (!result) return res.status(404).json({ error: 'Association non trouvée' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erreur récupération', details: err.message });
  }
};

// ✏️ UPDATE
exports.update = async (req, res) => {
    const { user_id, entity_id } = req.body;
    const updateData = {};
  
    // Vérifier qu'au moins un des champs est présent
    if (user_id === undefined && entity_id === undefined) {
      return res.status(400).json({ error: 'Au moins user_id ou entity_id doit être fourni' });
    }
  
    // Ajouter seulement les champs qui sont présents
    if (user_id !== undefined) {
      updateData.user_id = user_id;
    }
    if (entity_id !== undefined) {
      updateData.entity_id = entity_id;
    }
  
    try {
      const result = await userEntityModel.updateUserEntity(req.params.id, updateData);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: 'Erreur mise à jour', details: err.message });
    }
  };

// ❌ DELETE
exports.remove = async (req, res) => {
  try {
    await userEntityModel.deleteUserEntity(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Erreur suppression', details: err.message });
  }
};
