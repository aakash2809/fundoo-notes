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
const testSamples = require('./testSamples.json');
const responseCode = require('../../util/staticFile.json');

chai.should();
chai.use(chaiHttp);
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFobWFkIEFsaSIsInVzZXJJZCI6IjYwMjhjNjQ1ODhlMTkyMWNkNDQ2YTMxYSIsImlhdCI6MTYxMzMxNjY1MCwiZXhwIjoxNjEzNDAzMDUwfQ._l3-xB4HSFNOpKKDuzOtGZchgP1DxqJKBZyTEBNbi94'

describe('Test Note API', () => {

    /**
     * @description note test for /addNote
     */
    describe('POST /addNote', () => {
        it('WhenGivenProperEndPointsAndCorrectInput_shouldReturn_SuccessMessageForNoteInsertion', (done) => {
            chai.request(server)
                .post('/addNote')
                .set('Authorization', `Bearer ${token}`)
                .send(testSamples.validNote)
                .end((error, response) => {
                    response.should.have.status(responseCode.SUCCESS);
                    response.body.should.be.a('object');
                    response.body.message.should.have.equal("Note inserted successfully");
                })
            done();
        })

        it('WhenGivenProperEndPointsAndInvalidTokenPass_shouldReturn_ErrorMessage', (done) => {
           let invalidtoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZS.khuiyghjkh'
            chai.request(server)
                .post('/addNote')
                .set('Authorization', `Bearer ${invalidtoken}`)
                .send(testSamples.validNote)
                .end((error, response) => {
                    response.body.message.should.have.equal("Authentication failed");
                })
            done();
        })
        it('WhenGivenProperEndPointsAndEmptyDescriptionPass_shouldReturn_ErrorMessage', (done) => {
            chai.request(server)
                .post('/addNote')
                .set('Authorization', `Bearer ${token}`)
                .send(testSamples.emptyDescription)
                .end((error, response) => {
                    response.body.status_code.should.have.equal(responseCode.BAD_REQUEST);
                    response.body.should.be.a('object');
                    response.body.message.should.have.equal("Note validation failed: description: Path `description` is required.");
                })
            done();
        })

        it('WhenGivenProperEndPointsAndEmptyTitlePass_shouldReturn_ErrorMessage', (done) => {
            chai.request(server)
                .post('/addNote')
                .set('Authorization', `Bearer ${token}`)
                .send(testSamples.emptyTitle)
                .end((error, response) => {
                    response.body.status_code.should.have.equal(responseCode.BAD_REQUEST);
                    response.body.should.be.a('object');
                    response.body.message.should.have.equal("Note validation failed: title: Path `title` is required.");
                })
            done();
        })
    })

    /**
     * @description note test for /allNotes
     */
    describe('GET /allNotes', () => {
        it('WhenGivenProperEndPointsPassWithCorrectHeader_shouldReturn_AllNotesAvailabeInCurrentAccountAndSuccessMessage', (done) => {
           
            chai.request(server)
                .get('/allNotes')
                .set('Authorization', `Bearer ${token}`)
                .send()
                .end((error, response) => {
                    response.should.have.status(responseCode.SUCCESS);
                    response.body.message.should.have.equal("Notes of current account has been retrieved");
                })
            done();
        })

        it('WhenGivenProperEndPointsAndInvalidTokenPass_shouldReturn_ErrorMessage', (done) => {
            let invalidtoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZS.khuiyghjkh'
            chai.request(server)
                .post('/allNote')
                .set('Authorization', `Bearer ${invalidtoken}`)
                .send()
                .end((error, response) => {
                    response.body.message.should.have.equal("Authentication failed");
                })
            done();
        })
    })

    /**
     * @description note test for /updateNote/:noteId /
     */
    describe('PUT /updateNote/:noteId', () => {
        it('WhenGivenProperEndPointsPassWithCorrectHeader_shouldReturn_SuccessMessage', (done) => {
            chai.request(server)
                .put('/updateNote/6029cfb728d3021a0822f3e0')
                .set('Authorization', `Bearer ${token}`)
                .send(testSamples.validNoteToUpdate)
                .end((error, response) => {
                    response.should.have.status(responseCode.SUCCESS);
                    response.body.message.should.have.equal("Note has been updated");
                })
            done();
        })

        it('WhenGivenProperEndPointsAndInvalidTokenPass_shouldReturn_ErrorMessage', (done) => {
            var invalidtoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZS.khuiyghjkh'
            chai.request(server)
                .post('/updateNote/6029cfb728d3021a0822f3e0')
                .set('Authorization', `Bearer ${invalidtoken}`)
                .send(testSamples.validNoteToUpdate)
                .end((error, response) => {
                    response.body.message.should.have.equal("Authentication failed");
                })
            done();
        })

        it('WhenGivenProperEndPointsAndInvalidNodeIdPass_shouldReturn_MessageOfNotFound', (done) => {
            chai.request(server)
           .put('/updateNote/6029cfb728d3021a0822')
           .set('Authorization', `Bearer ${token}`)
           .end((error, response) => {
               response.body.status_code.should.have.equal(responseCode.NOT_FOUND);
               response.body.message.should.have.equal(`Note not found with id 6029cfb728d3021a0822`);
           })
       done();
   })
        
})

    /**
     * @description note test for /updateNote/:noteId /
     */
    describe('DELETE /note/:noteId', () => {
        it('WhenGivenProperEndPointsPassWithCorrectHeader_shouldReturn_SuccessMessageAfterDeleteingNote', (done) => {
            chai.request(server)
                .delete('/note/6029f0598aa1110f4866ffff')
                .set('Authorization', `Bearer ${token}`)
                .end((error, response) => {
                    response.should.have.status(responseCode.SUCCESS);
                    response.body.message.should.have.equal("Note deleted successfully!");
                })
            done();
        })

        it('WhenGivenProperEndPointsAndInvalidTokenPass_shouldReturn_ErrorMessage', (done) => {
            let invalidtoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZS.khuiyghjkh'
            chai.request(server)
                .delete('/note/6029cfb728d3021a0822f3e0')
                .set('Authorization', `Bearer ${invalidtoken}`)
                .send()
                .end((error, response) => {
                    response.body.message.should.have.equal("Authentication failed");
                })
            done();
        })

        it('WhenGivenProperEndPointsAndInvalidNoteIdPass_shouldReturn_MessageOfNotFound', (done) => {
                 chai.request(server)
                .delete('/note/6029cfb728d3021a0822f3e0')
                .set('Authorization', `Bearer ${token}`)
                .end((error, response) => {
                    response.body.message.should.have.equal(`Note not found with id 6029cfb728d3021a0822f3e0`);
                })
            done();
        })
    })
});