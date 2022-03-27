var Crypto = require('crypto');
const conn = require('../database');
const transporter = require('../helpers/emailSender');
const client = require("../helpers/redis")
const {cacheSet} = require('../helpers/cachingMiddleware')
const jwt = require('jsonwebtoken')
const { jwtSecretKey } = require('../config')
const {sqlInjectFormChecker,sqlInjectEmailChecker} = require('../helpers/sqlInjectChecker')
module.exports = {
    register: (req,res,next) => {
        // var { fullname, username, email, password, phone } = req.body;
        var fullname = sqlInjectFormChecker(req.body.fullname,res);
        var username = sqlInjectFormChecker(req.body.username,res);
        var email = sqlInjectEmailChecker(req.body.email,res);
        var password = sqlInjectFormChecker(req.body.password,res);
        var phone = sqlInjectFormChecker(req.body.phone,res);

        var sql = `SELECT username, email FROM users WHERE username='${username}';`;
        conn.query(sql, (err, result) =>{
            if(err){
                throw err
            }
            if(result.length > 0){
                res.status(409).send({status: "error", message: "Username tidak tersedia atau sudah digunakan oleh orang lain harap menggunakan username yang berbeda seperti menambahkan nomor pada username!"})
            } else {
                var sqlEmail = `SELECT username, email FROM users WHERE email='${email}';`;
                conn.query(sqlEmail, (err, result2) =>{
                     // console.log(Error('Error Auth controller'));
                    if(result2.length > 0){
                        res.status(409).send({status: "error", message: "Email tidak tersedia atau sudah digunakan pada akun lain harap menggunakan email yang belum digunakan pada web siapptn atau jika kamu lupa password akun yang terdaftar pada email tersebut, kamu bisa klik forget pada halaman login"})
                    } else {
                        const hashPassword = Crypto.createHmac('sha256', "abcd123")
                        .update(password).digest('hex');
                            var dataUser = { 
                                username,
                                password: hashPassword,
                                email,
                                phone,
                                nama:fullname,
                                role: 'User',
                                lastlogin: new Date() 
                            }
                            sql = `INSERT INTO users SET ?`;
                            conn.query(sql, dataUser, (err1, result1) => {
                                // console.log(Error('Error Auth controller'));
                                // var mailOptions = {
                                //     from: 'No Reply <halo@siapptn.com>',
                                //     to : email,
                                //     subject : 'Salam dari Siapptn',
                                //     html: `<p><b>Hallo ${username}</b></p>
                                //     <p>Terimakasih telah bergabung dalam keluarga Siapptn, ayo tentukan dan raih impianmu bersama Siapptn</p>
                                //     <p>Siapptn akan selalu mengadakan tryout, ingin tau kabar tryout terdekat pantau terus social media kami dan website siapptn.com</p>
                                //     <br><br>
                                //     <img src="https://siapptn.com/image/siapptn.png" style="width:250px;"/>
                                //     `
                                // }

                                // transporter.sendMail(mailOptions, (err2, res2) => {
                                //     if(err2){
                                //         // res.send({status: 'Error!', message: 'Error sending message'})
                                //         throw err2;
                                //     } else {
                                //         res.send({username, email, role: 'User', status: 'Unverified', token:''})
                                //     }
                                // })
                                
                            res.send({username, email, role: 'User', status: 'Unverified', token:''})
                            next()
                            
                            })
                    }  
                })
            }
        })
    },
    signin: (req,res,next) => {

        var { username, password } = req.body;
        var username = sqlInjectFormChecker(req.body.username,res);
        var password = sqlInjectFormChecker(req.body.password,res);
        const hashPassword = Crypto.createHmac('sha256', "abcd123")
        .update(`${password}`).digest('hex');
        var key = 'user_data' +  username + '_' + hashPassword;
        client.get(key,(err,data) => {
            
            if(err) res.status(500).json({error : "redis error",message:err})
            if(data != null && data != undefined){
                var dataRedis = JSON.parse(data)
                var updateLogin = {
                    lastlogin: new Date()
                }
                var sql2 = `UPDATE users SET ? WHERE username='${username}';`;
                conn.query(sql2, updateLogin, (err, result2) => {
                     // console.log(Error('Error Auth controller'));
                }) 
                jwt.sign({id : dataRedis[0].id,username:dataRedis[0].username} , jwtSecretKey,(err,token) => {
                    if(err) throw err
                    dataRedis[0].token = token
                    res.send(dataRedis);
                    req.is_redis = true
                    next()
                    
                })
            }else{
                var sql = `SELECT * FROM users WHERE username = ? AND password = ? and status= "verified";`;
                conn.query(sql,[username,hashPassword] ,(err, result) => {
                     // console.log(Error('Error Auth controller'));
                   if(result.length == 0){
                        res.status(404).send({status: "error", message: "Username atau password salah!"})
                   }else{
                        var updateLogin = {
                            lastlogin: new Date()
                        }
                        var sql2 = `UPDATE users SET ? WHERE username='${username}';`;
                        conn.query(sql2, updateLogin, (err, result2) => {
                             // console.log(Error('Error Auth controller'));
                        }) 
                        // generate jwt token
                        client.set('user_data' +  username + '_' + hashPassword,JSON.stringify(result))
                        jwt.sign({id : result[0].id,username:result[0].username} , jwtSecretKey,(err,token) => {
                            if(err) throw err
                            result[0].token = token
                            res.send(result);
                            next()
                            
                        })
                      
                    }
                })
            }
        })
       
       
    },
    
    keeplogin: (req,res,next) => {

        var username = req.body.username;
        var id = req.body.id;
        if(req.body.data){
            var sql = `SELECT id,username,nama,email,phone,image,status,paket,role,peminatan,siap_belajar FROM users WHERE username = ? and id = ?;`;
            conn.query(sql,[username,id], (err, result) => {
                // console.log(Error('Error Auth controller'));
                if(result.length>0){
                    res.send(result);
                }else{
                    res.status(404).send({message:'Maaf login sessionmu telah hilang silahkan login kembali'});
                }
                next()
            })
        }else{
            res.status(200).json({message:'data sudah diambil', error:false});
        }
       
    },
    getListUser:(req,res,next) => {
        var sql = `SELECT * FROM users;`;
        conn.query(sql, (err, result) => {
            if(err){
                throw err
            }
            // console.log(Error('Error Auth controller'));
            res.send(result);
            next()
        })
    },
    changeStatusUser:(req,res,next) => {
        var {status,id} = req.body
        var sql = `update users set status = ? where id = ?;`;
        conn.query(sql,[status,id] ,(err, result) => {
            if(err){
                throw err
            }
            // console.log(Error('Error Auth controller'));
            res.send(result);
            next()
        })
    },
    changePassword:(req,res,next) => {
        var {password,id} = req.body
        const hashPassword = Crypto.createHmac('sha256', "abcd123")
        .update(password).digest('hex');
        var sql = `update users set password = ? where id = ?;`;
        conn.query(sql,[hashPassword,id] ,(err, result) => {
            if(err){
                throw err
            }
            // console.log(Error('Error Auth controller'));
            res.send(result);
            next()
        })
    },
    forgetPassword:(req,res,next)=>{
        var {email} = req.body;
        var sql = `select * from users where email = ?;`;
        conn.query(sql,[email] ,(err, result) => {
            if(err){
                throw err
            }
            // console.log(Error('Error Auth controller'));
           if(result.length>0){
            var mailOptions = {
                from: 'Zkeys no reply <noreply@siapptn.com>',
                to : emailAdmin,
                subject : `Pertanyaan dari bapak/ibu ${nama}`,
                html: `<p><b>Hallo  ${email}</b></p><br/>
                <p>Berikut link untuk update password</p><br/>
                <a href="zkeys.id/change-password-forget?id=${resul[0].id}"></a><br/>
                `
            }
    
            transporter.sendMail(mailOptions, (err3, res3) => {
                if(err3){
                    // res.send({status: 'Error!', message: 'Error sending message'})
                    res.status(409).json({ error: "Email error",message:err3});
                    throw err3;
                } else {
                    res.status(200).json({ error: false,message:"Email berhasil terkirim"});
                    next()
                }
            })
           }else{
                res.status(409).json({ error: "Email not found",message:"Email tidak ditemukan"});
                next()
           }
        })
       
    }
  
}
      