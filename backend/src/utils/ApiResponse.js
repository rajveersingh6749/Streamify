// It is industry grade response if you don't get it don't worry(or you can ask chatgpt)

class ApiResponse {
    constructor(statusCode, data, messege="Success") {
        this.statusCode = statusCode
        this.data = data
        this.messege = messege
        this.success = statusCode < 400
    }
}

export { ApiResponse }