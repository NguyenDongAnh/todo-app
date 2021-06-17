const express = require('express');
const auth_controller = require('../controllers/auth.controller');
let router = express.Router();

router.post('/register', auth_controller.registerUser);
router.post('/login', auth_controller.logInUser);
router.post('/refreshtoken', auth_controller.getNewAccessToken);

module.exports = router;