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