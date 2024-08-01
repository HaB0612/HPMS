const Room = require("../../models/Room");
const validator = require("./validator");
const Template = require("../Template");

const operation = async (req, res) => {
    try {
        const room = await Room.findOne({ _id: req.params.id });
        return { error: false, body: { error: false, message: "success", data: room } }
    } catch (err) {
        return { error: err }
    }
}

const validatorFunctions = (req, res, employee) => {
    return [validator.employee(employee), validator.room(req.params.id)]
}

const getRoom = Template(operation, validatorFunctions, {
    validationError: "Oda gösterilirken hatalı veri girildi ve işlem yapılamadı.",
    serverError: "İşlem sırasında hata oluştu. Oda gösterilemedi.",
    success: "Oda gösterildi."
})

module.exports = getRoom;