const Employee = require("../../models/Employee");
const validator = require("../Middleware/validators");
const Template = require("../Template");

const operation = async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);

        return { error: false, body: { error: false, message: "success" } }
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

const deleteEmployee = Template(operation, validatorFunctions, {
    validationError: "Çalışan silinirken hatalı veri girildi ve işlem yapılamadı.",
    serverError: "İşlem sırasında hata oluştu. Çalışan silinemedi.",
    success: "Çalışan  silindi."
})

module.exports = deleteEmployee;