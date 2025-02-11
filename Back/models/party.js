const { Pool } = require("pg");
const pool = new Pool();

// Modèle parties avec des fonctions pour interagir avec la base de données
const Parties = {
  // Récupérer tous les characters
  getAllParties: (callback) => {
    const query = "SELECT p.id, p.partyName, string_agg(c.name, ',') members FROM parties p, characters c WHERE c.partyid = p.id GROUP BY p.id ORDER BY p.id";
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
    const query = "SELECT p.id, p.partyName, string_agg(c.name, ',') members FROM parties p, characters c WHERE c.partyid = p.id AND p.id = $1 GROUP BY p.id";
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
      "INSERT INTO parties (partyName) VALUES ($1) RETURNING id";
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
      pool.query(query_characters, [partyId, party.tankMember, party.healerMember, party.damageMember1, party.damageMember2, party.damageMember3], (err, result) => {
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
  update: async (partyId, updates, callback) => {
    const client = await pool.connect()
    const query = `
        UPDATE parties
        SET partyName = $2
        WHERE id = $1
    `;
    const params = [partyId, updates.partyName];
    pool.query(query, params, async function (err, result) {
      if (err) {
        console.error(
          "Erreur lors de la modification du nom de la party:",
          err.message
        )
        return callback(err, null);
      }
      try {
        await client.query('BEGIN')
        const query_update_old_charaters = "UPDATE characters SET partyId = null WHERE partyId = $1"
        const res = await client.query(query_update_old_charaters, [partyId]);

        const query_update_charaters = "UPDATE characters SET partyId = $1 WHERE id IN ($2, $3, $4, $5, $6)"
        await client.query(query_update_charaters, [partyId, updates.tankMember, updates.healerMember, updates.damageMember1, updates.damageMember2, updates.damageMember3])
        await client.query('COMMIT')
      } catch (e) {
        await client.query('ROLLBACK')
        console.error(
          "Erreur lors des changements de characters dans la party:",
          e.message
        )
        return callback(e, null)
      } finally {
        client.release()
        return callback(null, partyId)
      }
    });
  },

  // Supprimer une party et retirer le partyId des characters liés à cette party
  delete: async (partyId, callback) => {
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      const query_update_charaters = "UPDATE characters SET partyId = null WHERE partyId = $1"
      const res = await client.query(query_update_charaters, [partyId]);

      const query_delete_party = "DELETE FROM parties WHERE id = $1"
      await client.query(query_delete_party, [partyId])
      await client.query('COMMIT')
    } catch (e) {
      await client.query('ROLLBACK')
      console.error(
        "Erreur lors de la suppression la party:",
        e.message
      )
      return callback(e)
    } finally {
      client.release()
      return callback(null)
    }
  },
};

module.exports = Parties;
