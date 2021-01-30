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
const sampleGreeting = require('./testGreetings.json');
chai.should();
chai.use(chaiHttp);

describe('Test API', () => {

    /**
    * Test the GET route
    */
  /*   describe('GET /allGreetings', () => {
        it('WhenGivenProperEndPoints_shouldReturn_allGreetingObjecs', (done) => {
            chai.request(server)
                .get('/allGreetings')
                .end((error, response) => {
                    console.log(response.body);
                    response.should.have.status(200);
                    response.body.should.be.a('Object');
                    done();
                })
        })
        it('WhenGivenImProperEndPoints_shouldReturn_404Status', (done) => {
            chai.request(server)
                .get('/all')
                .end((error, response) => {
                    response.should.have.status(404);
                    done();
                })
        })
    }) */

    /**
    * Test the  GET by Id
   */
    /* describe.skip('GET /uniqueGreeting/:greetingId', () => {
        it('WhenGivenProperEndPointsAndCorrectExistingId_shouldReturn_SuccessStatusAndValue', (done) => {
            chai.request(server)
                .get('/uniqueGreeting/60089fcba8741c14d88d4c2f')
                .end((error, response) => {
                    console.log(response.body);
                    response.should.have.status(200);
                    response.body.should.be.a('Object');
                    response.body.should.have.property('name').eq('Aissu');
                    response.body.should.have.property('message').eq('Hreerrrp');
                    done();
                })
        })
    }) */

    /**
       * Test the POST route
      */
    /* describe.skip('POST /addGreeting', () => {
        it('WhenGivenProperEndPointsAndCorrectInput_shouldReturn_ObjectAndSuccessStatus', (done) => {
            chai.request(server)
                .post('/addGreeting')
                .send(sampleGreeting.greetings[0])
                .end((response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('Object');
                    done();
                })
        })
    })
 */
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