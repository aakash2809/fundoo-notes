const mongoose = require(`mongoose`);
const logger = require("../../config/logger");
const bycrypt = require('bcryptjs');
const DOMAIN = '7e2b330164874c529580aad93c2b9845.mailgun.org'
const mailgun = require(`mailgun-js`)({apikey:`3dc3ebf961a288caeec9c97a583f14f6-77751bfc-70a4b08a`, domain:DOMAIN});
require(`dotenv`).config();


//const mg = mailgun

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
       },
       resetLink:{
           data: String,
           default:''
       }
},
    { timestamps: true }
);

userSchema.set('versionKey', false);

userSchema.pre("save", async function (next) {
    this.password = await bycrypt.hash(this.password, 10);
    this.confirmPassword = undefined;
    next();
})

logger.info('inside model');
const User = mongoose.model(`userRegistration`, userSchema);

class UserModel {
    /**
      * @description save request data to database 
      * @param {*} registrationData holds data to be saved in json formate
      * @param {*} callback holds a function 
     */
    register = (registrationData, callback) => {
        logger.info(`TRACKED_PATH: Inside model`);
        const userRegistration = new User(registrationData);
        userRegistration.save((error, registrationResult) => {
            (error) ? callback(error, null) : callback(null, registrationResult);
        })
    }

    /**
      * @description find email id in database and validate
      * @param {*} loginCredential holds login credentials
      * @param {*} callback holds a function 
     */
    validateLoginCredentialAndReturnResult = (loginCredential, callback) => {
        const email = loginCredential.email;
        User.find({ email: `${email}` }, (error, loginResult) => {
            (error) ? callback(error, null) : callback(null, loginResult);
        });
    }
    forgetPassword  = (email, callback) => {
       console.log("inside model",email)
        User.findOne(email, (error,user) => {
            if(error || !user) {
                let error = "User with this email id does not exist"
                callback(error, null)
            }else { 
                var token = jwtAuth.genrateToken(user);
                const data ={
                    from: 'aakashrajak2809@gmail.com',
                    to: email,
                    subject :'Account Activation Link',
                    html:` 
                    <h2>please click on click on given link to reset your password<h2>
                    <p> ${process.env.CLIENT_URL}/resetpassword/${token}</p>
                    `    
                 }
                User.updateOne({resetLink: token},(error,sucess)=>{
                    if(error){
                        let error = "reset password link error"
                        callback(error, null)
                    }else{
                        mg.message.send(data,(error,sucess)=>{
                            if(error){
                                callback(error, null)
                            }else{
                                sucess = "Email has been sent,kindly follow the instructions"
                                callback(null, sucess);
                            }
                        })
                   }
                })
                
            }
        });
    }
}

module.exports = new UserModel;
