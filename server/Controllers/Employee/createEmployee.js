const Employee = require("../../models/Employee");
const validator = require("../Middleware/validators");
const logEntry = require("../Middleware/logger");

const createEmployee = async (req, res) => {
    const { user } = req;
    const employee = user ? user._id : "669e5fe5af7fd9bf9444cce4";
    const requestDetails = { method: req.method, url: req.originalUrl, headers: req.headers, body: req.body };
    let responseBody;

    try {
        const { name, job, salary, jobStartDate, jobDescription, tckn, phone, email, address, note, dob } = req.body;
        const validators = [
            validator.name(name),
            validator.job(job),
            validator.salary(salary),
            validator.jobStartDate(jobStartDate),
            validator.jobDescription(jobDescription),
            validator.tckn(tckn),
            validator.phone(phone),
            validator.email(email),
            validator.address(address),
            validator.dob(dob),
            async (employeeID) => { if (employeeID !== process.env.MASTEREMPLOYEEID) { return "Çalışan oluşturma yetkiniz yok." } else { return false } },
        ];
        const errors = await Promise.all(validators);
        const errorsArray = errors.filter(Boolean);

        if (errorsArray.length > 0) {
            responseBody = { error: true, message: "errors", data: errorsArray }

            await logEntry({
                message: "Çalışan oluşturulurken hatalı veri girildi ve işlem yapılamadı.",
                employee,
                request: requestDetails,
                response: { status: 400, headers: res.getHeaders(), body: responseBody }
            });
            return res.status(400).json(responseBody);
        }
        const newEmployee = await Employee.create({ name, job, salary, jobStartDate, jobDescription, contact: { tckn, phone, email, address }, note: note || "", dob });
        responseBody = { error: false, data: newEmployee, message: "success" }

        await logEntry({
            message: "Yeni bir çalışan oluşturuldu.",
            employee,
            request: requestDetails,
            response: { status: 201, headers: res.getHeaders(), body: responseBody }
        });
        return res.status(201).json(responseBody);
    } catch (error) {
        responseBody = { error: true, message: "error", data: error },

            await logEntry({
                message: "İşlem sırasında hata oluştu. Çalışan oluşturulamadı.",
                level: "error",
                employee,
                request: requestDetails,
                response: { status: 500, headers: res.getHeaders(), body: responseBody },
                error
            });
        return res.status(500).json(responseBody);
    }
};

module.exports = createCustomer;