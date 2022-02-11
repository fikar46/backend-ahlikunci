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
router.post('/createlayanan', cacheGeneralDelete("layanan"), cacheGeneralDelete("layanan_landingpage"),kunciController.createLayanan);
router.post('/getlayanan', cacheGeneralGet("layanan"),kunciController.getAllLayanan);
router.post('/getlayananlandingpage', cacheGeneralGet("layanan_landingpage"),kunciController.getAllLyananLandingPage);
router.post('/updatestatuslayanan', cacheGeneralDelete("layanan"), cacheGeneralDelete("layanan_landingpage"),kunciController.updateStatusLayanan);
router.post('/updatelayanan', cacheGeneralDelete("layanan"), cacheGeneralDelete("layanan_landingpage"),kunciController.updateLayanan);
router.post('/getlayananbyid', cacheGeneralDelete("layanan"),kunciController.getLayananById);
router.post('/updatecarouselll', cacheGeneralDelete("carousell"),kunciController.updateCarousell);
router.post('/getcarousell', cacheGeneralGet("carousell"),kunciController.getCarousell);
router.post('/getcontact', cacheGeneralGet("contact"),kunciController.getContact);
router.post('/updatecontact', cacheGeneralDelete("contact"),kunciController.updateContact);
router.post('/getmeta', cacheGeneralGet("meta"),kunciController.getMetaLandingPage);
router.post('/updatemeta', cacheGeneralGet("meta"),kunciController.updateMetaLandingPage);

module.exports = router;