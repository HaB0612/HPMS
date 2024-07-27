const Reservation = require("../../models/Reservation");
const validator = require("./validator");
const logEntry = require("../Middleware/logger");

const createReservation = async (req, res) => {
  const { user } = req;
  const employee = user ? user._id : "";
  const requestDetails = { method: req.method, url: req.originalUrl, headers: req.headers, body: req.body };
  let responseBody;

  try {
    const { customers, rooms, checkin, checkout, adults, childs, price, isPaid, note } = req.body;
    const validators = [
      validator.employee(employee),
      validator.customer(customers),
      validator.room(rooms),
      validator.checkDates(checkin, checkout, null, rooms, customers),
      validator.adults(adults),
      validator.childs(childs),
      validator.price(price),
      validator.isPaid(isPaid)
    ];
    const errors = await Promise.all(validators);
    const errorsArray = errors.filter(Boolean);

    if (errorsArray.length > 0) {
      responseBody = { error: true, message: "errors", data: errorsArray }

      await logEntry({
        message: "Rezervasyon oluşturulurken hatalı veri girildi ve işlem yapılamadı.",
        employee,
        request: requestDetails,
        response: { status: 400, headers: res.getHeaders(), body: responseBody }
      });
      return res.status(400).json(responseBody);
    }
    const newReservation = await Reservation.create({ employee, customers, rooms, checkin, checkout, adults, childs, price, isPaid, note });
    responseBody = { error: false, data: newReservation, message: "success" }

    await logEntry({
      message: "Yeni bir rezervasyon oluşturuldu.",
      employee,
      request: requestDetails,
      response: { status: 201, headers: res.getHeaders(), body: responseBody }
    });
    return res.status(201).json(responseBody);
  } catch (error) {
    responseBody = { error: true, message: "error", data: error },

    await logEntry({
      message: "İşlem sırasında hata oluştu. Rezervasyon oluşturulamadı.",
      level: "error",
      employee,
      request: requestDetails,
      response: { status: 500, headers: res.getHeaders(), body: responseBody },
      error: { name: error.name, message: error.message, stack: error.stack }
    });
    return res.status(500).json(responseBody);
  }
};

module.exports = createReservation;