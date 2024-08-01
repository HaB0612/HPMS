const Customer = require("../../models/Customer");
const validator = require("../Middleware/validators");
const Template = require("../Template");

const operation = async (req, res) => {
    try { 
        const customers = await Customer.find({});

        return { error: false, body: { error: false, message: "success", data: customers } }
    } catch (err) {
        return { error: err }
    }
}

const validatorFunctions = (req, res, employee) => {
    return [validator.employee(employee)]
}

const getAllCustomers = Template(operation, validatorFunctions, {
    validationError: "Bütün müşteriler gösterilirken hatalı veri girildi ve işlem yapılamadı.",
    serverError: "İşlem sırasında hata oluştu. Bütün müşteriler gösterilemedi.",
    success: "Bütün müşteriler gösterildi."
})

module.exports = getAllCustomers;