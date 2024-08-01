const Employee = require("../../models/Employee");
const validator = require("../Middleware/validators");
const Template = require("../Template");

const isEmailRegistered = async (email) => {
    const employee = await Employee.findOne({ 'contact.email': email });
    return employee ? "Lütfen daha önce kaydedilmemiş bir email giriniz." : false;
}

const operation = async (req, res) => {
    try {
        const { name, job, salary, jobStartDate, jobDescription, tckn, phone, email, address, note, dob } = req.body;
        const newEmployee = await Employee.create({ name, job, salary, jobStartDate, jobDescription, contact: { tckn, phone, email, address }, note: note || "", dob });

        return { error: false, body: { error: false, data: newEmployee, message: "success" } }
    } catch (err) {
        return { error: err }
    }
}

const validatorFunctions = (req, res, employee) => {
    const { name, job, salary, jobStartDate, jobDescription, tckn, phone, email, address, note, dob } = req.body;
    return [
        validator.name(name),
        validator.job(job),
        validator.salary(salary),
        validator.jobStartDate(jobStartDate),
        validator.jobDescription(jobDescription),
        validator.tckn(tckn),
        validator.phone(phone),
        isEmailRegistered(email),
        validator.address(address),
        validator.dob(dob),
        validator.permEmployee(employee)
    ]
}

const createEmployee = Template(operation, validatorFunctions, {
    validationError: "Çalışan oluşturulurken hatalı veri girildi ve işlem yapılamadı.",
    serverError: "İşlem sırasında hata oluştu. Çalışan oluşturulamadı.",
    success: "Yeni bir çalışan oluşturuldu."
})

module.exports = createEmployee;