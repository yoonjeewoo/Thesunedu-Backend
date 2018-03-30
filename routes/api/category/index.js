const router = require('express').Router();
const controller = require('./category.controller');

router.post('/activity', controller.createActivity);
router.get('/activity', controller.getActivityList);

router.post('/level', controller.createLevel);
router.get('/level', controller.getLevelList);


module.exports = router;
