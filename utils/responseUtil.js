// utils/responseUtil.js

/**
 * Send a standardized response structure.
 *
 * @param {Object} res - The Express response object.
 * @param {number} statusCode - The HTTP status code of the response.
 * @param {boolean} success - Indicates if the operation was successful.
 * @param {string} message - A human-readable message.
 * @param {Object} [data] - Optional data to include in the response.
 */
function sendResponse(res, statusCode, success, message, data = null) {
  const response = {
    success,
    message,
    data,
  };

  res.status(statusCode).json(response);
}

module.exports = sendResponse;
