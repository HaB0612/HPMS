const Reservation = require("../../models/Reservation");
const validator = require("./validator");
const Template = require("../Template");

const operation = async (req, res, employee) => {
    try {
        const reservations = await Reservation.find({});

        return { error: false, body: { error: false, message: "success", data: reservations } }
    } catch (err) {
        return { error: err }
    }
}

const validatorFunctions = (req, res, employee) => {
    return [validator.employee(employee)];
}

const getAllReservations = Template(operation, validatorFunctions, {
    validationError: "Bütün rezervasyonlar gösterilirken hatalı veri girildi ve işlem yapılamadı.",
    serverError: "İşlem sırasında hata oluştu. Bütün rezervasyon gösterilemedi.",
    success: "Bütün rezervasyonlar gösterildi."
})

module.exports = getAllReservations;