const express = require("express");
const router = express.Router();
const Characters = require("../models/character");
const Classes = require("../models/class");
const Roles = require("../models/role");

// Récupère tous les characters et les retourne en json
router.get("/", (req, res) => {

    Characters.getAllCharacters((err, data) => {
    if (err) {
      return res.json({
        err: `Erreur lors de la récupération des characters : ${err.message}`
      });
    }
    return res.json({
      data: data || [],
    });
  });
});

// Récupère un character avec son id et le retourne en json
router.get("/:characterId", (req, res) => {
  const characterId = req.params.characterId;

  Characters.getCharacter(characterId, (err, data) => {
  if (err) {
    return res.json({
      err: `Erreur lors de la récupération du character : ${err.message}`
    });
  }
  return res.json({
    data: data,
  });
});
});

// Supprime un character avec son id et retourne l'id si ça a fonctionné
router.get("/delete/:characterId", (req, res) => {
  const characterId = req.params.characterId;

  Characters.delete(characterId, (err) => {
    if (err) {
      return res.json({
        err: `Erreur lors de la suppression du character : ${err.message}`
      });
    }
    res.json({
      character: {
        id: characterId
      }
    });
  });
});

// Ajoute un character si les champs fournis sont okay
router.post("/", (req, res) => {
  const { name, classId, roleId, ilvl, rio } = req.body;
  
  const regex_name = /[a-zA-Z1-9]{6,64}/;

  if(!regex_name.test(name)){
    return res.json({
      err: "Le nom du character n'est pas conforme."
    })
  }

  if(ilvl && ilvl > 645 || ilvl < 0){
    return res.json({
      err: "Le ilvl doit être compris entre 0 et 645."
    })
  }

  if(rio && rio > 4500 || rio < 0){
    return res.json({
      err: "Le rio doit être compris entre 0 et 4500."
    })
  }

  Classes.getClass(classId, (err, result) =>{
    if(err){
      return res.json({
        err: `Class ${classId} : err.message`
      })
    }
    Roles.getRole(roleId, (err, result) =>{
      if(err){
        return res.json({
          err: `Role ${roleId} : err.message`
        })
      }
      Characters.create(
        {
          name: name,
          classId: classId,
          roleId: roleId,
          ilvl: ilvl,
          rio: rio
        },
        (err, character) => {
          if (err) {
            return res.json({
                err: err.message
            });
          }
          return res.json({
            character: character
          })
        }
      );
    })
  })
});

// Modifie un character avec son id si les champs fournis sont okay
router.post("/update/:characterId", (req, res) => {
  const characterId = req.params.characterId;
  const { name, classId, roleId, ilvl, rio } = req.body;

  const regex_name = /[a-zA-Z1-9]{6,64}/;

  if(!regex_name.test(name)){
    return res.json({
      err: "Le nom du character n'est pas conforme."
    })
  }

  if(ilvl && ilvl > 645 || ilvl < 0){
    return res.json({
      err: "Le ilvl doit être compris entre 0 et 645."
    })
  }

  if(rio && rio > 4500 || rio < 0){
    return res.json({
      err: "Le rio doit être compris entre 0 et 4500."
    })
  }

  Classes.getClass(classId, (err, result) =>{
    if(err){
      return res.json({
        err: `Class ${classId} : err.message`
      })
    }
    Roles.getRole(roleId, (err, result) =>{
      if(err){
        return res.json({
          err: `Role ${roleId} : err.message`
        })
      }

      Characters.update(
        characterId,
        {
          name: name,
          classId: classId,
          roleId: roleId,
          ilvl: ilvl,
          rio: rio
        },
        (err, character) => {
          if (err) {
            console.error("Erreur update character:", err);
            return res.json({
              err: `Erreur lors de la modification du character : ${err.message}`
            });
          }
          return res.json({
            character: character
          })
        }
      );
    })
  })
});

module.exports = router;
