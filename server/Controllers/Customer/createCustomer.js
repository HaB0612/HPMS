const Customer = require("../../models/Customer");
const validator = require("../Middleware/validators");
const Template = require("../Template");

const operation = async (req, res) => {
    try {
        const { name, tckn, address, email, gender, phone, nation, note } = req.body;
        const newCustomer = await Customer.create({ name, tckn, address, email, gender, phone, nation, note: note || "" });

        return { error: false, body: { error: false, data: newCustomer, message: "success" } }
    } catch (err) {
        return { error: err }
    }
}

const validatorFunctions = (req, res, employee) => {
    const { name, tckn, address, email, gender, phone, nation, note } = req.body;
    return [
        validator.name(name),
        validator.tckn(tckn),
        validator.address(address),
        validator.email(email),
        validator.gender(gender),
        validator.phone(phone),
        validator.nation(nation),
        validator.employee(employee)
    ]
}

const createCustomer = Template(operation, validatorFunctions, {
    validationError: "Müşteri oluşturulurken hatalı veri girildi ve işlem yapılamadı.",
    serverError: "İşlem sırasında hata oluştu. Müşteri oluşturulamadı.",
    success: "Yeni bir müşteri oluşturuldu."
})

module.exports = createCustomer;