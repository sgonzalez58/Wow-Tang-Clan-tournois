const { Pool } = require("pg");
const pool = new Pool();

// Modèle tournaments avec des fonctions pour interagir avec la base de données
const Tournaments = {
  // Récupérer tous les tounaments
  getAllTournaments: (callback) => {
    const query = "SELECT * FROM tournaments";
    pool.query(query, (err, results) => {
      if (err) {
        console.error(
          "Erreur lors de la récupération des tournaments :",
          err.message
        );
        callback(err, null);
      } else {
        callback(null, results.rows);
      }
    });
  },

  // Récupérer un tournaments avec son id
  getTournament: (tournamentId, callback) => {
    const query = "SELECT * FROM tournaments WHERE id = $1";
    pool.query(query, [tournamentId], (err, result) => {
        if (err) {
            console.error(
                "Erreur lors de la récupération du tournament :",
                err.message
            );
            return callback(err, null)
        }
        if (result.rowCount === 0) {
          return callback(new Error("Tournament non trouvé"), null);
        }
        return callback(null, result.rows[0])
    })
  },

  // Créer un tournament
  create: (tournament, callback) => {
    const query =
      "INSERT INTO tournaments (name, startDate, endDate, price, description) VALUES ($1, $2, $3, $4, $5) RETURNING id";
    pool.query(query, [tournament.name, tournament.startDate, tournament.endDate, tournament.price, tournament.description], (err, result) => {
      if (err) {
        console.error(
            "Erreur lors de la création du tournament :",
            err.message
        );
        return callback(err, null)
      }
      return callback(null, result.rows[0])
    });
  },

  // Modifier un tournament
  update: async (tournamentId, updates, callback) => {
    const query = `
        UPDATE tournaments
        SET name = $2, startDate = $3, endDate = $4, price = $5, description = $6
        WHERE id = $1
    `;
    const params = [tournamentId, updates.name, updates.startDate, updates.endDate, updates.price, updates.description];
    pool.query(query, params, async function (err, result) {
      if (err) {
        console.error(
          "Erreur lors de la modification du tournament :",
          err.message
        )
        return callback(err, null);
      }
      return callback(null, tournamentId)
    });
  },

  // Supprimer un tournois
  delete: async (tournamentId, callback) => {
    const query = `
    UPDATE tournaments
      SET canceled = true, endDate = CURRENT_DATE, startDate = CURRENT_DATE
      WHERE id = $1
    `;
    const params = [tournamentId];
    pool.query(query, params, async function (err, result) {
      if (err) {
        console.error(
          "Erreur lors de l'annulation du tournament :",
          err.message
        )
        return callback(err, null);
      }
      return callback(null, tournamentId)
    });
  }
};

module.exports = Tournaments;
