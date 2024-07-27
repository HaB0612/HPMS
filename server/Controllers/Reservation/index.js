const Reservation = require("../../models/Reservation");
const Customer = require("../../models/Customer");
const Room = require("../../models/Room");
const Employee = require("../../models/Employee");
const mongoose = require("mongoose");
const validator = require("./validator");
const logEntry = require("../Middleware/logger");

const createReservation = require("./createReservation")
const getReservation = require("./getReservation")
const editReservation = require("./editReservation")
const getAllReservations = require("./getAllReservations")
const deleteReservation = require("./deleteReservation")

module.exports = {
  createReservation,
  editReservation,
  deleteReservation,
  getReservation,
  getAllReservations,
};