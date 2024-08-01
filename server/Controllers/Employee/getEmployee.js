const Employee = require("../../models/Employee");
const validator = require("../Middleware/validators");
const Template = require("../Template");

const operation = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        return { error: false, body: { error: false, message: "success", data: employee } }
    } catch (err) {
        return { error: err }
    }
}

const validatorFunctions = (req, res, employee) => {
    return [
        validator.permEmployee(employee),
        validator.checkEmployee(req.params.id)
    ]
}

const getEmployee = Template(operation, validatorFunctions, {
    validationError: "Çalışan gösterilirken hatalı veri girildi ve işlem yapılamadı.",
    serverError: "İşlem sırasında hata oluştu. Çalışan gösterilemedi.",
    success: "Çalışan gösterildi.."
})

module.exports = getEmployee;