const logEntry = require("./Middleware/logger");

const Template = (operation, validatorFunctions, logMessages) => {
    return async (req, res) => {
        const { user } = req;
        const employee = user ? user._id : "669e5fe5af7fd9bf9444cce4";
        const requestDetails = { method: req.method, url: req.originalUrl, headers: req.headers, body: req.body };
        let responseBody;

        try {
            const errors = await Promise.all(validatorFunctions(req, res, employee));
            const errorsArray = errors.filter(Boolean);

            if (errorsArray.length > 0) {
                responseBody = { error: true, message: "errors", data: errorsArray };

                await logEntry({
                    message: logMessages.validationError,
                    employee,
                    request: requestDetails,
                    response: { status: 400, headers: res.getHeaders(), body: responseBody }
                });
                return res.status(400).json(responseBody);
            }

            await operation(req, res,employee).then(async (response) => {
                if (response.error) {
                    
                    responseBody = { error: true, message: "error", data: response.error };
                    
                    await logEntry({
                        message: logMessages.serverError,
                        level: "error",
                        employee,
                        request: requestDetails,
                        response: { status: 500, headers: res.getHeaders(), body: responseBody },
                        error: response.error
                    });
                    return res.status(500).json(responseBody);
                }
                await logEntry({
                    message: logMessages.success,
                    employee,
                    request: requestDetails,
                    response: { status: 201, headers: res.getHeaders(), body: response.body }
                });
                return res.status(201).json(response.body);
            })
        } catch (error) {
            responseBody = { error: true, message: "error", data: error };

            await logEntry({
                message: logMessages.serverError,
                level: "error",
                employee,
                request: requestDetails,
                response: { status: 500, headers: res.getHeaders(), body: responseBody },
                error
            });
            return res.status(500).json(responseBody);
        }
    };
};

module.exports = Template;