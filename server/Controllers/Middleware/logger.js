const Log = require("../../models/Log");

const logEntry = async ({
  message,
  level = "info",
  employee = {},
  request = {},
  response = {},
  error = {},
  additionalInfo = {},
}) => {
  try {
    await Log.create({
      message,
      level,
      employee,
      request,
      response,
      error,
      additionalInfo,
    });
  } catch (err) {
  }
};

module.exports = logEntry;
