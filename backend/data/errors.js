
class ServerError extends Error {
    constructor(message) {
      super(message); // (1)
      this.name = "ServerError";
      this.code = 500
    }
}

class DatabaseError extends Error {
    constructor(message) {
        super(message);
        this.name = "DatabaseError"
        this.code = 500;
    }
}

class HttpError extends Error {
    constructor(message, code) {
      super(message); // (1)
      this.name = "ServerError";
      this.code = code
    }
}


module.exports = { ServerError, DatabaseError, HttpError }