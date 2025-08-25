// --SECOND WAY--
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}

export {asyncHandler}



// --FIRST WAY--

// this is higher order function(read in javascript)-> these functions can take another functions as an argument and can also return a function
// so the function that i've written below has meaning like:
// ✅ So your interpretation:
// Step 1: asyncHandler = () => {} (just a normal function)
// Step 2: asyncHandler = (fn) => {} (takes another function as input)
// Step 3: asyncHandler = (fn) => { () => {} } (returns another function)

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false, 
//             messege: error.messege
//         })
//     }
// } 