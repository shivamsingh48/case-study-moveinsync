class ApiError extends Error {
    constructor(statusCode, message) {
      super(message);
      this.statusCode = statusCode;
      this.success=this.success>=400?false:true
    }
  }

export {ApiError}