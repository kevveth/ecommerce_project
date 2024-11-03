const CustomError = require("../utils/CustomErrorHandler");

// Function to handle errors in development mode
const devErrors = (error, res) => {
  // Send a detailed error response with stack trace
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};

// Function to handle errors in production mode
const prodErrors = (error, res) => {
  // If the error is operational, send a concise error message
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  } else {
    // For non-operational errors, send a generic error message
    res.status(500).json({
      status: "error",
      message: "Something went wrong! OHHH NOOOOO!",
    });
  }
};

// Function to handle invalid input errors
const invalidInputHandler = (err) => {
  // Create a custom error with a specific message and status code
  const message =
    "Invalid input data. Please provide data in the correct format.";
  return new CustomError(message, 400);
};

missingUserHandler = (err) => {
  const message = "That user is not present in the table."
  return new CustomError(message, 400);
}

// Global error handling middleware
module.exports = function (error, req, res, next) {
  // Set default status code and status if not already defined
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  // Handle errors differently based on the environment (development or production)
  if (process.env.NODE_ENV === "development") {
    devErrors(error, res);
  } else if (process.env.NODE_ENV === "production") {
    let err = JSON.parse(JSON.stringify(error))
    // Handle invalid input errors specifically in production
    if (err.code === "22P02") {
      err = invalidInputHandler(err);
    } else if (err.code === "23503") {
      err = missingUserHandler(err)
    }

    prodErrors(err, res);
  }
};
