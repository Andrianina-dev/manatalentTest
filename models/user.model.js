// const pool = require('../config/db');

const { getPool } = require('../config/db'); // ou le chemin vers ton fichier de connexion


exports.updateUser = async (updateFields, userId) => {
    const connection = await pool.getConnection();
    
    // Hashage du mot de passe si fourni
    if (updateFields.password) {
      updateFields.password = await bcrypt.hash(updateFields.password, 10);
    }
  
    // Construction dynamique de la requête
    const setClause = Object.keys(updateFields).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updateFields), userId];
  
    // Exécution de la mise à jour
    const [result] = await connection.execute(
      `UPDATE user SET ${setClause} WHERE id = ?`,
      values
    );
  
    // Récupération de l'utilisateur mis à jour
    const [user] = await connection.execute(
      'SELECT * FROM user WHERE id = ?',
      [userId]
    );
  
    connection.release();
    return user[0];
  };

exports.createUser = async ({ name,firstName, email, password }) => {
  const connection = await pool.getConnection();
  const [result] = await connection.execute(
    'INSERT INTO user (name,firstName, email, password) VALUES (?, ?, ?,?)',
    [name,firstName, email, password]
  );
  const [user] = await connection.execute('SELECT * FROM user WHERE id = ?', [result.insertId]);
  connection.release();
  return user[0];
};


exports.getAllUsers = async () => {
  const pool = getPool();
  const [rows] = await pool.execute('SELECT * FROM user');
  return rows;
};

exports.getUserById = async (id) => {
  const connection = await pool.getConnection();
  const [rows] = await connection.execute('SELECT * FROM user WHERE id = ?', [id]);
  connection.release();
  return rows[0];
};

exports.checkUserExists = async (id) => {
  const connection = await pool.getConnection();
  const [rows] = await connection.execute('SELECT id FROM user WHERE id = ?', [id]);
  connection.release();
  return rows.length > 0;
};

exports.updateEntity = async (data, id) => {
    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE user SET name = ?,firstName = ? ,language = ?, email = ?, password = ?',
      [
        data.name,
        data.firstName || null,
        data.language || null,
        data.keyLicence || null,
        data.email || null,
        data.password,
        id
      ]
    );
    const [updated] = await connection.execute('SELECT * FROM entity WHERE id = ?', [id]);
    connection.release();
    return updated[0];
  };
   
  

exports.deleteUser = async (id) => {
  const connection = await pool.getConnection();
  await connection.execute('DELETE FROM user WHERE id = ?', [id]);
  connection.release();
};
