var express = require("express");
var router = express.Router();
const { createCustomer, getCustomer, editCustomer, getAllCustomers, deleteCustomer } = require('../Controllers/Customer');

router.post("/", createCustomer);
router.put("/:id", editCustomer)
router.get("/:id", getCustomer)
router.delete("/:id", deleteCustomer)
router.get("/", getAllCustomers)

module.exports = router;
