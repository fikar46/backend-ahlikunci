var express = require('express');
var router = express.Router();
const { kunciController} = require('../controller');
const {cacheGet,cacheUpdate,cacheGeneralDelete, cacheUniqueGet, cacheUniqueDelete,cacheGeneralGet,cacheFlushAll} = require('./../helpers/cachingMiddleware');
const { jwtMiddleware } = require('../helpers/jwtTokenMiddleWare')
router.post('/getalltestimoni', cacheUniqueGet("testimoni_page"),kunciController.getAllTestiomoni);
router.post('/posttestimoni', cacheFlushAll(),kunciController.postTestimoni);
router.post('/updatetestimoni',cacheFlushAll(), kunciController.updateTestimoni);
router.post('/updatestatustestimoni',cacheFlushAll(), kunciController.updateStatusTestimoni);
router.post('/gettestimonibyid', cacheUniqueGet("testimoni"),kunciController.getTestimoniById);
router.post('/createlayanan', cacheFlushAll(),kunciController.createLayanan);
router.post('/getlayanan', cacheUniqueGet("layanan_page"),kunciController.getAllLayanan);
router.post('/getlayananlandingpage', cacheGeneralGet("layanan_landingpage"),kunciController.getAllLyananLandingPage);
router.post('/updatestatuslayanan', cacheFlushAll(),kunciController.updateStatusLayanan);
router.post('/updatelayanan', cacheFlushAll(),kunciController.updateLayanan);
router.post('/getlayananbyid', cacheUniqueGet("layanan"),kunciController.getLayananById);
router.post('/updatecarouselll', cacheGeneralDelete("carousell"),kunciController.updateCarousell);
router.post('/getcarousell', cacheGeneralGet("carousell"),kunciController.getCarousell);
router.post('/getcontact', cacheGeneralGet("contact"),kunciController.getContact);
router.post('/updatecontact', cacheGeneralDelete("contact"),kunciController.updateContact);
router.post('/getmeta', cacheGeneralGet("meta"),kunciController.getMetaLandingPage);
router.post('/updatemeta', cacheGeneralGet("meta"),kunciController.updateMetaLandingPage);

module.exports = router;