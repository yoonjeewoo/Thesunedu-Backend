const router = require('express').Router();
const controller = require('./exam.controller');

router.post('', controller.createExam);
router.get('/all', controller.getExamList);
router.post('/problem', controller.createProblem);


module.exports = router;
