const Customer = require("../../models/Customer");
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

const editCustomer = async (req, res) => {
    const { user } = req;
    const employee = user ? user._id : "669e5fe5af7fd9bf9444cce4";
    const requestDetails = { method: req.method, url: req.originalUrl, headers: req.headers, body: req.body };
    let responseBody;

    try {
        const { id } = req.params;
        const { name, tckn, address, email, gender, phone, nation, note } = req.body;
        const validators = [
            validator.name(name),
            validator.tckn(tckn),
            validator.address(address),
            validator.email(email),
            validator.gender(gender),
            validator.phone(phone),
            validator.nation(nation),
            checkCustomer(id)
        ];
        const errors = await Promise.all(validators);
        const errorsArray = errors.filter(Boolean);

        if (errorsArray.length > 0) {
            responseBody = { error: true, message: "errors", data: errorsArray };

            await logEntry({
                message: "Müşteri düzenlenirken hatalı veri girildi ve işlem yapılamadı.",
                employee,
                request: requestDetails,
                response: { status: 400, headers: res.getHeaders(), body: responseBody }
            });
            return res.status(400).json(responseBody);
        }
        const newCustomer = await Customer.findByIdAndUpdate(
            id,
            { name, tckn, address, email, gender, phone, nation, note: note || "" },
            { new: true }
        );
        responseBody = { error: false, data: newCustomer, message: "success" };

        await logEntry({
            message: "Bir Müşteri düzenlendi.",
            employee,
            request: requestDetails,
            response: { status: 201, headers: res.getHeaders(), body: responseBody }
        });
        return res.status(201).json(responseBody);
    } catch (error) {
        responseBody = { error: true, message: "error", data: error };

        await logEntry({
            message: "İşlem sırasında hata oluştu. Müşteri düzenlenemedi.",
            level: "error",
            employee,
            request: requestDetails,
            response: { status: 500, headers: res.getHeaders(), body: responseBody },
            error
        });
        return res.status(500).json(responseBody);
    }
};

module.exports = editCustomer;