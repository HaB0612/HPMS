const Reservation = require("../../models/Reservation");
const Customer = require("../../models/Customer");
const Room = require("../../models/Room");
const Employee = require("../../models/Employee");
const mongoose = require("mongoose");
const validator = require("./validator");
const logEntry = require("../Middleware/logger");

const createReservation = async (req, res) => {
  const employee = req.user ? req.user._id : "";

  const requestDetails = {
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body,
  };

  try {
    const {
      customers,
      rooms,
      checkin,
      checkout,
      adults,
      childs,
      price,
      isPaid,
      note,
    } = req.body;

    const validators = {
      customer: validator.customer(customers),
      room: validator.room(rooms),
      checkDates: validator.checkDates(
        checkin,
        checkout,
        null,
        rooms,
        customers
      ),
      adults: validator.adults(adults),
      childs: validator.childs(childs),
      price: validator.price(price),
      isPaid: validator.isPaid(isPaid),
    };

    const errors = await Promise.all(Object.values(validators));
    const errorsArray = Object.keys(validators).reduce((arr, key, index) => {
      if (errors[index]) arr.push(errors[index]);
      return arr;
    }, []);

    if (errorsArray.length > 0) {
      await logEntry({
        message:
          "Rezervasyon oluşturulurken hatalı veri girildi ve işlem yapılamadı.",
        employee,
        request: requestDetails,
        response: {
          status: 400,
          headers: res.getHeaders(),
          body: { error: true, message: "errors", data: errorsArray },
        },
      });
      return res
        .status(400)
        .json({ error: true, message: "errors", data: errorsArray });
    }
    const newReservation = await Reservation.create({
      employee: "669e5fe5af7fd9bf9444cce4",
      customers,
      rooms,
      checkin,
      checkout,
      adults,
      childs,
      price,
      isPaid,
      note: note || "",
    });
    await logEntry({
      message: "Yeni bir rezervasyon oluşturuldu.",
      employee,
      request: requestDetails,
      response: {
        status: 201,
        headers: res.getHeaders(),
        body: { error: false, data: newReservation, message: "success" },
      },
    });
    res
      .status(201)
      .json({ error: false, data: newReservation, message: "success" });
  } catch (error) {
    await logEntry({
      message: "İşlem sırasında hata oluştu.",
      level: "error",
      employee,
      request: requestDetails,
      response: {
        status: 500,
        headers: res.getHeaders(),
        body: { error: true, message: "error", data: error },
      },
      error: { name: error.name, message: error.message, stack: error.stack },
    });
    res.status(500).json({ error: true, message: "error", data: error });
  }
};

const editReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const updateFields = {};

    const validationMap = {
      customer: reservationValidator.customer,
      room: reservationValidator.room,
      checkin: reservationValidator.checkin,
      checkout: reservationValidator.checkout,
      adults: reservationValidator.adults,
      childs: reservationValidator.childs,
      price: reservationValidator.price,
      isPaid: reservationValidator.isPaid,
      note: () => [], // no validation needed for note
    };

    for (const field in validationMap) {
      if (req.body[field] !== undefined) {
        const errors = await validationMap[field](
          req.body[field],
          req.body.checkout,
          req.body.room
        );
        if (errors.length > 0)
          return res.status(400).json({ error: true, message: errors });
        updateFields[field] = req.body[field];
      }
    }

    // Handle price update based on room
    if (req.body.room !== undefined && req.body.price === undefined) {
      const roomData = await Room.findById(req.body.room);
      updateFields.price = roomData.price;
    }

    // Find and update reservation
    const reservation = await Reservation.findByIdAndUpdate(
      reservationId,
      updateFields,
      { new: true }
    );

    if (!reservation) {
      return res
        .status(404)
        .json({ error: true, message: "Rezervasyon bulunamadı." });
    }

    // Update customer and room references if they have been updated
    const updatePromises = [];
    if (updateFields.customer !== undefined) {
      updatePromises.push(
        Customer.findByIdAndUpdate(updateFields.customer, {
          reservation: reservation._id,
        }).exec()
      );
    }

    if (updateFields.room !== undefined) {
      updatePromises.push(
        Room.findByIdAndUpdate(updateFields.room, {
          reservation: reservation._id,
        }).exec()
      );
    }

    await Promise.all(updatePromises);

    res.status(200).json({
      error: false,
      data: reservation,
      message: "Rezervasyon güncellendi.",
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error });
  }
};

const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    await Reservation.findByIdAndDelete(id);
    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createReservation,
  editReservation,
  deleteReservation,
  getReservation,
  getAllReservations,
};
