const Room = require("../../models/Room");
const validator = require("./validator");
const Template = require("../Template");

const operation = async (req, res) => {
    try {
        const { roomNumber, roomName, price, description, adults, childs, note } = req.body;
        const newRoom = await Room.create({ roomNumber, note: note || "", roomType: { roomName, price, adults, childs, note: note || "" } });
        return { error: false, body: { error: false, data: newRoom, message: "success" } }
    } catch (err) {
        return { error: err }
    }
}

const validatorFunctions = (req, res, employee) => {
    const { roomNumber, roomName, price, description, adults, childs } = req.body;
    return [
        validator.employee(employee),
        validator.roomNumber(roomNumber, null),
        validator.roomName(roomName),
        validator.price(price),
        validator.description(description),
        validator.adults(adults),
        validator.childs(childs)
    ]
}

const createRoom = Template(operation, validatorFunctions, {
    validationError: "Oda oluşturulurken hatalı veri girildi ve işlem yapılamadı.",
    serverError: "İşlem sırasında hata oluştu. Oda oluşturulamadı.",
    success: "Yeni bir oda oluşturuldu."
})

module.exports = createRoom;