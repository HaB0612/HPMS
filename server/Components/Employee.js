var express = require("express");
var router = express.Router();
const { createEmployee, editEmployee, deleteEmployee, getEmployee, getAllEmployees } = require('../Controllers/Employee');

router.post("/", createEmployee);
router.put("/:id", editEmployee)
router.get("/:id", getEmployee)
router.delete("/:id", deleteEmployee)
router.get("/", getAllEmployees)

module.exports = router;
