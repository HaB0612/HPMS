const Room = require("../../models/Room");
const validator = require("./validator");
const Template = require("../Template");

const operation = async (req, res) => {
    try {
        const rooms = await Room.find({});
        return { error: false, body: { error: false, message: "success", data: rooms } }
    } catch (err) {
        return { error: err }
    }
}

const validatorFunctions = (req, res, employee) => {
    return [validator.employee(employee)]
}

const getAllRooms = Template(operation, validatorFunctions, {
    validationError: "Bütün odalar gösterilirken hatalı veri girildi ve işlem yapılamadı.",
    serverError: "İşlem sırasında hata oluştu. Bütün odalar gösterilemedi.",
    success: "Bütün odalar gösterildi."
})

module.exports = getAllRooms;