const { Pool } = require("pg");
const pool = new Pool();
const dotenv = require("dotenv").config();

const createClassTableQuery = `
CREATE TABLE IF NOT EXISTS class (
  id        SERIAL PRIMARY KEY,
  label     varchar(64) NOT NULL UNIQUE
)`;

const createRolesTableQuery = `
CREATE TABLE IF NOT EXISTS roles (
  id        SERIAL PRIMARY KEY,
  label     varchar(64) NOT NULL UNIQUE
)`;

const createClassAndRolesTables = pool
  .query(createClassTableQuery)
  .then(() => {
    console.log("Table Class créée avec succès");
    return pool.query(createRolesTableQuery);
  })
  .then(() => {
    console.log("Table Roles créée avec succès");
  })
  .catch((err) => {
    console.error("Erreur lors de la création des tables:", err);
    throw err;
  });

  // Attendre que les tables roles et class soient créées avant de créer la table can_be
  createClassAndRolesTables.then(() => {
    pool
      .query(
        `CREATE TABLE IF NOT EXISTS can_be (
      roleId        integer NOT NULL,
      classId       integer NOT NULL,
      CONSTRAINT fk_role FOREIGN KEY(roleId) REFERENCES roles(id)
      CONSTRAINT fk_class FOREIGN KEY(classId) REFERENCES class(id)
    )`
      )
      .then(() => {
        console.log("Table can_be créée avec succès");
      })
      .catch((err) => {
        console.error("Erreur lors de la création de la table can_be:", err);
      });
  })
  // Attendre que la table can_be soit créée avant de créer la table characters
  .then(() => {
    pool
      .query(
        `CREATE TABLE IF NOT EXISTS characters (
        id          SERIAL PRIMARY KEY,
        name        varchar(64) NOT NULL UNIQUE
        classId     integer NOT NULL,
        roleId      integer NOT NULL,
        ilvl        integer NOT NULL,
        rio         integer NOT NULL
        CONSTRAINT fk_role FOREIGN KEY(roleId) REFERENCES roles(id)
        CONSTRAINT fk_class FOREIGN KEY(classId) REFERENCES class(id)
    )`
      )
      .then(() => {
        console.log("Table can_be créée avec succès");
      })
      .catch((err) => {
        console.error("Erreur lors de la création de la table characters:", err);
      });
  });