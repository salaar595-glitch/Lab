const db = require('../db/db');

exports.createUser = (user) => {
  const stmt = db.prepare(`
    INSERT INTO users (name, email)
    VALUES (?, ?)
  `);

  const result = stmt.run(
    user.name,
    user.email
  );

  return {
    id: result.lastInsertRowid,
    ...user
  };
};

exports.getUsers = () => {
  return db.prepare(`
    SELECT * FROM users
    ORDER BY id DESC
  `).all();
};

exports.getUserById = (id) => {
  return db.prepare(`
    SELECT * FROM users
    WHERE id = ?
  `).get(id);
};

exports.updateUser = (id, user) => {

  const existingUser = db.prepare(`
    SELECT * FROM users
    WHERE id = ?
  `).get(id);

  if (!existingUser) {
    return null;
  }

  db.prepare(`
    UPDATE users
    SET name = ?, email = ?
    WHERE id = ?
  `).run(
    user.name,
    user.email,
    id
  );

  return {
    id: Number(id),
    ...user
  };
};

exports.deleteUser = (id) => {
  return db.prepare(`
    DELETE FROM users
    WHERE id = ?
  `).run(id);
};