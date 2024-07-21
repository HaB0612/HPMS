var express = require("express");
var router = express.Router();
const {createReservation} = require('../Controllers/Reservation');

router.post("/", createReservation);
/*
router.get(getReservations)
router
  .route("/:id")
  .get(getReservation)
  .put(editReservation)
  .delete(deleteReservation);
*/
module.exports = router;
