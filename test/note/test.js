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
const logger = require('../../config/logger');

chai.should();
chai.use(chaiHttp);
let token = '';
const invalidToken = testSamples.inValidToken.token;

describe('Test Note API', () => {
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
     * @description note test for /addNote
     */
    describe('POST /addNote', () => {
        it('WhenGivenProperEndPointsAndCorrectInput_shouldReturn_SuccessMessageForNoteInsertion', (done) => {
            logger.info(`Bearer ${token}`);
            chai.request(server)
                .post('/addNote')
                .set('Authorization', `Bearer ${token}`)
                .send(testSamples.validNote)
                .end((error, response) => {
                    logger.info('token inside it', token);
                    response.should.have.status(responseCode.SUCCESS);
                    response.body.should.be.a('object');
                    response.body.message.should.have.equal('Note inserted successfully');
                });
            done();
        });

        it('WhenGivenProperEndPointsAndInvalidTokenPass_shouldReturn_ErrorMessage', (done) => {
            chai.request(server)
                .post('/addNote')
                .set('Authorization', `Bearer ${invalidToken}`)
                .send(testSamples.validNote)
                .end((error, response) => {
                    response.body.message.should.have.equal('Authentication failed');
                });
            done();
        });

        it('WhenGivenProperEndPointsAndEmptyDescriptionPass_shouldReturn_ErrorMessage', (done) => {
            chai.request(server)
                .post('/addNote')
                .set('Authorization', `Bearer ${token}`)
                .send(testSamples.emptyDescription)
                .end((error, response) => {
                    response.body.status_code.should.have.equal(responseCode.BAD_REQUEST);
                    response.body.should.be.a('object');
                    response.body.message.should.have.equal('Note validation failed: description: Path `description` is required.');
                });
            done();
        });

        it('WhenGivenProperEndPointsAndEmptyTitlePass_shouldReturn_ErrorMessage', (done) => {
            chai.request(server)
                .post('/addNote')
                .set('Authorization', `Bearer ${token}`)
                .send(testSamples.emptyTitle)
                .end((error, response) => {
                    response.body.status_code.should.have.equal(responseCode.BAD_REQUEST);
                    response.body.should.be.a('object');
                    response.body.message.should.have.equal('Note validation failed: title: Path `title` is required.');
                });
            done();
        });
    });

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
                    response.body.message.should.have.equal('Notes of current account has been retrieved');
                });
            done();
        });
    });

    /**
    * @description note test for /addLabelToNote
    */
    describe('POST /addLabelToNote', () => {
        it('WhenGivenProperEndPointsPassWithCorrectHeader_shouldReturn_SuccessMessageAddLabelToNote', (done) => {
            chai.request(server)
                .put('/addLabelToNote')
                .set('Authorization', `Bearer ${token}`)
                .send(testSamples.validSampleForAddOrDeleteLabel)
                .end((error, response) => {
                    response.should.have.status(responseCode.SUCCESS);
                    response.body.message.should.have.equal('Label successfully added to Note');
                });
            done();
        });

        it('WhenGivenWrongNoteIdWithCorrectEndPointsPassAndCorrectHeader_shouldReturn_MessageOfFail', (done) => {
            chai.request(server)
                .put('/addLabelToNote')
                .set('Authorization', `Bearer ${token}`)
                .send(testSamples.sampleWithWrongNoteId)
                .end((error, response) => {
                    response.body.message.should.have.equal('No note availabe associated with : 602a27879ecf9a1f5cf89');
                });
            done();
        });

        it('WhenGivenProperEndPointsAndInvalidTokenPass_shouldReturn_ErrorMessage', (done) => {
            chai.request(server)
                .put('/addLabelToNote')
                .set('Authorization', `Bearer ${invalidToken}`)
                .send(testSamples.validSampleForAddOrDeleteLabel)
                .end((error, response) => {
                    response.body.message.should.have.equal('Authentication failed');
                });
            done();
        });
    });

    /**
      * @description note test for /deleteLabelFromNote
      */
    describe('PUT /deleteLabelFromNote', () => {
        it('WhenGivenProperEndPointsPassWithCorrectHeader_shouldReturn_SuccessMessageAddLabelToNote', (done) => {
            chai.request(server)
                .put('/deleteLabelFromNote')
                .set('Authorization', `Bearer ${token}`)
                .send(testSamples.validSampleForAddOrDeleteLabel)
                .end((error, response) => {
                    response.should.have.status(responseCode.SUCCESS);
                    response.body.message.should.have.equal('Label successfully removed from Note associated with given Id');
                });
            done();
        });

        it('WhenGivenWrongNoteIdWithCorrectEndPointsPassAndCorrectHeader_shouldReturn_MessageOfFail', (done) => {
            chai.request(server)
                .put('/deleteLabelFromNote')
                .set('Authorization', `Bearer ${token}`)
                .send(testSamples.sampleWithWrongNoteId)
                .end((error, response) => {
                    response.body.message.should.have.equal(`No note availabe associated with : ${testSamples.sampleWithWrongNoteId.noteId}`);
                });
            done();
        });

        it('WhenGivenProperEndPointsAndInvalidTokenPass_shouldReturn_ErrorMessage', (done) => {
            chai.request(server)
                .put('/deleteLabelFromNote')
                .set('Authorization', `Bearer ${invalidToken}`)
                .send(testSamples.validSampleForAddOrDeleteLabel)
                .end((error, response) => {
                    response.body.message.should.have.equal('Authentication failed');
                });
            done();
        });
    });

    /**
     * @description note test for /addUserToNote
     */
    describe('PUT /addUserToNote', () => {
        it('WhenGivenProperEndPointsPassWithCorrectHeader_shouldReturn_SuccessMessageAddUserToNote', (done) => {
            chai.request(server)
                .put('/addUserToNote')
                .set('Authorization', `Bearer ${token}`)
                .send(testSamples.validSampleForCollaborator)
                .end((error, response) => {
                    response.should.have.status(responseCode.SUCCESS);
                    response.body.message.should.have.equal('User successfully added to Note');
                });
            done();
        });

        it('WhenGivenWrongNoteIdWithCorrectEndPointsPassAndCorrectHeader_shouldReturn_MessageOfFail', (done) => {
            chai.request(server)
                .put('/addUserToNote')
                .set('Authorization', `Bearer ${token}`)
                .send(testSamples.collaboratorSampleWithWrongNoteId)
                .end((error, response) => {
                    response.body.message.should.have.equal('No note availabe associated with : 602a27879ecf9a1f5cf89a');
                });
            done();
        });

        it('WhenGivenProperEndPointsAndInvalidTokenPass_shouldReturn_ErrorMessage', (done) => {
            chai.request(server)
                .put('/addUserToNote')
                .set('Authorization', `Bearer ${invalidToken}`)
                .send(testSamples.validSampleForAddOrDeleteLabel)
                .end((error, response) => {
                    response.body.message.should.have.equal('Authentication failed');
                });
            done();
        });
    });

    /**
     * @description note test for /deleteUserFromNote
     */
    describe('PUT /deleteUserFromNote', () => {
        it('WhenGivenProperEndPointsPassWithCorrectHeader_shouldReturn_SuccessMessageAndDeleteuserFromNote', (done) => {
            chai.request(server)
                .put('/deleteUserFromNote')
                .set('Authorization', `Bearer ${token}`)
                .send(testSamples.validSampleForCollaborator)
                .end((error, response) => {
                    response.should.have.status(responseCode.SUCCESS);
                    response.body.message.should.have.equal('User successfully removed from Note associated with given Id');
                });
            done();
        });

        it('WhenGivenWrongNoteIdWithCorrectEndPointsPassAndCorrectHeader_shouldReturn_MessageOfFail', (done) => {
            chai.request(server)
                .put('/deleteUserFromNote')
                .set('Authorization', `Bearer ${token}`)
                .send(testSamples.collaboratorSampleWithWrongNoteId)
                .end((error, response) => {
                    response.body.message.should.have.equal('No note availabe associated with : 602a27879ecf9a1f5cf89a');
                });
            done();
        });

        it('WhenGivenProperEndPointsAndInvalidTokenPass_shouldReturn_ErrorMessage', (done) => {
            chai.request(server)
                .put('/deleteUserFromNote')
                .set('Authorization', `Bearer ${invalidToken}`)
                .send(testSamples.validSampleForAddOrDeleteLabel)
                .end((error, response) => {
                    response.body.message.should.have.equal('Authentication failed');
                });
            done();
        });
    });

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
                    response.body.message.should.have.equal('Note has been updated');
                });
            done();
        });

        it('WhenGivenProperEndPointsAndInvalidTokenPass_shouldReturn_ErrorMessage', (done) => {
            chai.request(server)
                .put('/updateNote/6029cfb728d3021a0822f3e0')
                .set('Authorization', `Bearer ${invalidToken}`)
                .send(testSamples.validNoteToUpdate)
                .end((error, response) => {
                    response.body.message.should.have.equal('Authentication failed');
                });
            done();
        });

        it('WhenGivenProperEndPointsAndInvalidNoteIdPass_shouldReturn_MessageOfNotFound', (done) => {
            chai.request(server)
                .put('/updateNote/6029cfb728d3021a0822')
                .set('Authorization', `Bearer ${token}`)
                .end((error, response) => {
                    response.body.status_code.should.have.equal(responseCode.NOT_FOUND);
                    response.body.message.should.have.equal('Note not found with id 6029cfb728d3021a0822');
                });
            done();
        });
    });

    /**
     * @description note test for /updateNote/:noteId /
     */
    describe.skip('DELETE /note/:noteId', () => {
        it('WhenGivenProperEndPointsPassWithCorrectHeader_shouldReturn_SuccessMessageAfterDeleteingNote', (done) => {
            chai.request(server)
                .delete('/note/602922b3142c72030009599a')
                .set('Authorization', `Bearer ${token}`)
                .end((error, response) => {
                    response.should.have.status(responseCode.SUCCESS);
                    response.body.message.should.have.equal('Note deleted successfully!');
                });
            done();
        });

        it('WhenGivenProperEndPointsAndInvalidTokenPass_shouldReturn_ErrorMessage', (done) => {
            chai.request(server)
                .delete('/note/6029cfb728d3021a0822f3e0')
                .set('Authorization', `Bearer ${invalidToken}`)
                .end((error, response) => {
                    response.body.message.should.have.equal('Authentication failed');
                });
            done();
        });
    });

    /**
    * @description note test for /noteColor
    */
    describe('/noteColor', () => {
        it('WhenGivenProperEndPointsPassWithCorrectHeader_shouldReturn_SuccessMessageAfterSettingColor', (done) => {
            chai.request(server)
                .post('/noteColor')
                .set('Authorization', `Bearer ${token}`)
                .send(testSamples.validColor)
                .end((error, response) => {
                    response.body.status_code.should.have.equal(responseCode.SUCCESS);
                    response.body.message.should.have.equal('color successfully added to Note');
                });
            done();
        });

        it('WhenInvalidColorCodePass_shouldReturn_ErrorMessageForColorCode', (done) => {
            chai.request(server)
                .post('/noteColor')
                .set('Authorization', `Bearer ${token}`)
                .send(testSamples.InValidColor)
                .end((error, response) => {
                    response.body.status_code.should.have.equal(responseCode.BAD_REQUEST);
                });
            done();
        });

        it('WhenInvalidNoteIdPass_shouldReturn_ErrorNotFoundForInvalidNoteId', (done) => {
            chai.request(server)
                .post('/noteColor')
                .set('Authorization', `Bearer ${token}`)
                .send(testSamples.validColorWithInvalidNoteId)
                .end((error, response) => {
                    response.body.status_code.should.have.equal(responseCode.NOT_FOUND);
                });
            done();
        });
    });

    /**
    * @description note test for /uploadImage
    */
    describe('/uploadImage', () => {
        it.skip('WhenGivenProperEndPointsPassWithCorrectHeader_shouldReturn_SuccessStatus', (done) => {
            chai.request(server)
                .post('/uploadImage')
                .set('Authorization', `Bearer ${token}`)
                .field('noteId', '60292400142c72030009599c')
                .attach('image', './images/story.jpg')
                .end((error, response) => {
                    logger.info('response', response.body);
                    // response.body.status_code.should.have.equal(responseCode.SUCCESS);
                });
            done();
        });

        it('WhenfileAttachmenNoGiven_shouldReturn_Error', (done) => {
            chai.request(server)
                .post('/uploadImage')
                .set('Authorization', `Bearer ${token}`)
                .field('noteId', '60292400142c72030009599c')
                .end((error, response) => {
                    response.body.status_code.should.have.equal(responseCode.BAD_REQUEST);
                });
            done();
        });

        it.skip('WhenNoteId_shouldReturn_ErrorNotFoundForInvalidNoteId', (done) => {
            chai.request(server)
                .post('/uploadImage')
                .set('Authorization', `Bearer ${token}`)
                .field('noteId', '60292400142c72030009599c')
                .attach('image', './images/story.jpg')
                .end((error, response) => {
                    response.body.status_code.should.have.equal(responseCode.NOT_FOUND);
                });
            done();
        });
    });

    /**
       * @description note test for /searchNote
       */
    describe('/searchNote', () => {
        it('WhenGivenProperEndPointsPassWithCorrectHeader_shouldReturn_SuccessStatus', (done) => {
            chai.request(server)
                .post('/searchNote')
                .set('Authorization', `Bearer ${token}`)
                .send(testSamples.properTitleForSearch)
                .end((error, response) => {
                    response.body.success.should.have.equal(true);
                    response.body.message.should.have.equal('note found with given title');
                });
            done();
        });

        it('WhenProperEndPointsWithCorrectHeaderAndInverseCaseThanActualPass_shouldReturn_SuccessStatus', (done) => {
            chai.request(server)
                .post('/searchNote')
                .set('Authorization', `Bearer ${token}`)
                .send(testSamples.properTitleInLowerCaseForSearch)
                .end((error, response) => {
                    response.body.success.should.have.equal(true);
                    response.body.message.should.have.equal('note found with given title');
                });
            done();
        });

        it('WhenStartingLetterOfPresentNoteTitlePass_shouldReturn_SuccessStatus', (done) => {
            chai.request(server)
                .post('/searchNote')
                .set('Authorization', `Bearer ${token}`)
                .send(testSamples.titleStartWithLetterForSearch)
                .end((error, response) => {
                    response.body.success.should.have.equal(true);
                    response.body.message.should.have.equal('note found with given title');
                });
            done();
        });

        it('WhenTitleOfNotPresentPass_shouldReturn_failedStatus', (done) => {
            chai.request(server)
                .post('/searchNote')
                .set('Authorization', `Bearer ${token}`)
                .send(testSamples.titleNotPresentInDb)
                .end((error, response) => {
                    response.body.success.should.have.equal(false);
                    response.body.message.should.have.equal('you do not have any note having with this title');
                });
            done();
        });
    });

    /**
       * @description note test for /NotesPagination
       */
    describe('/NotesPagination', () => {
        it('WhenQuerywithLimitTwoAlongWithPageValuePass_shouldReturn_SuccessStatus', (done) => {
            chai.request(server)
                .get('/NotesPagination')
                .set('Authorization', `Bearer ${token}`)
                .query(testSamples.queryWithLimitTwo)
                .end((error, response) => {
                    response.body.success.should.have.equal(true);
                    response.body.message.should.have.equal('Notes retrived successfully');
                });
            done();
        });

        it('WhenQueryWithLimitThreeAlongWithPageValuePass_shouldReturn_SuccessStatus', (done) => {
            chai.request(server)
                .get('/NotesPagination')
                .set('Authorization', `Bearer ${token}`)
                .query(testSamples.queryWithLimitThree)
                .end((error, response) => {
                    response.body.success.should.have.equal(true);
                    response.body.message.should.have.equal('Notes retrived successfully');
                });
            done();
        });

        it('WhenQueryWithPageValueTwoAlongWithLimitPass_shouldReturn_SuccessStatus', (done) => {
            chai.request(server)
                .get('/NotesPagination')
                .set('Authorization', `Bearer ${token}`)
                .query(testSamples.queryWithPageValueTwo)
                .end((error, response) => {
                    response.body.success.should.have.equal(true);
                    response.body.message.should.have.equal('Notes retrived successfully');
                });
            done();
        });

        it('WhenQueryPassWithoutPageValue_shouldReturn_failedStatus', (done) => {
            chai.request(server)
                .get('/NotesPagination')
                .set('Authorization', `Bearer ${token}`)
                .query(testSamples.queryWithoutPageValue)
                .end((error, response) => {
                    response.body.success.should.have.equal(false);
                    response.body.message.should.have.equal('"page" is required');
                });
            done();
        });

        it('WhenQueryPassWithoutLimit_shouldReturn_failedStatus', (done) => {
            chai.request(server)
                .get('/NotesPagination')
                .set('Authorization', `Bearer ${token}`)
                .query(testSamples.queryWithoutLimit)
                .end((error, response) => {
                    response.body.success.should.have.equal(false);
                    response.body.message.should.have.equal('"limit" is required');
                });
            done();
        });
    });
});
