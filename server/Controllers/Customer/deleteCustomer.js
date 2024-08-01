const Customer = require("../../models/Customer");
const validator = require("../Middleware/validators");
const Template = require("../Template");

const operation = async (req, res) => {
    try { 
        await Customer.findByIdAndDelete(req.params.id);

        return { error: false, body: { error: false, message: "success" } }
    } catch (err) {
        return { error: err }
    }
}

const validatorFunctions = (req, res, employee) => {
    return  [validator.employee(employee), validator.checkCustomer(req.params.id)]
}

const deleteCustomer = Template(operation, validatorFunctions, {
    validationError: "Müşteri silinirken hatalı veri girildi ve işlem yapılamadı.",
    serverError: "İşlem sırasında hata oluştu. Müşteri silinemedi.",
    success: "Müşteri silindi."
})

module.exports = deleteCustomer;