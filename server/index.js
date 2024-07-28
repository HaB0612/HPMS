var express = require('express');
var router = express.Router();
var ReservationRoute = require('./Components/Reservation');
var RoomRoute = require('./Components/Room');
var CustomerRoute = require('./Components/Customer');

router.use('/reservation', ReservationRoute);
router.use('/room', RoomRoute);
router.use('/customer', CustomerRoute);

module.exports = router;

