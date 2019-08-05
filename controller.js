const mongoose = require('mongoose');
const model = require('./models');
const redis = require('redis');
const client = redis.createClient();
const fetch = require('node-fetch');
require('dotenv').config()
mongoose.connect(process.env.MONGOURL, {useNewUrlParser: true});

const banner = mongoose.model('banner', model.banner,'banner');
const getBanner = (req,res) => {
    const redisKey = 'banner';
    client.get(redisKey,(err,data) => {
        if(data){// cek apakah ada di redis atau tidak
            res.status(200).send({isCached:true,data:JSON.parse(data)});
        }else{
            banner.find({},(err,fetchData)=>{
                client.set(redisKey,JSON.stringify(fetchData),'EX',60); // simpan hasil query ke dalam redis dalam bentuk JSON yang sudah di jadikan string, kita setting expired selaman 60 (detik)
                res.status(200).send({data:fetchData}); 
            }); // fetch data dari mongoDB
        }
    });
}
const postBanner = async (req,res) => {
    let body = new banner({
        bannerAndroid: req.body.bannerAndroid,
        bannerWebsite: req.body.bannerWebsite,
        bannerAds: req.body.bannerAds,
        bannerIOS: req.body.bannerIOS,    
    })
   let response = await body.save();
   res.status(200).send(response);
}
const getIPInfo =  async (req,res) => {
    const redisKey = 'keyip:'+req.ip; // key berdasarkan ip user
    client.get(redisKey,async (err,data) => {
        if(data){ // cek apakah ada di redis atau tidak
            res.status(200).send({isCached:true,data:JSON.parse(data)}); 
        }else{
            let fetchData = await fetch("http://ip-api.com/json/"+req.ip)
            .then((response)=> {
                return response.json();
            });// fetch data dari API
            client.set(redisKey,JSON.stringify(fetchData),'EX',60); // simpan hasil request ke dalam redis dalam bentuk JSON yang sudah di jadikan string, kita setting expired selaman 60 (detik)            
            res.status(200).send({data:fetchData}); 
        }
    });
}

module.exports = {
    getBanner,
    getIPInfo,
    postBanner
}