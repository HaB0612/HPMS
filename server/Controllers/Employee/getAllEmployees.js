const Employee = require("../../models/Employee");
const validator = require("../Middleware/validators");
const Template = require("../Template");

const operation = async (req, res) => {
    try {
        const employees = await Employee.find({});

        return { error: false, body: { error: false, message: "success", data: employees } }
    } catch (err) {
        return { error: err }
    }
}

const validatorFunctions = (req, res, employee) => {
    return [validator.permEmployee(employee)]
}

const getAllEmployees = Template(operation, validatorFunctions, {
    validationError: "Bütün çalışanlar gösterilirken hatalı veri girildi ve işlem yapılamadı.",
    serverError: "İşlem sırasında hata oluştu. Bütün çalışanlar gösterilemedi.",
    success: "Bütün çalışanlar gösterildi."
})

module.exports = getAllEmployees;