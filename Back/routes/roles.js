const express = require("express");
const router = express.Router();
const Roles = require("../models/role");

// Récupère tous les roles et les retourne en json
router.get("/", (req, res) => {

  Roles.getAllRoles((err, data) => {
    if (err) {
      return res.json({
        err: `Erreur lors de la récupération des roles : ${err.message}`
      });
    }
    return res.json({
      data: data || [],
    });
  });
});

// Récupère un role avec son id et le retourne en json
router.get("/:roleId", (req, res) => {
  const roleId = req.params.roleId;

  Roles.getRole(roleId, (err, data) => {
    if (err) {
      return res.json({
        err: `Erreur lors de la récupération du role : ${err.message}`
      });
    }
    return res.json({
      data: data,
    });
  });
});

module.exports = router;
