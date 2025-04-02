const entityModel = require('../models/entity.model');

// ➕ CREATE
exports.create = async (req, res) => {
  try {
    const fields = ['name', 'createdAt']; // Ajout du champ createdAt
    const values = [req.body.name, new Date()]; // Date actuelle en JavaScript
    
    const optional = ['description', 'siret', 'keyLicence', 'website'];

    optional.forEach(field => {
      if (req.body[field] !== undefined) {
        fields.push(field);
        values.push(req.body[field]);
      }
    });

    const entity = await entityModel.createEntity(fields, values);
    res.status(201).json(entity);
  } catch (err) {
    res.status(500).json({ 
      error: 'Erreur création', 
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// 📥 READ ALL
exports.findAll = async (req, res) => {
  try {
    const rows = await entityModel.getAllEntities();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur récupération', details: err.message });
  }
};

// 📥 READ BY ID
exports.findById = async (req, res) => {
  try {
    const entity = await entityModel.getEntityById(req.params.id);
    if (!entity) {
      return res.status(404).json({ error: 'Entité non trouvée' });
    }
    res.json(entity);
  } catch (err) {
    res.status(500).json({ error: 'Erreur récupération', details: err.message });
  }
};

// ✏️ UPDATE
exports.update = async (req, res) => {
  try {
    // 1. Vérifier que l'entité existe
    const exists = await entityModel.checkEntityExists(req.params.id);
    if (!exists) {
      return res.status(404).json({ error: 'Entité non trouvée' });
    }

    // 2. Définir les champs modifiables
    const allowedFields = ['name', 'description', 'website'];
    const updateData = {};

    // 3. Filtrer les champs autorisés
    Object.keys(req.body).forEach(field => {
      if (allowedFields.includes(field)) {
        updateData[field] = req.body[field];
      }
    });

    // 4. Vérifier qu'au moins un champ valide est fourni
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'Aucun champ valide fourni pour mise à jour' });
    }

    // 5. Appeler le modèle avec seulement les champs autorisés
    const updated = await entityModel.updateEntity(updateData, req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Erreur mise à jour', details: err.message });
  }
};

// ❌ DELETE
exports.remove = async (req, res) => {
  try {
    const exists = await entityModel.checkEntityExists(req.params.id);
    if (!exists) {
      return res.status(404).json({ error: 'Entité non trouvée' });
    }

    await entityModel.deleteEntity(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Erreur suppression', details: err.message });
  }
};
