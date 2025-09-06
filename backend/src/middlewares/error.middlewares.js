const error = (err,req,res,next) => {

    if(err.name==="ValidationError"){
        err.message = Object.values(err.errors)
        .map((err)=>err.message)
        .join(", ")
        err.statusCode = 400
    }

    if(err.code===11000){
        err.message = `Provided ${Object.keys(err.keyValue)[0]} is already in use`
        err.statusCode = 409;
    }

    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    res.status(err.statusCode).json({
        success:false,
        message:err.message,
        errObj:err
    })
}

module.exports = error;
