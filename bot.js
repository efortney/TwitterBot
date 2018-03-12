//========== Twitter Bot ==========//
// Elliot Fortney 


'use strict'

const twit          = require('twit');
const location      = require('./location.js');
const action        = require('./action.js');
const user          = require('./user.js');
const userList      = require('./action.js').userList;
const config        = require('./config.js');
const queries       = require('./queries.js');

// Be sure to go to twitter and get your own API key. 
var bot = new twit(config)

// locations for bot testing 
var mowo = new location('-92.77994', '38.76098', '-94.77894', '39.76198')
var sanFran = new location('-122.75','36.8','-121.75','37.8')
sanFran.setName("San Francisco")
mowo.setName("St. Joseph")

//========== Run Bot ==========//
try{
action.streamSearch(bot,mowo)
}catch(err){
    console.log(err)
}