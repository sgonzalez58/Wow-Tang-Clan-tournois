const { Pool } = require("pg");
const pool = new Pool();

// Modèle class avec des fonctions pour interagir avec la base de données
const Classes = {
  // Récupérer toutes les class
  getAllClasses: (callback) => {
    const query = "SELECT c.*, string_agg(r.label, ',') roles FROM class c, roles r, classroles cr WHERE cr.classId = c.id AND cr.roleId = r.id GROUP BY c.id Order By c.id";
    pool.query(query, (err, results) => {
      if (err) {
        console.error(
          "Erreur lors de la récupération des class :",
          err.message
        );
        callback(err, null);
      } else {
        callback(null, results.rows);
      }
    });
  },

  // Récupérer une class avec son id
  getClass: (classId, callback) => {
    const query = "SELECT * FROM class where id = $1";
    pool.query(query, [classId], (err, result) => {
        if (err) {
            console.error(
                "Erreur lors de la récupération de la class :",
                err.message
            );
            return callback(err, null)
        }
        if (result.rowCount === 0) {
          return callback(new Error("Class non trouvé"), null);
        }
        return callback(null, result.rows[0])
    })
  },
};

module.exports = Classes;
