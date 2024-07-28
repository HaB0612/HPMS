const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new mongoose.Schema({
  tckn: { type: String },
  phone: { type: Number },
  email: { type: String, unique: true },
  address: { type: String },
});

const employeeSchema = new mongoose.Schema({
  name: { type: String },
  job: { type: String },
  salary: { type: Number },
  jobStartDate: { type: String },
  jobDescription: { type: String },
  contact: { type: contactSchema },
  note: { type: String, required: false },
  dob: { type: String },
});
    
module.exports = mongoose.model("Employee", employeeSchema);