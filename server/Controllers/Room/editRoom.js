const Room = require("../../models/Room");
const validator = require("./validator");
const Template = require("../Template");

const operation = async (req, res) => {
    try {
        const { roomNumber, roomName, price, description, adults, childs, note} = req.body;
        const newRoom = await Room.findByIdAndUpdate(
            req.params.id,
            { roomNumber, note: note || "", roomType: { roomName, price, adults, childs, note: note || "" } },
            { new: true }
        );
        return { error: false, body: { error: false, data: newRoom, message: "success" } }
    } catch (err) {
        return { error: err }
    }
}

const validatorFunctions = (req, res, employee) => {
    const { roomNumber, roomName, price, description, adults, childs, note} = req.body;
    return [
        validator.room(req.params.id),
        validator.employee(employee),
        validator.roomNumber(roomNumber, req.params.id),
        validator.roomName(roomName),
        validator.price(price),
        validator.description(description),
        validator.adults(adults),
        validator.childs(childs)
    ]
}

const editRoom = Template(operation, validatorFunctions, {
    validationError: "Oda düzenlenirken hatalı veri girildi ve işlem yapılamadı.",
    serverError: "İşlem sırasında hata oluştu. Oda düzenlenemedi.",
    success: "Oda düzenlendi."
})

module.exports = editRoom;