const express = require("express");
const router = express.Router();
const Classes = require("../models/class");

// Récupère toutes les class et les retourne en json
router.get("/", (req, res) => {

    Classes.getAllClasses((err, data) => {
    if (err) {
      return res.json({
        err: `Erreur lors de la récupération des class : ${err.message}`
      });
    }
    return res.json({
      data: data || [],
    });
  });
});

// Récupère un character avec son id et le retourne en json
router.get("/:classId", (req, res) => {
  const classId = req.params.classId;

  Classes.getClass(classId, (err, data) => {
    if (err) {
      return res.json({
        err: `Erreur lors de la récupération de la class : ${err.message}`
      });
    }
    return res.json({
      data: data,
    });
  });
});

module.exports = router;
