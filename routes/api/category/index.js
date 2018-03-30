const router = require('express').Router();
const controller = require('./category.controller');

router.post('/activity', controller.createActivity);
router.get('/activity', controller.getActivityList);
router.delete('/activity', controller.deleteActivity);

router.post('/level', controller.createLevel);
router.get('/level', controller.getLevelList);
router.delete('/level', controller.deleteLevel);


module.exports = router;
