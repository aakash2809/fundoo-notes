/**
 * @module       test
 * @description  test contain test.js which is having all testcases
 * @requires     chai-http is to HTTP integration testing
 * @requires     server  is to connect with server
 * @requires     testSamplesUserRegistration.json is to retrive sample object for testing
 * @author       Aakash Rajak <aakashrajak2809@gmail.com>     
-----------------------------------------------------------------------------------------------*/

const chai = require('chai');
const server = require('../server');
const chaiHttp = require('chai-http');
const forgotPassword = require('./testSamples/forgotPassword.json');
const loginSamples = require('./testSamples/loginSamples.json');
const registrationSamples = require('./testSamples/registration.json');
const resetPassword = require('./testSamples/resetPassword.json');
const userController = require('../app/controllers/userControllers/user');
const userServices = require('../app/services/userServices/user');
const userModelFunctions = require('../app/models/userModel');
const responseCode = require('../util/staticFile.json');
const jwtAuth = require('../app/middlewares/JwtAuth');
const resposnsCode = require("../util/staticFile.json");
const { describe } = require('../app/middlewares/validator');
chai.should();
var assert = chai.assert;
chai.use(chaiHttp);
var expect = chai.expect;
describe('Test API', () => {

    /**
      * @deprecated user registration test
      */
    describe('POST /register', () => {

        it.only('WhenGivenProperEndPointsAndCorrectInputAndNotRegistered_shouldReturn_registeredUserDetail', (done) => {
            chai.request(server)
                .post('/register')
                .send(registrationSamples.sample9)
                .end((request, response) => {
                    response.should.have.status(resposnsCode.SUCCESS);
                    response.body.should.be.a('Object');
                    response.body.data.should.have.property("name");
                    response.body.data.should.have.property("email");
                    response.body.data.should.have.property("password");
                    response.body.data.name.should.have.equal(registrationSamples.sample9.name);
                    response.body.data.email.should.have.equal(registrationSamples.sample9.email);
                })
            done();
        })
    })

    /**
     * @deprecated user login test
     */
    describe('POST /login', () => {
        it('WhenGivenProperEndPointsAndInputCredentialsCorrect_shouldReturn_SuccessMessageAndStatus', (done) => {
            chai.request(server)
                .post('/login')
                .send(loginSamples.sample4)
                .end((request, response) => {
                    response.should.have.status(resposnsCode.SUCCESS);
                    response.body.should.be.a('Object');
                    response.body.should.have.property("message");
                    response.body.message.should.have.equal("login successfull");
                })
            done();
        })
    })

    /**
       * @description user forgotPassword test
       */
    describe('POST /forgotPassword', () => {
        it('WhenGivenProperEndPointsAndInputCorrect_shouldReturn_SuccessStatusAndResetLink', (done) => {
            chai.request(server)
                .post('/forgotPassword')
                .send(forgotPassword.sample1)
                .end((request, response) => {
                    response.should.have.status(resposnsCode.SUCCESS);
                    response.body.should.be.a('Object');
                })
            done();
        })
    })
});

/**
  * @description Testing of user service's functions
  */
describe('Test userServices', () => {
    describe("userServices extractObjectFromArray()", () => {
        it("WhenObjectInArrayPass_shouldReturn_ObjectExtractedFromArray", () => {
            let jsonObject = userServices.extractObjectFromArray(
                [{
                    "name": "Manoj",
                    "email": "rmanojkumar@gmail.com",
                    "password": "Manojkumar23@",
                    "confirmPassword": "Manojkumar23@"
                }]
            );
            jsonObject.should.be.a('Object');
        })

        it("WhenNoObjectInArrayPass_shouldReturn_Null", () => {
            let jsonObject = userServices.extractObjectFromArray(
                [ ]
            );
            expect(jsonObject).to.be.a('null')
        })
    });

    describe("userServices registerUser()", () => {
        it("WhenNewUserOjectPass_shouldReturn_RegisteredUser", () => {
            userServices.registerUser(registrationSamples.sample9, (error, registrationResult) => {
                console.log(registrationResult);
                registrationResult.should.have.property("name");
                registrationResult.should.have.property("email");
                registrationResult.should.have.property("password");
                registrationResult.name.should.have.equal(registrationSamples.sample9.name);
                registrationResult.email.should.have.equal(registrationSamples.sample9.email);
            })
        })
        it("WhenRegisteredOjectPass_shouldReturn_MessageofReason ", () => {
            userServices.registerUser(registrationSamples.sample7, (error, registrationResult) => {
                error.should.have.equal("already registered");
            })
        })
    });
  
    describe("userServices getLoginCredentialAndCallForValidation()", () => {
        it("WhenCorrectCredentialsPass_shouldReturn_SussessDetatil", () => {
            userServices.getLoginCredentialAndCallForValidation(loginSamples.sample4, (error, loginResult) => {
                loginResult.message.should.have.equal("login successfull");
                loginResult.data.should.be.a('string');
                loginResult.should.have.status(responseCode.SUCCESS);
            })
        })
        it("WhenNotRegisteredEmailIdPass_shouldReturn_messageOfReason", () => {
            userServices.getLoginCredentialAndCallForValidation(loginSamples.sample3, (error, loginResult) => {
                loginResult.message.should.have.equal("email id does not exist");
            })
        })
    });

    describe("userServices getEmail()", () => {
        it("WhenEmailPass_shouldGive_tokenAsAStringandSuccessCode", () => {
            userServices.getEmail(forgotPassword.sample2,(error, result) => {
                result.message.should.have.equal("token genrated an mail successfully sent");
                result.should.be.a('object');
                result.should.have.status(responseCode.SUCCESS);
            })
        })

        it("WhenNotRegisredEmailIdPass_shouldGive_mesage", () => {
            userServices.getEmail(forgotPassword.sample5, (error, result) => {
                result.message.should.have.equal("User with this email id does not exist");
                result.should.have.status(resposnsCode.NOT_FOUND);
            })
        })
    });

    describe("userServices resetPass()", () => {
        it("WhenNewPasswordAlongWithEmailPass_shouldReturn_ResultAsAStringAndSuccessCodeAlongWithSuccessMessage", () => {
            userServices.resetPass(resetPassword.sample2, (error, result) => {
                result.should.be.a('string');
                result.should.have.equal("password updated successfully");
            })
        })

        it("WhenMailIdNotRegistedPass_ShouldReturn_Message", () => {
            userServices.resetPass(resetPassword.sample4,  (error, result) => {
                error.should.be.a('string');
                error.should.have.equal("User with this email id does not exist");
            })
        })
    });
});

