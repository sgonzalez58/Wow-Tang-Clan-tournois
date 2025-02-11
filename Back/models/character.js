const { Pool } = require("pg");
const pool = new Pool();

// Modèle characters avec des fonctions pour interagir avec la base de données
const Characters = {
  // Récupérer tous les characters
  getAllCharacters: (callback) => {
    const query = "SELECT ch.id, ch.name, ch.partyid, cl.label as class, r.label as role, ilvl, rio FROM characters ch, class cl, roles r WHERE cl.id = ch.classid AND r.id = ch.roleid";
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

  // Récupérer un character avec son id
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

  // Créer un character
  create: (character, callback) => {
    const query =
      "INSERT INTO characters (name, classId, roleId, ilvl, rio) VALUES ($1, $2, $3, $4, $5) RETURNING id";
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

  // Modifier tous les champs d'un character
  update: (characterId, updates, callback) => {
    const query = `
        UPDATE characters
        SET name = $2, classId = $3, roleId = $4, ilvl = $5, rio = $6
        WHERE id = $1
    `;
    const params = [characterId, updates.name, updates.classId, updates.roleId, updates.ilvl, updates.rio];
    pool.query(query, params, function (err, result) {
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
