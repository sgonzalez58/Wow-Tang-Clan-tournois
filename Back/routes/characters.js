const express = require("express");
const router = express.Router();
const Characters = require("../models/character");

router.get("/", (req, res) => {

    Characters.getAllCharacters((err, data) => {
    if (err) {
      return res.json({
        err:"Erreur lors de la récupération des characters"
      });
    }
    return res.json({
      data: data || [],
    });
  });
});

router.get("/:characterId", (req, res) => {
  const characterId = req.params.characterId;

  Characters.getCharacter(characterId, (err, data) => {
  if (err) {
    return res.json({
      err:"Erreur lors de la récupération du character"
    });
  }
  return res.json({
    data: data,
  });
});
});

router.get("/delete/:characterId", (req, res) => {
  const characterId = req.params.characterId;

  Characters.delete(characterId, (err) => {
    if (err) {
      return res.json({
        err: err.message
      });
    }
    res.json({
      character: {
        id: characterId
      }
    });
  });
});

router.post("/", (req, res) => {
  const { name, classId, roleId, ilvl, rio } = req.body;

  Task.create(
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
});

router.post("/update/:characterId", (req, res) => {
  const characterId = req.params.characterId;
  const { name, classId, roleId, ilvl, rio } = req.body;

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
          err: err.message
        });
      }
      return res.json({
        character: character
      })
    }
  );
});

module.exports = router;
