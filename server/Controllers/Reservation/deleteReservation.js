const Reservation = require("../../models/Reservation");
const validator = require("./validator");
const Template = require("../Template");

const operation = async (req, res, employee) => {
    try {
        await Reservation.findByIdAndDelete(req.params.id);

        return { error: false, body: { error: false, message: "success" } }
    } catch (err) {
        return { error: err }
    }
}

const validatorFunctions = (req, res, employee) => {
    const { customers, rooms, checkin, checkout, adults, childs, price, isPaid, note } = req.body;
    return [validator.employee(employee), validator.reservation(req.params.id)];
}

const deleteReservation = Template(operation, validatorFunctions, {
    validationError: "Rezervasyon silinirken hatalı veri girildi ve işlem yapılamadı.",
    serverError: "İşlem sırasında hata oluştu. Rezervasyon silinemedi.",
    success: "Rezervasyon silindi."
})

module.exports = deleteReservation;