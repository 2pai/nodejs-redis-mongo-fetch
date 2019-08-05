const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const banner = new Schema({
    bannerAndroid: String,
    bannerWebsite: String,
    bannerAds: String,
    bannerIOS: String,
});


module.exports = {
    banner
}