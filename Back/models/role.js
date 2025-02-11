const { Pool } = require("pg");
const pool = new Pool();

// Modèle roles avec des fonctions pour interagir avec la base de données
const Roles = {
  // Récupérer tous les roles
  getAllRoles: (callback) => {
    const query = "SELECT * FROM roles";
    pool.query(query, (err, results) => {
      if (err) {
        console.error(
          "Erreur lors de la récupération des roles :",
          err.message
        );
        callback(err, null);
      } else {
        callback(null, results.rows);
      }
    });
  },

  // Récupérer un role avec son id
  getRole: (roleId, callback) => {
    const query = "SELECT * FROM roles where id = $1";
    pool.query(query, [roleId], (err, result) => {
        if (err) {
            console.error(
                "Erreur lors de la récupération du role :",
                err.message
            );
            return callback(err, null)
        }
        if (result.rowCount === 0) {
          return callback(new Error("Role non trouvé"), null);
        }
        return callback(null, result.rows[0])
    })
  },
};

module.exports = Roles;
