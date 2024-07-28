const Room = require("../../models/Room");
const validator = require("./validator");
const logEntry = require("../Middleware/logger");

const editRoom = async (req, res) => {
    const { user } = req;
    const employee = user ? user._id : "669e5fe5af7fd9bf9444cce4";
    const requestDetails = { method: req.method, url: req.originalUrl, headers: req.headers, body: req.body };
    let responseBody;

    try {
        const { id } = req.params;
        const { roomNumber, roomName, price, description, adults, childs, features, note } = req.body;
        const validators = [
            validator.room(id),
            validator.employee(employee),
            validator.roomNumber(roomNumber, id),
            validator.roomName(roomName),
            validator.price(price),
            validator.description(description),
            validator.adults(adults),
            validator.features(features),
            validator.childs(childs)
        ];
        const errors = await Promise.all(validators);
        const errorsArray = errors.filter(Boolean);

        if (errorsArray.length > 0) {
            responseBody = { error: true, message: "errors", data: errorsArray };

            await logEntry({
                message: "Oda düzenlenirken hatalı veri girildi ve işlem yapılamadı.",
                employee,
                request: requestDetails,
                response: { status: 400, headers: res.getHeaders(), body: responseBody }
            });
            return res.status(400).json(responseBody);
        }
        const newRoom = await Room.findByIdAndUpdate(
            id,
            { roomNumber, note: note || "", roomType: { roomName, price, adults, childs, features, note: note || "" } },
            { new: true }
        );
        responseBody = { error: false, data: newRoom, message: "success" };

        await logEntry({
            message: "Bir oda düzenlendi.",
            employee,
            request: requestDetails,
            response: { status: 201, headers: res.getHeaders(), body: responseBody }
        });
        return res.status(201).json(responseBody);
    } catch (error) {
        responseBody = { error: true, message: "error", data: error };

        await logEntry({
            message: "İşlem sırasında hata oluştu. Oda düzenlenemedi.",
            level: "error",
            employee,
            request: requestDetails,
            response: { status: 500, headers: res.getHeaders(), body: responseBody },
            error
        });
        return res.status(500).json(responseBody);
    }
};

module.exports = editRoom;