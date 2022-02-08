var Crypto = require('crypto');
const conn = require('../database');
const transporter = require('../helpers/emailSender');
const client = require("../helpers/redis")
const {cacheSet} = require('../helpers/cachingMiddleware')
const jwt = require('jsonwebtoken')
const { jwtSecretKey } = require('../config')
const {sqlInjectFormChecker,sqlInjectEmailChecker} = require('../helpers/sqlInjectChecker')
module.exports = {
    getAllTestiomoni:(req,res,next)=>{
       
        var sql = `SELECT id,kategori,judul,caption,id_user,status_blog,date_create,thumbnail FROM blog
        order by date_create desc
        LIMIT 10 OFFSET ?`;
        var sqlCount = `select count(*) as totalCount from blog`;
        conn.query(sql,[req.body.page],(err,result)=>{
        conn.query(sqlCount,(err2,result2)=>{
            if(err2){
                throw err2
            }
            var  perPage = 10
            var totalCount = result2[0].totalCount;
            var pagination = Math.ceil(totalCount/perPage);
            var data  = {pagination,result}
            cacheSet(req.redis_key, data)
            res.send(data)
            next()

        })
       })
    },
    postTestimoni:(req,res,next)=>{
        var sql = `INSERT INTO blog set ?`
        conn.query(sql,req.body,(err,result)=>{
            if(err){
                throw err
            }
            res.send(result)
            next()
        })
    },
    updateTestimoni:(req,res,next)=>{
        var {id,judul,kategori,konten,status_blog,thumbnail,caption} = req.body;
        var data = {judul ,kategori, konten, status_blog,thumbnail,caption}
        var sql = `update blog set ? 
        WHERE id = ?`;
        conn.query(sql, [data,id],(err, result) => {
             // console.log(Error('Error Diskusi controller'));
            res.send(result)
            next()
        })
    },
    updateStatusTestimoni:(req,res,next)=>{
        var sql = `update blog set status_blog=? where id=?`
        conn.query(sql,[req.body.status_blog,req.body.id],(err,result)=>{
             // console.log(Error('Error Diskusi controller'));
            res.send(result)
            next()
        })
    },
    getTestimoniById:(req,res,next)=>{
        var sql = `select * from blog where id = ?`
        conn.query(sql,req.body.id,(err,result)=>{
            if(err){
                throw err
            }
            cacheSet(req.redis_key, result)
            res.send(result)
            next()
        })
    },
    createLayanan:(req,res,next)=>{
        var sql = `insert into layanan set ?`
        conn.query(sql,req.body,(err,result)=>{
            if(err){
                throw err
            }
            res.send(result)
            next()
        })
    },
    getAllLayanan:(req,res,next)=>{
        var sql = `select * from layanan LIMIT 10 OFFSET ?`;
        var sqlCount = `select count(*) as totalCount from layanan`;
        conn.query(sql,req.body.page,(err,result)=>{
            if(err){
                throw err
            }
            conn.query(sqlCount,(err2,result2)=>{
                if(err2){
                    throw err2
                }
                var  perPage = 10
                var totalCount = result2[0].totalCount;
                var pagination = Math.ceil(totalCount/perPage);
                var data  = {pagination,result}
                cacheSet(req.redis_key, data)
                res.send(data)
                next()

            })
            
        })
    },
    updateStatusLayanan:(req,res,next)=>{
        var sql = `update layanan set status_layanan= ? where id=?`
        conn.query(sql,[req.body.status_layanan,req.body.id],(err,result)=>{
             // console.log(Error('Error Diskusi controller'));
            res.send(result)
            next()
        })
    },
    getLayananById:(req,res,next)=>{
        var sql = `select * from layanan where id = ?`
        conn.query(sql,req.body.id,(err,result)=>{
            if(err){
                throw err
            }
            res.send(result)
            next()
        })
    },
    updateLayanan:(req,res,next)=>{
        var {id,nama,foto,status_layanan} = req.body;
        var data = {nama,foto,status_layanan}
        var sql = `update layanan set ? 
        WHERE id = ?`;
        conn.query(sql, [data,id],(err, result) => {
             // console.log(Error('Error Diskusi controller'));
            res.send(result)
            next()
        })
    },
}
      