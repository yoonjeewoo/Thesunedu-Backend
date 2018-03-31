const router = require('express').Router();

const category = require('./category');
const exam = require('./exam');

router.use('/category', category);
router.use('/exam', exam);

module.exports = router;
