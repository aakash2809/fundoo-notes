
const jwt = require("jsonwebtoken");
module.exports=(request,response,next)=>{
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
  
}