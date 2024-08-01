const Room = require("../../models/Room");
const validator = require("./validator");
const Template = require("../Template");

const operation = async (req, res) => {
    try {
        await Room.findByIdAndDelete(req.params.id);
        return { error: false, body: { error: false, message: "success" } }
    } catch (err) {
        return { error: err }
    }
}

const validatorFunctions = (req, res, employee) => {
    return [validator.employee(employee), validator.room(req.params.id)]
}

const deleteRoom = Template(operation, validatorFunctions, {
    validationError: "Oda silinirken hatalı veri girildi ve işlem yapılamadı.",
    serverError: "İşlem sırasında hata oluştu. Oda silinemedi.",
    success: "Oda silindi."
})

module.exports = deleteRoom;