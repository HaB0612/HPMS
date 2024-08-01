const Reservation = require("../../models/Reservation");
const validator = require("./validator");
const Template = require("../Template");

const operation = async (req, res, employee) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        return { error: false, body: { error: false, message: "success", data: reservation } }
    } catch (err) {
        return { error: err }
    }
}

const validatorFunctions = (req, res, employee) => {
    return [validator.employee(employee), validator.reservation(req.params.id)];
}

const getReservation = Template(operation, validatorFunctions, {
    validationError: "Rezervasyon gösterilirken hatalı veri girildi ve işlem yapılamadı.",
    serverError: "İşlem sırasında hata oluştu. Rezervasyon gösterilemedi.",
    success: "Rezervasyon gösterildi."
})

module.exports = getReservation;