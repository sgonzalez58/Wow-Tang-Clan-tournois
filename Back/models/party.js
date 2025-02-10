const { Pool } = require("pg");
const pool = new Pool();

// Modèle characters avec des fonctions pour interagir avec la base de données
const Parties = {
  // Récupérer tous les characters
  getAllParties: (callback) => {
    const query = "SELECT * FROM parties";
    pool.query(query, (err, results) => {
      if (err) {
        console.error(
          "Erreur lors de la récupération des parties:",
          err.message
        );
        callback(err, null);
      } else {
        callback(null, results.rows);
      }
    });
  },

  // Récupérer une party avec son id
  getParty: (partyId, callback) => {
    const query = "SELECT * FROM parties where id = $1";
    pool.query(query, [partyId], (err, result) => {
        if (err) {
            console.error(
                "Erreur lors de la récupération de la party:",
                err.message
            );
            return callback(err, null)
        }
        if (result.rowCount === 0) {
          return callback(new Error("Party non trouvée"), null);
        }
        return callback(null, result.rows[0])
    })
  },

  // Créer une party et ajouter son id dans les characters
  create: (party, callback) => {
    const query =
      "INSERT INTO party (name) VALUES ($1) RETURNING id";
    pool.query(query, [party.partyName], (err, result) => {
      if (err) {
        console.error(
            "Erreur lors de la création de la party:",
            err.message
        );
        return callback(err, null)
      }
      const partyId = result.rows[0].id;

      const query_characters = "UPDATE characters SET partyId = $1 WHERE id IN ($2, $3, $4, $5, $6)";
      pool.query(query_characters, [partyId[0].id, party.tankMember, party.healerMember, party.damageMember1, party.damageMember2, party.damageMember3], (err, result) => {
        if (err) {
          console.error(
              "Erreur lors de l'ajout des characters dans la party:",
              err.message
          );
          return callback(err, null)
        }
        return callback(null, partyId)
      })
    }
    );
  },

  // Modifier le nom d'un party et changer les characters liés à cette party
  update: (partyId, updates, callback) => {
    const query = `
        UPDATE parties
        SET name = $2
        WHERE id = $1
    `;
    const params = [partyId, updates.partyName];
    pool.query(query, params, function (err, result) {
      if (err) {
        console.error(
          "Erreur lors de la modification du nom de la party:",
          err.message
        )
        return callback(err, null);
      }
      const query_update_charaters = "UPDATE characters SET partyId = null WHERE partyId = $1;\
                                      UPDATE characters SET partyId = $1 WHERE id IN ($2, $3, $4, $5, $6);"
      pool.query(query_update_charaters, [partyId, updates.tankMember, updates.healerMember, updates.damageMember1, updates.damageMember2, updates.damageMember3], (err, result) => {
        if (err) {
          console.error(
              "Erreur lors des changements de characters dans la party:",
              err.message
          );
          return callback(err, null)
        }
        
        
          return callback(null, partyId)
      })
    });
  },

  // Supprimer une party et retirer le partyId des characters liés à cette party
  delete: (partyId, callback) => {
    const query = "UPDATE characters SET partyId = null WHERE partyId = $1;\
                  DELETE FROM parties WHERE id = $1";
    pool.query(query, [partyId], (err, result) => {
      if (err) {
        return callback(err);
      }
      if (result.rowCount === 0) {
        return callback(new Error("Party non trouvée"));
      }
      callback(null);
    });
  },
};

module.exports = Parties;
