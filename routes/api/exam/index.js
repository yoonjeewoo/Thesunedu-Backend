const router = require('express').Router();
const controller = require('./exam.controller');

router.post('', controller.createExam);
router.get('/all', controller.getExamList);
router.get('/:exam_id', controller.getOneExam);
router.delete('/:exam_id', controller.deleteExam);
router.post('/problem', controller.createProblem);
router.get('/problem/:exam_id', controller.getProblemList);
router.put('/problem', controller.updateProblem);
router.post('/result', controller.saveResult);
module.exports = router;
