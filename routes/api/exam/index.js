const router = require('express').Router();
const controller = require('./exam.controller');

router.post('', controller.createExam);

module.exports = router;
