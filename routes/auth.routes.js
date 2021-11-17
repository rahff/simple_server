const router = require('express').Router()
const authController = require('../controllers/auth.controller')

router.post('/create-user', authController.createUser);

router.post('/login', authController.login);

router.get('/logout', authController.logout);

router.get('/verif-token', authController.verifToken)


module.exports = router