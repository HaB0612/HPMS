const Reservation = require("../../models/Reservation");
const validator = require("./validator");
const logEntry = require("../Middleware/logger");

const deleteReservation = async (req, res) => {
    const { user } = req;
    const employee = user ? user._id : "669e5fe5af7fd9bf9444cce4";
    const requestDetails = { method: req.method, url: req.originalUrl, headers: req.headers, body: req.body };
    let responseBody;

    try {
        const { id } = req.params;
        const validators = [validator.employee(employee), validator.reservation(id)];
        const errors = await Promise.all(validators);
        const errorsArray = errors.filter(Boolean);

        if (errorsArray.length > 0) {
            responseBody = { error: true, message: "errors", data: errorsArray }

            await logEntry({
                message: "Rezervasyon oluşturulurken hatalı veri girildi ve işlem yapılamadı.",
                employee,
                request: requestDetails,
                response: { status: 400, headers: res.getHeaders(), body: responseBody }
            });
            return res.status(400).json(responseBody);
        }
        responseBody = { error: false, message: "success" }

        await Reservation.findByIdAndDelete(id);
        await logEntry({
            message: "Rezervasyon silindi.",
            employee,
            request: requestDetails,
            response: { status: 200, headers: res.getHeaders(), body: responseBody }
        });
        res.status(200).json(responseBody);
    } catch (error) {
        responseBody = { error: true, message: "error", data: error };

        await logEntry({
            message: "İşlem sırasında hata oluştu. Rezervasyon silinemedi.",
            level: "error",
            employee,
            request: requestDetails,
            response: { status: 500, headers: res.getHeaders(), body: responseBody },
            error: { name: error.name, message: error.message, stack: error.stack }
        });
        return res.status(500).json(responseBody);
    }
};

module.exports = deleteReservation;