const pool = require('../config/db');

// ➕ CREATE
exports.createUserEntity = async ({ user_id, entity_id }) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      'INSERT INTO userEntity (user_id, entity_id) VALUES (?, ?)',
      [user_id, entity_id]
    );
    const [data] = await connection.execute(
      'SELECT * FROM userEntity WHERE id = ?',
      [result.insertId]
    );
    return data[0];
  } finally {
    connection.release();
  }
};

// 📥 READ ALL
exports.getAllUserEntities = async () => {
  const connection = await pool.getConnection();
  const [rows] = await connection.execute('SELECT * FROM userEntity');
  connection.release();
  return rows;
};

// 📥 READ BY ID
exports.getUserEntityById = async (id) => {
  const connection = await pool.getConnection();
  const [rows] = await connection.execute('SELECT * FROM userEntity WHERE id = ?', [id]);
  connection.release();
  return rows[0];
};

// ✏️ UPDATE

exports.updateUserEntity = async (id, data) => {
    const connection = await pool.getConnection();
    try {
      // Construction dynamique de la requête SQL
      const setClauses = [];
      const params = [];
      
      if (data.user_id !== undefined) {
        setClauses.push('user_id = ?');
        params.push(data.user_id);
      }
      
      if (data.entity_id !== undefined) {
        setClauses.push('entity_id = ?');
        params.push(data.entity_id);
      }
      
      // Si aucun champ à mettre à jour
      if (setClauses.length === 0) {
        throw new Error('Aucun champ à mettre à jour');
      }
      
      const query = `UPDATE userentity SET ${setClauses.join(', ')} WHERE id = ?`;
      params.push(id);
      
      await connection.execute(query, params);
      
      // Récupération de l'entité mise à jour
      const [updated] = await connection.execute('SELECT * FROM userEntity WHERE id = ?', [id]);
      return updated[0];
    } finally {
      connection.release();
    }
  };

// ❌ DELETE
exports.deleteUserEntity = async (id) => {
  const connection = await pool.getConnection();
  await connection.execute('DELETE FROM userEntity WHERE id = ?', [id]);
  connection.release();
};
