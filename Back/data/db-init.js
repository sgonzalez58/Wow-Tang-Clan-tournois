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

const createPartiesTableQuery = `
CREATE TABLE IF NOT EXISTS parties (
  id        SERIAL PRIMARY KEY
)`;

const createClassAndRolesTables = pool
  .query(createClassTableQuery)
  .then(() => {
    console.log("Table Class créée avec succès");
    return pool.query(createRolesTableQuery);
  })
  .then(() => {
    console.log("Table Roles créée avec succès");
    return pool.query(createPartiesTableQuery);
  })
  .then(() => {
    console.log("Table Parties créée avec succès");
  })
  .catch((err) => {
    console.error("Erreur lors de la création des tables class, roles ou parties:", err);
    throw err;
  });

  // Attendre que les tables roles et class soient créées avant de créer la table can_be
  createClassAndRolesTables.then(() => {
    pool
      .query(
        `CREATE TABLE IF NOT EXISTS classRoles (
      roleId        integer NOT NULL,
      classId       integer NOT NULL,
      CONSTRAINT fk_role FOREIGN KEY(roleId) REFERENCES roles(id),
      CONSTRAINT fk_class FOREIGN KEY(classId) REFERENCES class(id)
    )`
      )
      .then(() => {
        console.log("Table classRoles créée avec succès");
      })
      .catch((err) => {
        console.error("Erreur lors de la création de la table classRoles:", err);
      });
  })
  // Attendre que la table classRoles soit créée avant de créer la table characters
  .then(() => {
    pool
      .query(
        `CREATE TABLE IF NOT EXISTS characters (
        id          SERIAL PRIMARY KEY,
        name        varchar(64) NOT NULL UNIQUE,
        classId     integer NOT NULL,
        roleId      integer NOT NULL,
        ilvl        integer NOT NULL,
        rio         integer NOT NULL,
        CONSTRAINT fk_role FOREIGN KEY(roleId) REFERENCES roles(id),
        CONSTRAINT fk_class FOREIGN KEY(classId) REFERENCES class(id),
        CHECK (ilvl BETWEEN 0 AND 645),
        CHECK (rio BETWEEN 0 AND 4500)
    )`
      )
      .then(() => {
        console.log("Table characters créée avec succès");
      })
      .catch((err) => {
        console.error("Erreur lors de la création de la table characters:", err);
      });
  })
  // Attendre que la table characters soit créée avant de créer la table partiesCharacters
  .then(() => {
    pool
      .query(
        `CREATE TABLE IF NOT EXISTS partiesCharacters (
        partiesId       integer NOT NULL,
        charactersId   integer NOT NULL,
        CONSTRAINT fk_parties FOREIGN KEY(partiesId) REFERENCES parties(id),
        CONSTRAINT fk_characters FOREIGN KEY(charactersId) REFERENCES characters(id)
    )`
      )
      .then(() => {
        console.log("Table partiesCharacters créée avec succès");
      })
      .catch((err) => {
        console.error("Erreur lors de la création de la table partiesCharacters:", err);
      });
  })