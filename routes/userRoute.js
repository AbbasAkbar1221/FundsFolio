const express = require('express');
const {loginController, registerController} = require('../controllers/userController');

//router object
const router = express.Router();

// login POST
router.post('/login',loginController);

// Register POST
router.post('/register',registerController);

module.exports = router;