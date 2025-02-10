const express = require("express");
const router = express.Router();
const Parties = require("../models/party");
const Characters = require("../models/character")

// Récupère toutes les parties et les retourne en json
router.get("/", (req, res) => {

    Parties.getAllParties((err, data) => {
    if (err) {
      return res.json({
        err: `Erreur lors de la récupération des parties : ${err.message}`
      });
    }
    return res.json({
      data: data || [],
    });
  });
});

// Récupère une party avec son id et la retourne en json
router.get("/:partyId", (req, res) => {
  const partyId = req.params.partyId;

  Parties.getParty(partyId, (err, data) => {
    if (err) {
      return res.json({
        err: `Erreur lors de la récupération de la party : ${err.message}`
      });
    }
    return res.json({
      data: data,
    });
  });
});

// Supprime une party avec son id et retourne l'id si ça a fonctionné
router.get("/delete/:partyId", (req, res) => {
  const partyId = req.params.partyId;

  Parties.delete(partyId, (err) => {
    if (err) {
      return res.json({
        err: `Erreur lors de la suppression de la party : ${err.message}`
      });
    }
    res.json({
      character: {
        id: partyId
      }
    });
  });
});

// Ajoute une party si les champs fournis sont okay
router.post("/", (req, res) => {
  const { partyName, tankMember, healerMember, damageMember1, damageMember2, damageMember3 } = req.body;

  const regex_partyName = /[a-zA-Z1-9]{6,64}/;

  if(!regex_partyName.test(partyName)){
    return res.json({
      err: "Le nom de la party n'est pas conforme."
    })
  }

  function checkIfArrayIsUnique(myArray) {
    return myArray.length === new Set(myArray).size;
  }

  if(!checkIfArrayIsUnique([tankMember, healerMember, damageMember1, damageMember2, damageMember3])){
    return res.json({
      err: "Vous devez avoir 5 membres différents dans la party."
    })
  }

  Characters.getCharacter(tankMember, (err, result) =>{
    if(err){
      return res.json({
        err: `Tank member ${tankMember} : err.message`
      })
    }
    Characters.getCharacter(healerMember, (err, result) =>{
      if(err){
        return res.json({
          err: `Healer member ${healerMember} : err.message`
        })
      }
      Characters.getCharacter(damageMember1, (err, result) =>{
        if(err){
          return res.json({
            err: `Damage member ${damageMember1} : err.message`
          })
        }
        Characters.getCharacter(damageMember2, (err, result) =>{
          if(err){
            return res.json({
              err: `Damage member ${damageMember2} : err.message`
            })
          }
          Characters.getCharacter(damageMember3, (err, result) =>{
            if(err){
              return res.json({
                err: `Damage member ${damageMember3} : err.message`
              })
            }
            Parties.create(
              {
                partyName: partyName,
                tankMember: tankMember,
                healerMember: healerMember,
                damageMember1: damageMember1,
                damageMember2: damageMember2,
                damageMember3: damageMember3
              },
              (err, partyId) => {
                if (err) {
                  return res.json({
                      err: err.message
                  });
                }
                return res.json({
                  party: {
                    id: partyId
                  }
                })
              }
            );
          })
        })
      })
    })
  })
});

// Modifie une party avec son id si les champs fournis sont okay
router.post("/update/:partyId", (req, res) => {
  const partyId = req.params.partyId;
  const { partyName, tankMember, healerMember, damageMember1, damageMember2, damageMember3 } = req.body;

  const regex_partyName = /[a-zA-Z1-9]{6,64}/;

  if(!regex_partyName.test(partyName)){
    return res.json({
      err: "Le nom de la party n'est pas conforme."
    })
  }

  function checkIfArrayIsUnique(myArray) {
    return myArray.length === new Set(myArray).size;
  }

  if(!checkIfArrayIsUnique([tankMember, healerMember, damageMember1, damageMember2, damageMember3])){
    return res.json({
      err: "Vous devez avoir 5 membres différents dans la party."
    })
  }

  Characters.getCharacter(tankMember, (err, result) =>{
    if(err){
      return res.json({
        err: `Tank member ${tankMember} : err.message`
      })
    }
    Characters.getCharacter(healerMember, (err, result) =>{
      if(err){
        return res.json({
          err: `Healer member ${healerMember} : err.message`
        })
      }
      Characters.getCharacter(damageMember1, (err, result) =>{
        if(err){
          return res.json({
            err: `Damage member ${damageMember1} : err.message`
          })
        }
        Characters.getCharacter(damageMember2, (err, result) =>{
          if(err){
            return res.json({
              err: `Damage member ${damageMember2} : err.message`
            })
          }
          Characters.getCharacter(damageMember3, (err, result) =>{
            if(err){
              return res.json({
                err: `Damage member ${damageMember3} : err.message`
              })
            }
            Parties.update(
              partyId,
              {
                partyName: partyName,
                tankMember: tankMember,
                healerMember: healerMember,
                damageMember1: damageMember1,
                damageMember2: damageMember2,
                damageMember3: damageMember3
              },
              (err, partyId) => {
                if (err) {
                  console.error("Erreur update party:", err);
                  return res.json({
                    err: `Erreur lors de la modification de la party : ${err.message}`
                  });
                }
                return res.json({
                  party: {
                    id: partyId
                  }
                })
              })
            }
          );
        })
      })
    })
  })
});

module.exports = router;
