/**
 * @module       test
 * @description  test contain test.js which is having all testcases
 * @requires     chai-http is to HTTP integration testing
 * @requires     server  is to connect with server
 * @requires     testSamples.json is to retrive sample object for testing
 * @author       Aakash Rajak <aakashrajak2809@gmail.com>
-----------------------------------------------------------------------------------------------*/

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const testSamples = require('./testSamples.json');
const responseCode = require('../../util/staticFile.json');

chai.should();
chai.use(chaiHttp);
let token = '';
const invalidToken = testSamples.inValidToken.token;

describe('Test Label API', () => {
    before((done) => {
        chai.request(server)
            .post('/login')
            .send(testSamples.validUser)
            .end((err, response) => {
                token = response.body.token;
                done();
            });
    });

    /**
     * @description test for /addLabel
     */
    describe('POST /addlabel', () => {
        it('WhenGivenProperEndPointsAndCorrectInput_shouldReturn_SuccessMessageForLabelInsertion', (done) => {
            chai.request(server)
                .post('/addLabel')
                .set('Authorization', `Bearer ${token}`)
                .send(testSamples.validLabel)
                .end((error, response) => {
                    response.should.have.status(responseCode.SUCCESS);
                    response.body.should.be.a('object');
                    response.body.message.should.have.equal('Label inserted successfully');
                });
            done();
        });

        it('WhenGivenProperEndPointsAndInvalidTokenPass_shouldReturn_ErrorMessage', (done) => {
            chai.request(server)
                .post('/addLabel')
                .set('Authorization', `Bearer ${invalidToken}`)
                .send(testSamples.validLabel)
                .end((error, response) => {
                    response.body.message.should.have.equal('Authentication failed');
                });
            done();
        });

        it('WhenGivenProperEndPointsAndEmptyDescriptionPass_shouldReturn_ErrorMessage', (done) => {
            chai.request(server)
                .post('/addLabel')
                .set('Authorization', `Bearer ${token}`)
                .send(testSamples.emptyLabel)
                .end((error, response) => {
                    response.body.status_code.should.have.equal(responseCode.BAD_REQUEST);
                    response.body.should.be.a('object');
                    response.body.message.should.have.equal('"label" is not allowed to be empty');
                });
            done();
        });
    });

    /**
     * @description test for /labels
     */
    describe('GET /labels', () => {
        it('WhenGivenProperEndPointsPassWithCorrectHeader_shouldReturn_AllLabelsAvailabeInCurrentAccountAndSuccessMessage', (done) => {
            chai.request(server)
                .get('/labels')
                .set('Authorization', `Bearer ${token}`)
                .send()
                .end((error, response) => {
                    response.should.have.status(responseCode.SUCCESS);
                    response.body.message.should.have.equal('label of current account has been retrieved');
                });
            done();
        });

        it('WhenGivenProperEndPointsAndInvalidTokenPass_shouldReturn_ErrorMessage', (done) => {
            chai.request(server)
                .get('/labels')
                .set('Authorization', `Bearer ${invalidToken}`)
                .end((error, response) => {
                    response.body.message.should.have.equal('Authentication failed');
                });
            done();
        });
    });

    /**
     * @description  test for /updateLabel/:labelId /
     */
    describe('PUT /updateLabel/:labelId', () => {
        it('WhenGivenProperEndPointsPassWithCorrectHeader_shouldReturn_SuccessMessage', (done) => {
            chai.request(server)
                .put('/updateLabel/602cb4fd7ef5ca02bc635363')
                .set('Authorization', `Bearer ${token}`)
                .send(testSamples.updateLabel)
                .end((error, response) => {
                    response.should.have.status(responseCode.SUCCESS);
                    response.body.message.should.have.equal('Label updated successfully!');
                });
            done();
        });

        it('WhenGivenProperEndPointsAndInvalidTokenPass_shouldReturn_ErrorMessage', (done) => {
            chai.request(server)
                .put('/updateLabel/602b4fdb10763111083660d0')
                .set('Authorization', `Bearer ${invalidToken}`)
                .send(testSamples.updateLabel)
                .end((error, response) => {
                    response.body.message.should.have.equal('Authentication failed');
                });
            done();
        });

        it('WhenGivenProperEndPointsAndInvalidLabelIdPass_shouldReturn_MessageOfLabelFound', (done) => {
            chai.request(server)
                .put('/updateLabel/602b4fdb10763111083660d8')
                .set('Authorization', `Bearer ${token}`)
                .end((error, response) => {
                    response.body.status_code.should.have.equal(responseCode.NOT_FOUND);
                    response.body.message.should.have.equal('Label not found with 602b4fdb10763111083660d8');
                });
            done();
        });
    });

    /**
     * @description  test for /label/:labelId /
     */
    describe('DELETE /label/:labelId', () => {
        it('WhenGivenProperEndPointsPassWithCorrectHeader_shouldReturn_SuccessMessageAfterDeleteingLabel', (done) => {
            chai.request(server)
                .delete('/label/602b4fdb10763111083660d0')
                .set('Authorization', `Bearer ${token}`)
                .end((error, response) => {
                    response.should.have.status(responseCode.SUCCESS);
                    response.body.message.should.have.equal('Label deleted successfully!');
                });
            done();
        });

        it('WhenGivenProperEndPointsAndInvalidTokenPass_shouldReturn_ErrorMessage', (done) => {
            chai.request(server)
                .delete('/label/602b431d60cc850dcc88302c')
                .set('Authorization', `Bearer ${invalidToken}`)
                .end((error, response) => {
                    response.body.message.should.have.equal('Authentication failed');
                });
            done();
        });

        it('WhenGivenProperEndPointsAndInvalidLabelIdPass_shouldReturn_MessageOfLabelFound', (done) => {
            chai.request(server)
                .delete('/label/602b431d60cc850dcc88302c')
                .set('Authorization', `Bearer ${token}`)
                .end((error, response) => {
                    response.body.status_code.should.have.equal(responseCode.NOT_FOUND);
                    response.body.message.should.have.equal('Label not found with 602b431d60cc850dcc88302c');
                });
            done();
        });
    });
});
