const Log = require("../../models/Log");

const logEntry = async ({
  message,
  level = "info",
  user = {},
  request = {},
  response = {},
  error = {},
  additionalInfo = {},
}) => {
  try {
    await Log.create({
      message,
      level,
      user,
      request,
      response,
      error,
      additionalInfo,
    });
  } catch (err) {
  }
};

module.exports = logEntry;
