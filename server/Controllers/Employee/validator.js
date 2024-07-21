const mongoose = require("mongoose");
const phoneRegex = /^\+?[1-9]\d{1,14}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const dateRegex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

const employeeValidator = {
  username: async (username) => {
    if (!username) return "Lütfen bir isim girin.";
    return false;
  },
  job: async (job) => {
    if (!job) return "Lütfen bir iş girin.";
    return false;
  },
  salary: async (salary) => {
    if (!salary || !Number.isInteger(salary))
      return "Lütfen rakam kullanara maaş girin.";
    return false;
  },
  jobStartDate: async (jobStartDate, update) => {
    if (update) {
      if (jobStartDate && !dateRegex.test(jobStartDate))
        return "Lütfen iş başlama tarihini (YYYY-MM-DD) formatında girin.";
    } else {
      if (!jobStartDate || !dateRegex.test(jobStartDate))
        return "Lütfen iş başlama tarihini (YYYY-MM-DD) formatında girin.";
    }
    return false;
  },
  jobDescription: async (jobDescription) => {
    if (!jobDescription) return "Lütfen bir iş açıklaması girin.";
    return false;
  },
  contact: async (contact) => {
    if (!contact) return "Lütfen bir iletişim bilgisi girin.";
    return false;
  },
  dob: async (dob, update) => {
    if (update) {
      if (dob && !dateRegex.test(dob))
        return "Lütfen (YYYY-MM-DD) formatında doğum tarihi girin.";
    } else {
      if (!dob || !dateRegex.test(dob))
        return "Lütfen (YYYY-MM-DD) formatında doğum tarihi girin.";
    }
    return false;
  },
  tckn: async (tckn) => {
    if (!tckn) return "Lütfen bir TCKN veya Pasaport No girin.";
    return false;
  },
  phone: async (phone, update) => {
    if (update) {
      if (phone && !phoneRegex.test(phone))
        return "Lütfen geçerli bir telefon numarası girin.";
    } else {
      if (!phone || !phoneRegex.test(phone))
        return "Lütfen geçerli bir telefon numarası girin.";
    }
    return false;
  },
  email: async (email, update) => {
    if (update) {
      if (email && !emailRegex.test(email))
        return "Lütfen geçerli bir email adresi girin.";
    } else {
      if (!email || !emailRegex.test(email))
        return "Lütfen geçerli bir email adresi girin.";
    }
    return false;
  },
  address: async (address) => {
    if (!address) return "Lütfen bir adres girin.";
    return false;
  },
};
