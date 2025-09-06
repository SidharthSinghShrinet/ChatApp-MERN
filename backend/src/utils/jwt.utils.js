const jwt = require('jsonwebtoken');

const generateJWTToken = (payload) => {
    return jwt.sign({payload},process.env.JWT_SECRET,{expiresIn:"90d"});
}

module.exports = generateJWTToken;