/**
 * @module       test
 * @description  test contain test.js which is having all testcases
 * @requires     chai-http is to HTTP integration testing
 * @requires     server  is to connect with server
 * @requires     testSamplesUserRegistration.json is to retrive sample object for testing
 * @author       Aakash Rajak <aakashrajak2809@gmail.com>
 * @since        
-----------------------------------------------------------------------------------------------*/

const chai = require('chai');
const server = require('../server');
const chaiHttp = require('chai-http');
const forgotPassword = require('./testSamples/forgotPassword.json');
const loginSamples = require('./testSamples/loginSamples.json');
const registrationSamples = require('./testSamples/registration.json');
const userContrller = require('../app/controllers/userControllers/user');
chai.should();
chai.use(chaiHttp);

describe('Test API', () => {

    /**
      * @deprecated user registration test
      */
    describe('POST /register', () => {

        it('WhenGivenProperEndPointsAndCorrectInputAndNotRegistered_shouldReturn_registeredUserDetail', (done) => {
            chai.request(server)
                .post('/register')
                .send(registrationSamples.sample5)
                .end((request, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('Object');
                    response.body.data.should.have.property("name");
                    response.body.data.should.have.property("email");
                    response.body.data.should.have.property("password");
                    response.body.data.name.should.have.equal(`Vikash Rajak`);
                    response.body.data.email.should.have.equal(`vikashrajak@gmail.com`);
                    done();
                })
        })
    })

    /**
     * @deprecated user login test
     */
    describe('POST /login', () => {
        it.skip('WhenGivenProperEndPointsAndInputCredentialsCorrect_shouldReturnSuccessMessageAndStatus', (done) => {
            chai.request(server)
                .post('/login')
                .send(loginSamples.sample1)
                .end((request, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('Object');
                    response.body.should.have.property("message");
                    response.body.message.should.have.equal("login successfull");
                    done();
                })
        })
    })

    /**
       * @description user forgotPassword test
       */
    describe('POST /forgotPassword', () => {
        it.skip('WhenGivenProperEndPointsAndInputCorrect_shouldReturn_SuccessStatusAndResetLink', (done) => {
            chai.request(server)
                .post('/forgotPassword')
                .send(forgotPassword.sample1)
                .end((request, response) => {
                    console.log(response.body)
                    response.should.have.status(200);
                    response.body.should.be.a('Object');
                    done();
                })
        })
    })

    it.skip('should return true if login successfull ', (done) => {
        let request = {
            email: "vikashrajak@gmail.com",
            password: "Abceftt2@"
        };
        chai.request(server).
        userContrller.login(request).send(userSamples.login)
            .end((request, response) => {
                response.should.have.status(200);
                response.body.should.be.a('Object');
                // response.body.should.have.property("message");
                // response.body.message.should.have.equal("login successfull");
                done();
            })

    });

    /**
    * Test the PUT route
     */
    /*  describe.skip('PUT /updateGreeting/:greetingId', () => {
         it('WhenGivenProperEndPointsAndCorrectIdAndObject_shouldReturn_ObjectAndSuccessStatus', (done) => {
             const greetingDetails = {
                 name: "Preeti",
                 message: "Hello"
             };
             chai.request(server)
                 .put('/updateGreeting/6005efb8cacac71300359cc2')
                 .send(greetingDetails)
                 .end((error, response) => {
                     response.should.have.status(200);
                     response.body.should.be.a('Object');
                     done();
                 })
         })
     })
  */
    /**
    * Test the DELETE route
   */
    /*  describe('DELETE /greeting/:greetingId', () => {
         it('WhenGivenProperEndPointsAndCorrectExistingId_shouldReturn_SuccessStatus', (done) => {
             chai.request(server)
                 .del('/greeting/6005e8f5e95d4213101c')
                 .end((error, response) => {
                     response.should.have.status(200);
                     done();
                 })
         })
     }) */

});