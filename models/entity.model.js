const pool = require('../config/db');

exports.createUser = async ({ name, firstName, email, password }) => {
  const connection = await pool.getConnection();
  try {
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const [result] = await connection.execute(
      'INSERT INTO user (name, firstName, email, password, lastLogin, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
      [name, firstName, email, password, currentDate, currentDate]
    );

    const [user] = await connection.execute(
      'SELECT id, name, firstName, email, lastLogin FROM user WHERE id = ?', 
      [result.insertId]
    );

    return user[0];
  } finally {
    connection.release();
  }
};



exports.getAllEntities = async () => {
  const connection = await pool.getConnection();
  const [rows] = await connection.execute('SELECT * FROM entity');
  connection.release();
  return rows;
};

exports.getEntityById = async (id) => {
  const connection = await pool.getConnection();
  const [rows] = await connection.execute('SELECT * FROM entity WHERE id = ?', [id]);
  connection.release();
  return rows[0];
};

exports.checkEntityExists = async (id) => {
  const connection = await pool.getConnection();
  const [rows] = await connection.execute('SELECT id FROM entity WHERE id = ?', [id]);
  connection.release();
  return rows.length > 0;
};

exports.updateEntity = async (data, id) => {
  const connection = await pool.getConnection();
  await connection.execute(
    'UPDATE entity SET name = ?, description = ?, siret = ?, keyLicence = ?, website = ? WHERE id = ?',
    [
      data.name,
      data.description || null,
      data.siret || null,
      data.keyLicence || null,
      data.website || null,
      id
    ]
  );
  const [updated] = await connection.execute('SELECT * FROM entity WHERE id = ?', [id]);
  connection.release();
  return updated[0];
};

exports.deleteEntity = async (id) => {
  const connection = await pool.getConnection();
  await connection.execute('DELETE FROM entity WHERE id = ?', [id]);
  connection.release();
};
