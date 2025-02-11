const express = require("express");
const router = express.Router();
const Dungeons = require("../models/dungeon");

// Récupère tous les dungeons et les retourne en json
router.get("/", (req, res) => {

  Dungeons.getAllDungeons((err, data) => {
    if (err) {
      return res.json({
        err: `Erreur lors de la récupération des dungeons : ${err.message}`
      });
    }
    return res.json({
      data: data || [],
    });
  });
});

// Récupère un dungeon avec son id et le retourne en json
router.get("/:dungeonId", (req, res) => {
  const dungeonId = req.params.dungeonId;

  Dungeons.getDungeon(dungeonId, (err, data) => {
    if (err) {
      return res.json({
        err: `Erreur lors de la récupération du dungeon : ${err.message}`
      });
    }
    return res.json({
      data: data,
    });
  });
});

module.exports = router;
