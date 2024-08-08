//loginModel.js
require('dotenv').config();
const mongoose = require('mongoose');
const dbURL = process.env.DB_URL;
const schema = mongoose.Schema;

mongoose.connect(dbURL).then( () => {
    console.log("loginconnected");
}).catch( (e) => {
    console.log(e);
})

module.exports = mongoose.model('users', {});