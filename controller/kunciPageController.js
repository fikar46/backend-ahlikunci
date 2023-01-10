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
       
        var sql = `SELECT * FROM blog
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
        var {id,judul,kategori,konten,status_blog,thumbnail,caption,youtube} = req.body;
        var data = {judul ,kategori, konten, status_blog,thumbnail,caption,youtube}
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
        var sql = `select * from layanan order by id desc LIMIT 10 OFFSET ?`;
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
    getAllLyananLandingPage:(req,res,next)=>{
        var sql = `select * from layanan where status_layanan = 'active' order by rand() desc LIMIT 15 OFFSET 0`;
        conn.query(sql,(err,result)=>{
            if(err){
                throw err
            }
            cacheSet(req.redis_key, result)
            res.send(result)
            next()
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
    updateCarousell:(req,res,next)=>{
        var sql = `update carousell set ? 
        WHERE id = ?`;
        conn.query(sql, [req.body,req.body.id],(err, result) => {
             // console.log(Error('Error Diskusi controller'));
             if(err){
                throw err
            }
            res.send(result)
            next()
        })
    },
    getCarousell:(req,res,next)=>{
        var sql = `select * from carousell`;
        conn.query(sql,(err, result) => {
             // console.log(Error('Error Diskusi controller'));
            res.send(result)
            next()
        })
    },
    getContact:(req,res,next)=>{
        var sql = `select * from contact_web`;
        conn.query(sql,(err, result) => {
             // console.log(Error('Error Diskusi controller'));
            res.send(result)
            next()
        })
    },
    updateContact:(req,res,next)=>{
        var sql = `update contact_web set ? 
        WHERE id = ?`;
        conn.query(sql, [req.body,req.body.id],(err, result) => {
             // console.log(Error('Error Diskusi controller'));
             if(err){
                throw err
            }
            res.send(result)
            next()
        })
    },
    getMetaLandingPage:(req,res,next)=>{
        var sql = `select * from meta_landing_page`;
        conn.query(sql,(err, result) => {
             // console.log(Error('Error Diskusi controller'));
            res.send(result)
            next()
        })
    },
    updateMetaLandingPage:(req,res,next)=>{
        var sql = `update meta_landing_page set ? 
        WHERE id = ?`;
        conn.query(sql, [req.body,req.body.id],(err, result) => {
             // console.log(Error('Error Diskusi controller'));
             if(err){
                throw err
            }
            res.send(result)
            next()
        })
    },
    sendEmail:(req,res,next)=>{
        var {nama,email,pertanyaan,whatsapp,emailAdmin} = req.body;
        var mailOptions = {
            from: 'Zkeys no reply <noreply@siapptn.com>',
            to : emailAdmin,
            subject : `Pertanyaan dari bapak/ibu ${nama}`,
            html: `<p><b>Hallo Admin</b></p><br/>
            <p>Nama pelanggan : ${nama}</p><br/>
            <p>Email pelanggan : ${email}</p><br/>
            <p>whatsapp pelanggan : ${whatsapp}</p><br/>
            <p>Memiliki pertanyaan sebagai berikut</p><br/>
            <p>${pertanyaan}</p>
            `
        }

        transporter.sendMail(mailOptions, (err3, res3) => {
            if(err3){
                // res.send({status: 'Error!', message: 'Error sending message'})
                res.status(409).json({ error: "Email error",message:err3});
                throw err3;
            } else {
                res.status(200).json({ error: false,message:"Email berhasil terkirim"});
            }
        })
    }
}
      