/**
  * @description Testing of user model's functions
  */
describe('Test userModelFunctions', () => {
    describe("userModelFunctions register()", () => {
        it("WhenNewUserOjectPass_shouldReturn_RegisteredUser", () => {
            userModelFunctions.register(registrationSamples.sample9, (error, registrationResult) => {
               // console.log(registrationresult);
                console.log(error);
                registrationResult.should.have.property("name");
                registrationResult.should.have.property("email");
                registrationResult.should.have.property("password");
                registrationResult.name.should.have.equal(registrationSamples.sample9.name);
                registrationResult.email.should.have.equal(registrationSamples.sample9.email);
            })
        })
    });

    describe("userModelFunctions validateLoginCredentialAndReturnResult()", () => {
        it("WhenNewUserOjectPass_shouldReturn_RegisteredUser", () => {
            userModelFunctions.validateLoginCredentialAndReturnResult(loginSamples.sample2, (error, user) => {
                user[0].should.have.property("name");
                user[0].should.have.property("email");
                user[0].should.have.property("password");
                user[0].email.should.have.equal(loginSamples.sample2.email);
            })
        })
    });

    describe("userModelFunctions forgetPassword()", () => {
        it("WhenEmailIPassAndIfIdregisteredAlready_shouldReturn_RegisteredUser", () => {
            userModelFunctions.forgetPassword(forgotPassword.sample3, (error, user) => {
                user[0].should.have.property("name");
                user[0].should.have.property("email");
                user[0].should.have.property("password");
                user[0].email.should.have.equal(forgotPassword.sample3.email);
            })
        })
    });

    describe("userModelFunctions  resetPassword()", () => {
        it("WhenEmailIdAndNewPasswordPassAndIfEmailIdregisteredAlready_shouldReturn_SuccessMessage", () => {
            userModelFunctions.resetPassword(resetPassword.sample3, (error, result) => {
                result.should.be.a('string');
                result.should.have.equal("password updated successfully");
            })
        })
    });
});


/**
  * @description Testing of user controller's functions
  */
describe('Test userControllers', () => {
    describe("userControllers register()", () => {
        it("WhenNewUserOjectPass_shouldReturn_RegisteredUser", () => {
            let response = userController.register(registrationSamples.sample9, response);
            console.log(response);
        })
    });
})

/**
  * @description Testing of JwtAuth functions
  */
describe('Test JwtAuth ', () => {
    describe("JwtAuth genrateToken()", () => {
        it("WhenUserObjectPass_shouldReturn_TokenAsAsAString", () => {
            let token = jwtAuth.genrateToken(
                [{
                    "name": "Aakash Rajak",
                    "email": "aakashrajak2809@gmail.com",
                    "password": "Aakash23@",
                    "confirmPassword": "Aakash23@"
                }]
            );
            console.log(token);
            token.should.be.a('string');
        })
    });

    describe("JwtAuth sendMai()", () => {
        it("WhenUserObjectAndTokenPass_shouldReturn_RestPaswordLinkAsAsAStringAftersendingMail", () => {
            user = registrationSamples.sample7;
            token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MTI3MjYwMzUsImV4cCI6MTYxMjgxMjQzNX0.QdZDz1vVp5kLlKyWcziV_Vhcww7o6qZrlaeXeJuxTVE"
            jwtAuth.sendMail(user, token, (error, resetPasswordLink) => {
                resetPasswordLink.should.be.a('string');
            })
        })
    });
});