const asyncHandler = (requestHandle) =>{
    return (req , res, next) =>{
        Promise.resolve(requestHandle(req, res , next)).catch((error)=> next(error))
    }
}

export {asyncHandler}

// const asyncHandler = (fn) => async(req , res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: true ,
//             message: error.message
//         })
//     }
// }