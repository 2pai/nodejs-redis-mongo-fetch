const express = require("express");
const app = new express();
const controller = require('./controller');
const port = 8025;
const bodyParser = require('body-parser');
app.enable('trust proxy'); // agar bisa mengakses IP user
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/api/getInfoIP',controller.getIPInfo)
app.get('/api/getBanner',controller.getBanner)
app.post('/api/postBanner',controller.postBanner)

app.listen(port);
console.log('Server Run At : localhost:'+port);