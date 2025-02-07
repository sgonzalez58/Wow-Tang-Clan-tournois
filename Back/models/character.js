const { Pool } = require("pg");
const pool = new Pool();

// Modèle characters avec des fonctions pour interagir avec la base de données
const Characters = {
  // Récupérer tous les characters
  getAllCharacters: (callback) => {
    const query = "SELECT * FROM characters";
    pool.query(query, (err, results) => {
      if (err) {
        console.error(
          "Erreur lors de la récupération des characters:",
          err.message
        );
        callback(err, null);
      } else {
        callback(null, results.rows);
      }
    });
  },

  getCharacter: (characterId, callback) => {
    const query = "SELECT * FROM characters where id = $1";
    pool.query(query, [characterId], (err, result) => {
        if (err) {
            console.error(
                "Erreur lors de la récupération du character:",
                err.message
            );
            return callback(err, null)
        }
        if (result.rowCount === 0) {
          return callback(new Error("Character non trouvé"), null);
        }
        return callback(null, result.rows[0])
    })
  },

  create: (character, callback) => {
    const query =
      "INSERT INTO characters (name, classId, roleId, ilvl, rio) VALUES ($1, $2, $3, $4, $5,) RETURNING id";
    pool.query(
      query,
      [character.name, character.classId, character.roleId, character.ilvl, character.rio],
      function (err, result) {
        if (err) {
          return callback(err, null);
        }
        callback(null, result.rows[0]);
      }
    );
  },

  update: (characterId, updates, callback) => {
    const query = `
        UPDATE tasks
        SET name = $2, classId = $3, roleId = $4, ilvl = $5, rio = $6
        WHERE id = $1
    `;
    const params = [characterId, updates.name, updates.classId, updates.roleId, updates.ilvl, updates.rio];
    pool.query(query, params, function (err, task) {
      if (err) {
        return callback(err, null);
      }
      callback(null, result.rows[0]);
    });
  },

  // Supprimer un character
  delete: (characterId, callback) => {
    const query = "DELETE FROM characters WHERE id = $1";
    pool.query(query, [characterId], (err, result) => {
      if (err) {
        return callback(err);
      }
      if (result.rowCount === 0) {
        return callback(new Error("Character non trouvé"));
      }
      callback(null);
    });
  },
};

module.exports = Characters;
