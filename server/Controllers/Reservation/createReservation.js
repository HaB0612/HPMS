const Reservation = require("../../models/Reservation");
const validator = require("./validator");
const Template = require("../Template");

const operation = async (req, res, employee) => {
  try {
    const { customers, rooms, checkin, checkout, adults, childs, price, isPaid, note } = req.body;
    const newReservation = await Reservation.create({ employee, customers, rooms, checkin, checkout, adults, childs, price, isPaid, note: note || "" });

    return { error: false, body: { error: false, data: newReservation, message: "success" } }
  } catch (err) {
    return { error: err }
  }
}

const validatorFunctions = (req, res, employee) => {
  const { customers, rooms, checkin, checkout, adults, childs, price, isPaid, note } = req.body;
  return [
    validator.employee(employee),
    validator.customer(customers),
    validator.room(rooms),
    validator.checkDates(checkin, checkout, null, rooms, customers),
    validator.adults(adults),
    validator.childs(childs),
    validator.price(price),
    validator.isPaid(isPaid)
  ];
}

const createReservation = Template(operation, validatorFunctions, {
  validationError: "Rezervasyon oluşturulurken hatalı veri girildi ve işlem yapılamadı.",
  serverError: "İşlem sırasında hata oluştu. Rezervasyon oluşturulamadı.",
  success: "Yeni bir rezervasyon oluşturuldu."
})

module.exports = createReservation;