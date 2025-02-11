const { Pool } = require("pg");
const pool = new Pool();

// Modèle dungeons avec des fonctions pour interagir avec la base de données
const Dungeons = {
  // Récupérer tous les dungeons
  getAllDungeons: (callback) => {
    const query = "SELECT * from dungeons";
    pool.query(query, (err, results) => {
      if (err) {
        console.error(
          "Erreur lors de la récupération des dungeons :",
          err.message
        );
        callback(err, null);
      } else {
        callback(null, results.rows);
      }
    });
  },

  // Récupérer un dungeon avec son id
  getDungeon: (dungeonId, callback) => {
    const query = "SELECT * FROM dungeons where id = $1";
    pool.query(query, [dungeonId], (err, result) => {
        if (err) {
            console.error(
                "Erreur lors de la récupération du dungeon :",
                err.message
            );
            return callback(err, null)
        }
        if (result.rowCount === 0) {
          return callback(new Error("Dungeon non trouvé"), null);
        }
        return callback(null, result.rows[0])
    })
  },
};

module.exports = Dungeons;
