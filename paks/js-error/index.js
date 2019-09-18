/*
    js-error.js -- Error exception classes
 */

function init(self, code, message, details) {
    self.code = `PowerDown-${code}Error`
    self.name = self.constructor.name
    self.message = message
    self.details = details
    self.date = new Date()
    if (typeof Error.captureStackTrace === 'function') {
        Error.captureStackTrace(self, self.constructor)
    } else {
        self.stack = (new Error(message)).stack
    }
}

export class GeneralError extends Error {
    constructor(code, message, details) {
        super(message)
        init(this, code, message, details)
    }
}

export class AuthError extends Error {
    constructor(message, details) {
        super(message)
        init(this, 'Auth', message, details)
    }
}

export class CodeError extends Error {
    constructor(message, details) {
        super(message)
        init(this, 'Code', message, details)
    }
}

export class DataError extends Error {
    constructor(message) {
        super(message)
        init(this, 'Data', message)
    }
}

export class NetError extends Error {
    constructor(message, details) {
        super(message)
        init(this, 'Validation', message, details)
    }
}

export class OpsError extends Error {
    constructor(message, details) {
        super(message)
        init(this, 'Ops', message, details)
    }
}

export class UserError extends Error {
    constructor(message, details) {
        super(message)
        init(this, 'User', message, details)
    }
}

export class ValidationError extends Error {
    constructor(message, details) {
        super(message)
        init(this, 'Validation', message, details)
    }
}
