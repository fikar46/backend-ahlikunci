var express = require('express');
var router = express.Router();
const { kunciController} = require('../controller');
const {cacheGet,cacheUpdate,cacheGeneralDelete, cacheUniqueGet, cacheUniqueDelete,cacheGeneralGet} = require('./../helpers/cachingMiddleware');
const { jwtMiddleware } = require('../helpers/jwtTokenMiddleWare')
router.post('/getalltestimoni', cacheGeneralGet("testimoni"),kunciController.getAllTestiomoni);
router.post('/posttestimoni', cacheGeneralDelete("testimoni"),kunciController.postTestimoni);
router.post('/updatetestimoni',cacheGeneralDelete("testimoni"),cacheUniqueDelete("testimoni"), kunciController.updateTestimoni);
router.post('/updatestatustestimoni',cacheGeneralDelete("testimoni"),cacheUniqueDelete("testimoni"), kunciController.updateStatusTestimoni);
router.post('/gettestimonibyid', cacheUniqueGet("testimoni"),kunciController.getTestimoniById);
router.post('/createlayanan', cacheGeneralDelete("layanan"),kunciController.createLayanan);
router.post('/getlayanan', cacheGeneralGet("layanan"),kunciController.getAllLayanan);
router.post('/updatestatuslayanan', cacheGeneralDelete("layanan"),kunciController.updateStatusLayanan);
router.post('/updatelayanan', cacheGeneralDelete("layanan"),kunciController.updateLayanan);
router.post('/getlayananbyid', cacheGeneralDelete("layanan"),kunciController.getLayananById);

module.exports = router;