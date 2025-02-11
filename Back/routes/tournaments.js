const express = require("express");
const router = express.Router();
const Tournaments = require("../models/tournament");

// Récupère tous les tournois et les retourne en json
router.get("/", (req, res) => {

  Tournaments.getAllTournaments((err, data) => {
    if (err) {
      return res.json({
        err: `Erreur lors de la récupération des tournaments : ${err.message}`
      });
    }
    return res.json({
      data: data || [],
    });
  });
});

// Récupère un tournament avec son id et la retourne en json
router.get("/:tournamentId", (req, res) => {
  const tournamentId = req.params.tournamentId;

  Tournaments.getTournament(tournamentId, (err, data) => {
    if (err) {
      return res.json({
        err: `Erreur lors de la récupération du tournament : ${err.message}`
      });
    }
    return res.json({
      data: data,
    });
  });
});

// Annulation d'un tournament avec son id et retourne l'id si ça a fonctionné
router.get("/delete/:tournamentId", (req, res) => {
  const tournamentId = req.params.tournamentId;

  Tournaments.delete(tournamentId, (err) => {
    if (err) {
      return res.json({
        err: `Erreur lors de l'annulation du tournament : ${err.message}`
      });
    }
    res.json({
      character: {
        id: tournamentId
      }
    });
  });
});

// Ajoute un tournament si les champs fournis sont okay
router.post("/", (req, res) => {
  const { name, startDate, endDate, price, description } = req.body;

  const regex_name = /[ a-zA-Z1-9]{0,64}/;

  if(!name || !regex_name.test(name)){
    return res.json({
      err: "Le nom du tournament n'est pas conforme."
    })
  }

  if(!startDate || isNaN(new Date(startDate))){
    return res.json({
      err: "La date de départ n'est pas conforme."
    })
  }

  if(!endDate || isNaN(new Date(endDate))){
    return res.json({
      err: "La date de fin n'est pas conforme."
    })
  }

  if(new Date(endDate) < new Date(startDate)){
    return res.json({
      err: "La date de fin doit être après ou le même jour que la date de départ."
    })
  }

  if(!price || isNaN(price)){
    return res.json({
      err: "Le prix doit être un nombre."
    })
  }

  if(!description){
    return res.json({
      err: "La description est obligatoire."
    })
  }

  Tournaments.create(
    {
      name: name,
      startDate: startDate,
      endDate: endDate,
      price: price,
      description: description.trim()
    },
    (err, tournamentId) => {
      if (err) {
        return res.json({
            err: err.message
        });
      }
      return res.json({
        tournament: {
          id: tournamentId
        }
      })
    }
  );
});

// Modifie une party avec son id si les champs fournis sont okay
router.post("/update/:tournamentId", (req, res) => {
  const tournamentId = req.params.tournamentId;
  const { name, startDate, endDate, price, description } = req.body;

  const regex_name = /[ a-zA-Z1-9]{0,64}/;

  if(!name || !regex_name.test(name.trim())){
    return res.json({
      err: "Le nom du tournament n'est pas conforme."
    })
  }

  if(!startDate || isNaN(new Date(startDate))){
    return res.json({
      err: "La date de départ n'est pas conforme."
    })
  }

  if(!endDate || isNaN(new Date(endDate))){
    return res.json({
      err: "La date de fin n'est pas conforme."
    })
  }

  if(new Date(endDate) < new Date(startDate)){
    return res.json({
      err: "La date de fin doit être après ou le même jour que la date de départ."
    })
  }

  if(!price || isNaN(price)){
    return res.json({
      err: "Le prix doit être un nombre."
    })
  }

  if(!description){
    return res.json({
      err: "La description est obligatoire."
    })
  }

  Tournaments.update(
    tournamentId,
    {
      name: name,
      startDate: startDate,
      endDate: endDate,
      price: price,
      description: description.trim()
    },
    (err, tournamentId) => {
      if (err) {
        return res.json({
            err: err.message
        });
      }
      return res.json({
        tournament: {
          id: tournamentId
        }
      })
    }
  );
});

module.exports = router;
