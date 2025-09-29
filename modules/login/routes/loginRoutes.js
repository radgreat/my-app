const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const { rateLimiter } = require('../../../middleware/auth');

router.get('/', loginController.showLogin);
router.get('/verify', loginController.verified); 
router.get('/resend-verification', loginController.resendVerificationGet);
router.post('/resend-verification', loginController.resendVerificationPost); 
router.get('/reset', loginController.resetPasswordGet);
router.post('/reset', loginController.resetPasswordPost);
router.get('/reset-password', loginController.dispResetPasswordGet);
router.post('/reset-password', loginController.dispResetPasswordPost);
router.post('/login', rateLimiter, loginController.getUser);
router.get('/register', loginController.showRegister);
router.post('/created', loginController.createUser);
router.post('/logout', loginController.logout);
router.get('/google', loginController.google);
router.get('/google/callback', loginController.googleCallBack);
router.get('/facebook', loginController.facebook);
router.get('/facebook/callback', loginController.facebookCallBack);

module.exports = router;