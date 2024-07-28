var express = require('express');
var router = express.Router();
var ReservationRoute = require('./Components/Reservation');
var RoomRoute = require('./Components/Room');

router.use('/reservation', ReservationRoute);
router.use('/room', RoomRoute);

module.exports = router;

