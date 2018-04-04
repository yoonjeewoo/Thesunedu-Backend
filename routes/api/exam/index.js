const router = require('express').Router();
const controller = require('./exam.controller');

router.post('', controller.createExam);
router.get('/all', controller.getExamList);
router.get('/:exam_id', controller.getOneExam);
router.post('/problem', controller.createProblem);
router.get('/problem/:exam_id', controller.getProblemList);
router.put('/problem', controller.updateProblem);


module.exports = router;
