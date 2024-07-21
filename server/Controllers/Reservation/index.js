const Reservation = require("../../models/Reservation");
const Customer = require("../../models/Customer");
const Room = require("../../models/Room");
const Employee = require("../../models/Employee");
const mongoose = require("mongoose");
const validator = require("./validator");

//BURANIN ALAYI DEĞİŞECEK

const createReservation = async (req, res) => {
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

    const errors = {
      //employee: await validator.employee(req.user._id),
      // customer: await validator.customer(customers),
      // room: await validator.room(rooms),
      checkDates: await validator.checkDates(
        checkin,
        checkout,
        null,
        rooms,
        customers
      ),
      adults: await validator.adults(adults),
      childs: await validator.childs(childs),
      price: await validator.price(price),
      isPaid: await validator.isPaid(isPaid),
    };
    const errorsArray = [];
    Object.keys(errors).forEach(function (key, index) {
      if (!errors[key]) return;
      errorsArray.push(errors[key]);
    });

    if (errorsArray.length > 0)
      return res
        .status(400)
        .json({ error: true, message: "errors", data: errorsArray });

    const newReservation = await Reservation.create({
      employee: "66990c80a434f85a8aae7c73",
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

    await Promise.all([
      customers.forEach(async (customer) => {
        await Customer.findByIdAndUpdate(
          customer,
          { $addToSet: { reservation: newReservation._id } },
          { new: true }
        ); 
      }),
      rooms.forEach(async (room) => {
        await Room.findByIdAndUpdate(
          room,
          { $addToSet: { reservation: newReservation._id } },
          { new: true }
        );
      }),
    ]);
    res.status(201).json({
      error: false,
      data: newReservation,
      message: "success",
    });
  } catch (error) {
    res.status(500).json({ error: true, message: "error", data: error });
    console.log(error);
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
