const express = require('express');
var compression = require('compression')
const bodyParser = require('body-parser');
const cors = require('cors');
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('/etc/letsencrypt/live/api.meylendra.com-0001/privkey.pem', 'utf8');
var certificate = fs.readFileSync('/etc/letsencrypt/live/api.meylendra.com-0001/fullchain.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var { uploader } = require('./helpers/uploader')

var port = process.env.PORT || 2023;
var app = express({defaultErrorHandler:false});
app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(compression())
// ----------------- MYSQL CONFIG -----------------------
const conn = require('./database'); 
app.get('/', (req,res) => {
    res.send('<h1>Welcome to ahlikunci API</h1>');
})

const { authRouter,kunciRouter} = require('./routers');
app.use(function(req, res, next){
  res.setTimeout(250000, function(){
          res.status(408).json({})
      });

  next();
});

app.use('/auth', authRouter);
app.use('/kunci', kunciRouter);
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
var date = new Date()
date.setUTCDate(date.getUTCDate()+7)
console.log("aktif pada " + date) 
httpServer.listen(2022, () => console.log('API Aktif di port ' + 2022));
httpsServer.listen(port, () => console.log('API Aktif di port ' + port));