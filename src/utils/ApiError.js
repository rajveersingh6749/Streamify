
// this is production grade way to show the errors if you didn't understand it don't worry(you can ask chatgpt)
class ApiError extends Error {
    constructor(
        statusCode,
        messege = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(messege)
        this.statusCode = statusCode
        this.data = null
        this.messege = messege
        this.success = false
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}