const Customer = require("../../models/Customer");
const Employee = require("../../models/Employee");
const validator = require("../Middleware/validators");
const logEntry = require("../Middleware/logger");
const mongoose = require("mongoose");

function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

const checkCustomer = async (customerID) => {
    if (!customerID || !isValidObjectId(customerID) || !(await Customer.findById(customerID))) return "Lütfen geçerli bir müşteri seçin.";
    return false;
}

const getCustomer = async (req, res) => {
    const { user } = req;
    const employee = user ? user._id : "669e5fe5af7fd9bf9444cce4";
    const requestDetails = { method: req.method, url: req.originalUrl, headers: req.headers, body: req.body };
    let responseBody;

    try {
        const { id } = req.params;
        const validators = [validator.employee(employee), checkCustomer(id)];
        const errors = await Promise.all(validators);
        const errorsArray = errors.filter(Boolean);

        if (errorsArray.length > 0) {
            responseBody = { error: true, message: "errors", data: errorsArray }

            await logEntry({
                message: "Müşteri gösterilirken hatalı veri girildi ve işlem yapılamadı.",
                employee,
                request: requestDetails,
                response: { status: 400, headers: res.getHeaders(), body: responseBody }
            });
            return res.status(400).json(responseBody);
        }
        const customer = await Customer.findById(id);
        responseBody = { error: false, message: "success", data: customer }

        await logEntry({
            message: "Müşteri gösterildi.",
            employee,
            request: requestDetails,
            response: { status: 200, headers: res.getHeaders(), body: responseBody }
        });
        res.status(200).json(responseBody);
    } catch (error) {
        responseBody = { error: true, message: "error", data: error };
        
        await logEntry({
            message: "İşlem sırasında hata oluştu. Müşteri gösterilemedi.",
            level: "error",
            employee,
            request: requestDetails,
            response: { status: 500, headers: res.getHeaders(), body: responseBody },
            error
        });
        return res.status(500).json(responseBody);
    }
};

module.exports = getCustomer;