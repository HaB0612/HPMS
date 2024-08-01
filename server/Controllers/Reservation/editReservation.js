const Reservation = require("../../models/Reservation");
const validator = require("./validator");
const Template = require("../Template");

const operation = async (req, res, employee) => {
  try {
    const { customers, rooms, checkin, checkout, adults, childs, price, isPaid, note } = req.body;
    const newReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { customers, rooms, checkin, checkout, childs, price, isPaid, note: note || "" },
      { new: true }
    );

    return { error: false, body: { error: false, data: newReservation, message: "success" } }
  } catch (err) {
    return { error: err }
  }
}

const validatorFunctions = (req, res, employee) => {
  const { customers, rooms, checkin, checkout, adults, childs, price, isPaid } = req.body;
  return [
    validator.reservation(req.params.id),
    validator.employee(employee),
    validator.customer(customers),
    validator.room(rooms),
    validator.checkDates(checkin, checkout, req.params.is, rooms, customers),
    validator.adults(adults),
    validator.childs(childs),
    validator.price(price),
    validator.isPaid(isPaid),
  ];
}

const editReservation = Template(operation, validatorFunctions, {
  validationError: "Rezervasyon düzenlenirken hatalı veri girildi ve işlem yapılamadı.",
  serverError: "İşlem sırasında hata oluştu. Rezervasyon düzenlenemedi.",
  success: "Bir rezervasyon düzenlendi."
})

module.exports = editReservation;