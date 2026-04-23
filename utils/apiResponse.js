

class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.status = "success";
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.status = "error";
    this.statusCode = statusCode;
  }
}

module.exports = { ApiResponse, ApiError };