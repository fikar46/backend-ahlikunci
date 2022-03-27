var express = require('express');
var router = express.Router();
const { authController } = require('../controller');
const {cacheGet,cacheUpdate,cacheGeneralDelete, cacheUniqueGet, cacheUniqueDelete,cacheGeneralGet,cacheFlushAll} = require('./../helpers/cachingMiddleware');
const { jwtMiddleware } = require('../helpers/jwtTokenMiddleWare')
router.post('/register', authController.register);
router.post('/signin',  authController.signin);
router.post('/keeplogin', jwtMiddleware,authController.keeplogin);
router.get('/getlistadminkunci',authController.getListUser);
router.post('/changepassword',cacheFlushAll(),authController.changePassword);
router.post('/changestatususer',cacheUniqueDelete('user_data'),authController.changeStatusUser);

module.exports = router;