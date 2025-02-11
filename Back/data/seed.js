const { Pool } = require("pg");
const pool = new Pool();
const dotenv = require("dotenv").config();

async function main(){

  const classes = {
      warrior: {
          labels: {
              fr: "Guerrier",
              en: "Warrior"
          },
          roles: ['tank', 'damage']
      },
      paladin: {
          labels: {
              fr: "Paladin",
              en: "Paladin"
          },
          roles: ['tank', 'damage', 'healer']
      },
      hunter: {
          labels: {
              fr: "Chasseur",
              en: "Hunter"
          },
          roles: ['damage']
      },
      rogue: {
          labels: {
              fr: "Voleur",
              en: "Rogue"
          },
          roles: ['damage']
      },
      priest: {
          labels: {
              fr: "Prêtre",
              en: "Priest"
          },
          roles: ['damage', 'healer']
      },
      shaman: {
          labels: {
              fr: "Chaman",
              en: "Shaman"
          },
          roles: ['damage', 'healer']
      },
      mage: {
          labels: {
              fr: "Mage",
              en: "Mage"
          },
          roles: ['damage']
      },
      warlock: {
          labels: {
              fr: "Démoniste",
              en: "Warlock"
          },
          roles: ['damage']
      },
      monk: {
          labels: {
              fr: "Moine",
              en: "Monk"
          },
          roles: ['damage']
      },
      druid: {
          labels: {
              fr: "Druide",
              en: "Druid"
          },
          roles: ['tank', 'damage', 'healer']
      },
      dh: {
          labels: {
              fr: "Chasseur de démon",
              en: "Demon Hunter"
          },
          roles: ['tank', 'damage']
      },
      dk: {
          labels: {
              fr: "Chevalier de la mort",
              en: "Deat Knight"
          },
          roles: ['tank', 'damage']
      },
      evoker: {
          labels: {
              fr: "Évocateur",
              en: "Evoker"
          },
          roles: ['healer', 'damage']
      }
  }

  const donjons = {
    "The Stonevault" : "00:33:00",
    "The Dawnbreaker" : "00:35:00",
    "Ara-Kara, City of Echoes" : "00:30:00",
    "City of Threads" : "00:38:00",
    "Mists of Tirna Scithe" : "00:30:00",
    "The Necrotic Wake" : "00:36:00",
    "Siege of Boralus" : "00:36:00",
    "Grim Batol" : "00:34:00"
  }

  const query_roles = 
  "INSERT INTO roles (label)\
    VALUES ('tank'), ('healer'), ('damage')\
    ON CONFLICT DO NOTHING";

  await pool.query(query_roles);
  
  const query_class =
    "INSERT INTO class (name, label) \
      VALUES ($1, $2) \
      ON CONFLICT(name)\
      DO UPDATE SET\
          label = EXCLUDED.label";

  const query_classRoles =
    "INSERT INTO classroles (classId, roleId)\
      VALUES ((SELECT id FROM class WHERE name = $1), (SELECT id FROM roles WHERE label = $2))\
      ON CONFLICT DO NOTHING";

  for (const c in classes) {
    await pool.query(query_class, [c, classes[c].labels])
    for (const r of classes[c].roles){
      await pool.query(query_classRoles, [c, r])
    }
  }

  const query_donjons =
  "INSERT INTO dungeons (name, timer)\
    VALUES ($1, $2)\
    ON CONFLICT (name)\
    DO UPDATE SET\
        timer = EXCLUDED.timer"

  for (const d in donjons) {
    await pool.query(query_donjons, [d, donjons[d]])
  }
}

main()
    .then(async () => {
        await pool.end()
    })
    .catch(async (e) => {
        console.error(e)
        await pool.end()
        process.exit(1)
    })