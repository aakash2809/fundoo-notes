/**
 * @module       test
 * @description  test contain test.js which is having all testcases
 * @requires     chai-http is to HTTP integration testing
 * @requires     server  is to connect with server
 * @requires     testSamples.json is to retrive sample object for testing
 * @author       Aakash Rajak <aakashrajak2809@gmail.com>     
-----------------------------------------------------------------------------------------------*/

const chai = require('chai');
const server = require('../../server');
const chaiHttp = require('chai-http');
const testSamples = require('./sampleTest.json');
const responseCode = require('../../util/staticFile.json');

chai.should();
chai.use(chaiHttp);
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFobWFkIEFsaSIsInVzZXJJZCI6IjYwMjhjNjQ1ODhlMTkyMWNkNDQ2YTMxYSIsImlhdCI6MTYxMzUzNDA0NCwiZXhwIjoxNjEzNjIwNDQ0fQ.Mn1gK9gi2ix-IMS7YDygcpN8GQOqafGapQ2pkePFxa8'
const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZS.khuiyghjkh'

describe('Test Label API', () => {

    /**
     * @description note test for /addLabel
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
                    response.body.message.should.have.equal("Label inserted successfully");
                })
            done();
        })

        it('WhenGivenProperEndPointsAndInvalidTokenPass_shouldReturn_ErrorMessage', (done) => {
            chai.request(server)
                .post('/addLabel')
                .set('Authorization', `Bearer ${invalidToken}`)
                .send(testSamples.validLabel)
                .end((error, response) => {
                    response.body.message.should.have.equal("Authentication failed");
                })
            done();
        })
        it('WhenGivenProperEndPointsAndEmptyDescriptionPass_shouldReturn_ErrorMessage', (done) => {
            chai.request(server)
                .post('/addLabel')
                .set('Authorization', `Bearer ${token}`)
                .send(testSamples.emptyLabel)
                .end((error, response) => {
                    response.body.status_code.should.have.equal(responseCode.BAD_REQUEST);
                    console.log(response.body);
                    response.body.should.be.a('object');
                    response.body.message.should.have.equal(" description: Path `description` is required.");
                })
            done();
        })
    })

    /**
     * @description test for /labels
     */
    describe('GET /labels', () => {
        it.only('WhenGivenProperEndPointsPassWithCorrectHeader_shouldReturn_AllLabelsAvailabeInCurrentAccountAndSuccessMessage', (done) => {
            chai.request(server)
                .get('/labels')
                .set('Authorization', `Bearer ${token}`)
                .send()
                .end((error, response) => {
                    response.should.have.status(responseCode.SUCCESS);
                    response.body.message.should.have.equal("label of current account has been retrieved");
                })
            done();
        })

    })

    /**
     * @description  test for /updateNote/:labelId /
     */
    describe('PUT /updateLabel/:labelId', () => {
        it('WhenGivenProperEndPointsPassWithCorrectHeader_shouldReturn_SuccessMessage', (done) => {
            chai.request(server)
                .put('/updateLabel/602b4fdb10763111083660d0')
                .set('Authorization', `Bearer ${token}`)
                .send(testSamples.updateLabel)
                .end((error, response) => {
                    response.should.have.status(responseCode.SUCCESS);
                    response.body.message.should.have.equal("Label has been updated");
                })
            done();
        })

        it('WhenGivenProperEndPointsAndInvalidTokenPass_shouldReturn_ErrorMessage', (done) => {

            chai.request(server)
                .put('/updateLabel/602b4fdb10763111083660d0')
                .set('Authorization', `Bearer ${invalidToken}`)
                .send(testSamples.updateLabel)
                .end((error, response) => {
                    response.body.message.should.have.equal("Authentication failed");
                })
            done();
        })

        it('WhenGivenProperEndPointsAndInvalidLabelIdPass_shouldReturn_MessageOfNotFound', (done) => {
            chai.request(server)
                .put('/updateLabel/602b4fdb10763111083660d9')
                .set('Authorization', `Bearer ${token}`)
                .end((error, response) => {
                    response.body.status_code.should.have.equal(responseCode.NOT_FOUND);
                    response.body.message.should.have.equal(`Label not found with id 602b4fdb10763111083660d9`);
                })
            done();
        })
    })

    /**
     * @description note test for /label/:labelId /
     */
    describe('DELETE /label/:labelId', () => {
        it.only('WhenGivenProperEndPointsPassWithCorrectHeader_shouldReturn_SuccessMessageAfterDeleteingNote', (done) => {
            chai.request(server)
                .delete('/label/602922b3142c72030009599a')
                .set('Authorization', `Bearer ${token}`)
                .end((error, response) => {
                    response.should.have.status(responseCode.SUCCESS);
                    response.body.message.should.have.equal("Note deleted successfully!");
                })
            done();
        })

        it('WhenGivenProperEndPointsAndInvalidTokenPass_shouldReturn_ErrorMessage', (done) => {
            chai.request(server)
                .delete('/label/602922b3142c72030009599a')
                .set('Authorization', `Bearer ${invalidToken}`)
                .end((error, response) => {
                    response.body.message.should.have.equal("Authentication failed");
                })
            done();
        })

        it('WhenGivenProperEndPointsAndInvalidLabelIdPass_shouldReturn_MessageOfNotFound', (done) => {
            chai.request(server)
                .delete('/label/602922b3142c72030009599a')
                .set('Authorization', `Bearer ${token}`)
                .end((error, response) => {
                    response.body.message.should.have.equal(`Note not found with id 6029cfb728d3021a0822f3e0`);
                })
            done();
        })
    })
});