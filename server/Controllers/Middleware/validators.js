const Customer = require("../../models/Customer");
const Reservation = require("../../models/Reservation");
const Room = require("../../models/Room");
const Employee = require("../../models/Employee");
const mongoose = require("mongoose");
const dateRegex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
const phoneRegex = /^\+?[1-9]\d{1,14}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
const validateField = async (value, condition, errorMessage) => {
  if (await condition(value)) {
    return errorMessage;
  }
  return false;
};

const validators = {
  checkCustomer: async (customerID) => { if (!customerID || !isValidObjectId(customerID) || !(await Customer.findById(customerID))) return "Lütfen geçerli bir müşteri seçin."; return false },
  employee: async (employeeID) => { if (!employeeID || !isValidObjectId(employeeID) || !(await Employee.findById(employeeID))) return "Lütfen geçerli bir kimlikle giriş yapın."; return false },
  checkEmployee: async (employeeID) => { if (!employeeID || !isValidObjectId(employeeID) || !(await Employee.findById(employeeID))) return "Lütfen geçerli bir çalışan seçin."; return false; },
  permEmployee: async (employee) => { if (employee !== process.env.MASTEREMPLOYEEID) { return "Çalışan oluşturma yetkiniz yok." } else { return false } },
  name: async (name) => validateField(name, v => !v, "Lütfen bir isim girin."),
  tckn: async (tckn) => validateField(tckn, v => !v, "Lütfen bir TCKN veya Pasaport No girin."),
  phone: async (phone) => validateField(phone, v => !v || !phoneRegex.test(v), "Lütfen geçerli bir telefon numarası girin."),
  email: async (email) => validateField(email, v => !v || !emailRegex.test(v), "Lütfen geçerli bir email adresi girin."),
  dob: async (dob) => validateField(dob, v => !v || !dateRegex.test(v) || isNaN(new Date(v).getTime()), "Lütfen (YYYY-MM-DD) formatında bir doğum tarihi girin."),
  gender: async (gender) => validateField(gender, v => !v, "Lütfen bir cinsiyet girin."),
  address: async (address) => validateField(address, v => !v, "Lütfen bir adres girin."),
  nation: async (nation) => validateField(nation, v => !v, "Lütfen bir uyruk girin."),
  username: async (username) => validateField(username, v => !v, "Lütfen bir isim girin."),
  job: async (job) => validateField(job, v => !v, "Lütfen bir iş girin."),
  salary: async (salary) => validateField(salary, v => !v || !Number.isInteger(v), "Lütfen rakam kullanarak maaş girin."),
  jobStartDate: async (jobStartDate) => validateField(jobStartDate, v => !v || !dateRegex.test(v) || isNaN(new Date(v).getTime()), "Lütfen iş başlama tarihini (YYYY-MM-DD) formatında girin."),
  jobDescription: async (jobDescription) => validateField(jobDescription, v => !v, "Lütfen bir iş açıklaması girin."),
  contact: async (contact) => validateField(contact, v => !v, "Lütfen bir iletişim bilgisi girin."),
  location: async (location) => validateField(location, v => !v, "Lütfen bir adres girin."),
  capacity: async (capacity) => validateField(capacity, v => !v || !Number.isInteger(v), "Lütfen rakam kullanarak kapasite girin."),
  totalRooms: async (totalRooms) => validateField(totalRooms, v => !v || !Number.isInteger(v), "Lütfen rakam kullanarak oda sayısını girin."),
  description: async (description) => validateField(description, v => !v, "Lütfen bir açıklama girin."),
};

module.exports = validators;