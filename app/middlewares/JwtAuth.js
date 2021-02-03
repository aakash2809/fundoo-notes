require(`dotenv`).config();
const jwt = require("jsonwebtoken");


class Helper {
    genrateToken = (loginResult) => {
        return jwt.sign({
            username: loginResult.username,
            userId: loginResult.userId,
        },
            process.env.SECRET_KEY, {
            expiresIn: "24h"
        });
    }

    
    /* 
    verify=(request,response,next)=>{
    try{
        var token = request.headers.split(" ")[1];
        var decode = jwt.verify(token,'secure');
        request.userData = decode;
        next();
    }catch(error){
            response.send({
            success: false,
            status_code: 400,
            message: "auth fail",
        });
    }
    } */
}

module.exports = new Helper();