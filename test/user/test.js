/**
 * @module       test
 * @description  test contain test.js which is having all testcases
 * @requires     chai-http is to HTTP integration testing
 * @requires     server  is to connect with server
 * @requires     testSamplesUserRegistration.json is to retrive sample object for testing
 * @author       Aakash Rajak <aakashrajak2809@gmail.com>     
-----------------------------------------------------------------------------------------------*/

const chai = require('chai');
const server = require('../../server');
const chaiHttp = require('chai-http');
const forgotPassword = require('./testSamples/forgotPassword.json');
const loginSamples = require('./testSamples/loginSamples.json');
const registrationSamples = require('./testSamples/registration.json');
const responseCode = require('../../util/staticFile.json');
const resetPassword = require('./testSamples/resetPassword.json');

chai.should();
chai.use(chaiHttp);
var token = " ";

describe('Test User API', () => {

    /**
      * @deprecated user registration test
      */
    describe('POST /register', () => {
        it('WhenGivenProperEndPointsAndCorrectInputAndNotRegistered_shouldReturn_registeredUserDetail', () => {
            chai.request(server)
                .post('/register')
                .send(registrationSamples.validUserObject2)
                .end((request, response) => {
                    console.log(response.body)
                    response.should.have.status(responseCode.SUCCESS);
                    response.body.should.be.a('Object');
                    response.body.data.should.have.property('name');
                    response.body.data.should.have.property("email");
                    response.body.data.should.have.property("password");
                    response.body.data.name.should.have.equal(registrationSamples.validUserObject2.name);
                    response.body.data.email.should.have.equal(registrationSamples.validUserObject2.email);
                })
        })
        it("WhenRegisteredOjectPass_shouldReturn_MessageofReason ", () => {
            chai.request(server)
                .post('/register')
                .send(registrationSamples.validUserObject)
                .end((request, response) => {
                    response.body.message.should.have.equal("already registered");
                })
        })
        it("WhenEmptyNamePass_shouldReturn_ErrorMessageAndStatusCodeForError", (done) => {
            chai.request(server)
                .post('/register')
                .send(registrationSamples.emptyName)
                .end((request, response) => {
                    response.body.status_code.should.have.equal(responseCode.BAD_REQUEST);
                    response.body.message.should.have.equal('"name" is not allowed to be empty');
                })
            done();
        })

        it("WhenEmptyNamePass_shouldReturn_ErrorMessageAndStatusCodeForError", (done) => {
            chai.request(server)
                .post('/register')
                .send(registrationSamples.emptyEmail)
                .end((request, response) => {
                    response.body.status_code.should.have.equal(responseCode.BAD_REQUEST);
                    response.body.message.should.have.equal('"email" is not allowed to be empty');
                })
            done();
        })
        it("WhenNameHavingLessthanThreeCharPass_shouldReturn_ErrorMessageAndStatusCodeForError", (done) => {
            chai.request(server)
                .post('/register')
                .send(registrationSamples.nameLengthLessThanThree)
                .end((request, response) => {
                    response.body.status_code.should.have.equal(responseCode.BAD_REQUEST);
                    response.body.message.should.have.equal('"name" with value "Aa" fails to match the required pattern: /^[A-Z]{1}[a-zA-Z ]{2,}$/');
                })
            done();
        })

        it("WhenPaswordAndConfirmPasswordNotSame_shouldReturn_ErrorMessageAndStatusCodeForError", (done) => {
            chai.request(server)
                .post('/register')
                .send(registrationSamples.passwordAndConfirmPasswordNotSame)
                .end((request, response) => {
                    response.body.status_code.should.have.equal(responseCode.BAD_REQUEST);
                    response.body.message.should.have.equal('password does not match with confirm password');
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
                .send(loginSamples.validUser2)
                .end((request, response) => {
                    response.should.have.status(responseCode.SUCCESS);
                    response.body.should.be.a('Object');
                    response.body.should.have.property("message");
                    response.body.message.should.have.equal("login successfull");
                })
            done();
        });


        it('WhenGivenProperEndPointsAndNotRegisteredEmailIdPass_shouldReturn_SuccessMessageAndStatus', (done) => {
            chai.request(server)
                .post('/login')
                .send(loginSamples.InvlidEmail)
                .end((request, response) => {
                    response.body.statusCode.should.have.equal(responseCode.NOT_FOUND);
                    response.body.message.should.have.equal('email id does not exist');
                })
            done();
        });

        it('WhenGivenProperEndPointsAndInvalidPasswordPass_shouldReturn_SuccessMessageAndStatus', (done) => {
            chai.request(server)
                .post('/login')
                .send(loginSamples.InvalidPassword)
                .end((request, response) => {
                    response.body.statusCode.should.have.equal(responseCode.BAD_REQUEST);
                    response.body.message.should.have.equal('Invalid password');
                })
            done();
        });
    });

    /**
       * @description user forgotPassword test
       */
    describe('POST /forgotPassword', () => {
        it('WhenGivenProperEndPointsAndInputCorrect_shouldReturn_SuccessStatusAndResetLink', (done) => {
            chai.request(server)
                .post('/forgotPassword')
                .send(forgotPassword.validEmail)
                .end((request, response) => {
                    token = `"${response.body.data}"`;
                    response.should.have.status(responseCode.SUCCESS);
                    response.body.should.be.a('Object');
                })
            done();
        })

        it('WhenGivenProperEndPointsAndInputCorrect_shouldReturn_SuccessStatusAndResetLink', (done) => {
            chai.request(server)
                .post('/forgotPassword')
                .send(forgotPassword.invalidEmail)
                .end((request, response) => {

                    response.body.statusCode.should.have.equal(responseCode.NOT_FOUND);
                    response.body.message.should.have.equal('User with this email id does not exist')
                })
            done();
        })
    })
    /**
     * @description user resetPassword test
     */
    describe('PUT /resetPassword', () => {
        it('WhenGivenProperEndPointsAndCorrectInput_shouldReturn_SuccessMessage', (done) => {
            token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFha2FzaCBSYWphayIsInVzZXJJZCI6IjYwMjNiNGRjNDQ5ZTEyMGZjYzYzZjg3YiIsImlhdCI6MTYxMjk1NDc1NSwiZXhwIjoxNjEzMDQxMTU1fQ.WZ6iKFfu7rSbTgtXERYPK9qTLKctFgAr2OGVgcKaps4'

            chai.request(server)
                .put('/resetPassword')
                .set('Authorization', `Bearer ${token}`)
                .send(resetPassword.validIdAndPasswordPattern)
                .end((error, response) => {
                    response.should.have.status(responseCode.SUCCESS);
                    response.body.should.be.a('object');
                    response.body.message.should.have.equal("password updated successfully");
                })
            done();
        })

        it('WhenGivenProperEndPointsAndInvalidEmailPass_shouldReturn_ErrorMessage', (done) => {
            token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFha2FzaCBSYWphayIsInVzZXJJZCI6IjYwMjNiNGRjNDQ5ZTEyMGZjYzYzZjg3YiIsImlhdCI6MTYxMjk4MzIxOSwiZXhwIjoxNjEzMDY5NjE5fQ.OSQT-cO_7v6mMB2Fhn34Y69pV5trDGFCyPtE3Cp5jhY'

            chai.request(server)
                .put('/resetPassword')
                .set('Authorization', `Bearer ${token}`)
                .send(resetPassword.invalidEmail)
                .end((error, response) => {
                    response.body.message.should.have.equal("User with this email id does not exist");
                })
            done();
        })
    })
});

