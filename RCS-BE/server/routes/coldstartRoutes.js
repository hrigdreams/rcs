const express = require('express');
const coldstartController = require('../controllers/coldstartController');

const router = express.Router();

router.post('/save', coldstartController.saveTags.bind(coldstartController));
router.get('/:userId', coldstartController.getTags.bind(coldstartController));

module.exports = router;