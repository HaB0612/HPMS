var express = require('express');
var router = express.Router();
var ReservationRoute = require('./Components/Reservation');

router.use('/reservation', ReservationRoute);

module.exports = router;

