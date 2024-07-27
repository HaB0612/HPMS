var express = require("express");
var router = express.Router();
const {createReservation,editReservation, getReservation, deleteReservation, getAllReservations} = require('../Controllers/Reservation');

router.post("/", createReservation);
router.put("/:id", editReservation)
router.get("/:id", getReservation)
router.delete("/:id", deleteReservation)
router.get("/", getAllReservations)
/*
router.get(getReservations)
router
  .route("/:id")
  .get(getReservation)
  .put(editReservation)
  .delete(deleteReservation);
*/
module.exports = router;
