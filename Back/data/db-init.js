const { Pool } = require("pg");
const pool = new Pool();
const dotenv = require("dotenv").config();

const createClassTableQuery = `
CREATE TABLE IF NOT EXISTS class (
  id        SERIAL PRIMARY KEY,
  name      varchar(64) NOT NULL UNIQUE,
  label     json NOT NULL
)`;

const createRolesTableQuery = `
CREATE TABLE IF NOT EXISTS roles (
  id        SERIAL PRIMARY KEY,
  label     varchar(64) NOT NULL UNIQUE
)`;

const createPartiesTableQuery = `
CREATE TABLE IF NOT EXISTS parties (
  id          SERIAL PRIMARY KEY,
  partyName   varchar(64) NOT NULL UNIQUE
)`;

const createDungeonsTableQuery = `
CREATE TABLE IF NOT EXISTS dungeons (
  id          SERIAL PRIMARY KEY,
  name        varchar(64) NOT NULL UNIQUE,
  difficulty  integer NOT NULL,
  timer       time NOT NULL
)
`;

const createClassAndRolesTables = pool
  .query(createClassTableQuery)
  .catch((err) => {
    console.error("Erreur lors de la création de la table class :", err);
    throw err;
  })

  .then(() => {
    console.log("Table Class créée avec succès");
    return pool.query(createRolesTableQuery);
  })
  .catch((err) => {
    console.error("Erreur lors de la création de la table roles:", err);
    throw err;
  })
  
  .then(() => {
    console.log("Table Roles créée avec succès");
    return pool.query(createPartiesTableQuery);
  })
  .catch((err) => {
    console.error("Erreur lors de la création de la table parties :", err);
    throw err;
  })

  .then(() => {
    console.log("Table Parties créée avec succès");
    return pool.query(createDungeonsTableQuery);
  })
  .catch((err) => {
    console.error("Erreur lors de la création de la table dungeons:", err);
    throw err;
  })

  .then(() => {
    console.log("Table Dungeons créée avec succès");
  });

  // Attendre que les tables roles et class soient créées avant de créer la table can_be
  createClassAndRolesTables
  .then(() => {
    pool
      .query(
        `CREATE TABLE IF NOT EXISTS classRoles (
      roleId        integer NOT NULL,
      classId       integer NOT NULL,
      CONSTRAINT fk_role FOREIGN KEY(roleId) REFERENCES roles(id),
      CONSTRAINT fk_class FOREIGN KEY(classId) REFERENCES class(id),
      CONSTRAINT classroles_pkey PRIMARY KEY (roleId, classId)
    )`
      )
      .then(() => {
        console.log("Table classRoles créée avec succès");
      })
      .catch((err) => {
        console.error("Erreur lors de la création de la table classRoles:", err);
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
            ilvl        integer,
            rio         integer,
            partyId     integer,
            CONSTRAINT fk_role FOREIGN KEY(roleId) REFERENCES roles(id),
            CONSTRAINT fk_class FOREIGN KEY(classId) REFERENCES class(id),
            CONSTRAINT fk_party FOREIGN KEY(partyId) REFERENCES parties(id),
            CHECK (ilvl BETWEEN 0 AND 645),
            CHECK (rio BETWEEN 0 AND 4500)
        )`
          )
          .then(() => {
            console.log("Table characters créée avec succès");
          })
          .catch((err) => {
            console.error("Erreur lors de la création de la table characters:", err);
          })
      })
  })
  // attendre que la table dungeons soit créée avant de créer la table tournaments
  .then(() => {
    pool.query(
        `CREATE TABLE IF NOT EXISTS tournaments (
          id          SERIAL PRIMARY KEY,
          startDate   date NOT NULL,
          endDate     date NOT NULL,
          dungeonId   integer NOT NULL,
          CONSTRAINT fk_dungeon FOREIGN KEY(dungeonId) REFERENCES dungeons(id)
        )
        `
    )
    .catch((err) => {
      console.error("Erreur lors de la création de la table tournaments:", err);
    })
    // attendre que les tables parties et tournaments soient créées avant de créer la table partiesTournaments
    .then(() => {
      console.log("Table tournaments créée avec succès");
      pool.query(
        `CREATE TABLE IF NOT EXISTS partiesTournaments (
        partyId         integer NOT NULL,
        tournamentId    integer NOT NULL,
        timer           time,
        CONSTRAINT fk_party FOREIGN KEY(partyId) REFERENCES parties(id),
        CONSTRAINT fk_tournamenets FOREIGN KEY(tournamentId) REFERENCES tournaments(id),
        CONSTRAINT partiestournaments_pkey PRIMARY KEY (partyId, tournamentId)
      )`
      )
      .then(() => {
        console.log("Table partiesTournaments créée avec succès");
      })
      .catch((err) => {
        console.error("Erreur lors de la création de la table partiesTournaments:", err);
      })
    })
  })
  