
'use strict'
//===== ACTION PAGE =====//

//===== imports =====//
var user        = require('./user.js')
var tweet       = require('./tweet.js')
var queries     = require('./queries.js')
// connection to database 
const sqlite3   = require('sqlite3').verbose(); //set this to verbose so we can get detailed stack traces 


module.exports = {
  /**
   * Opens a stream and grabs data from a specified location
   * This method requires callbacks nested deep within the module. 
   * It will first call collect data, which will grab only the data wanted and placing it into an
   * array. It will then call nested functions which will process the data, create the
   * corresponding objects, and insert them into a database. 
   * @param{bot} bot: any twitter bot object
   * @param{param} object: a city, or set of coordinate pairs.
   */
  streamSearch: function(bot, param) {
    console.log("Watching for tweets from " + param.name)
    var stream = bot.stream('statuses/filter',
    { locations: param.id })
    stream.on('tweet', function (tweet) {
      var db = connect()
      var location = queries.createLocationTable(param.name) // create the location as a table
      insertData(location,db) // insert the table into db
      collectData(tweet,db) // grab data and store it 
      closeCon(db)
    })
  },
}

/**
 * Callback function for the stream search function. 
 * Stores data in an array, passed to a user  or tweet object.
 * @param {*} tweet, a tweet object from the twitter streaming API.  
 */
function collectData(tweet,db) {
  var data = [] // store all data in an arry and prepare to create a user object 
  let text = tweet.text;
  let userName = tweet.user.screen_name;
  let name = tweet.user.name;
  let location = tweet.place.full_name;
  let retweets = tweet.retweet_count;
  let favorites = tweet.favorite_count;
  let time = tweet.created_at;
  data.push(text,userName,name,location,retweets,favorites,time)
  createUser(data,db)
  createTweet(data,db)
}

/**
 * Create a user object from the data returned by the collect data function
 * This creates a user object, adds them to user list, which is exported to database
 * CALLBACK: insertData
 * @param {array} data 
 */
function createUser(data,db){
   let newUser = new user()
   newUser.userName = data[1];
   newUser.name = data[2];
   newUser.location = data[3]
   newUser.userID = data[2]
   createData(newUser,db)
}

/**
 * Create a tweet object, which will be stored in the database as a tweet object 
 * CALLBACK: insertData
 * @param {array} data 
 */
function createTweet(data,db){
  let newTweet = new tweet();
  newTweet.text = data[0]
  newTweet.date = data[6]
  newTweet.userID = data[2]
  newTweet.userName = data[1]
  createData(newTweet,db)
}

/**
 * Creates the appropriate query to insert data into database
 * @param{object} a tweet or user object 
 */
function createData(object,db) {
  // flag the object as not a user
  let flag = false;
  // if the object contains a username, then it is user. 
  if(object.hasOwnProperty('location')){
    flag = true;
  }
 
  // USER !! TRUE FLAG
  if(flag == true){
    try{
      let table = queries.createUserTable(object)
      let user = queries.insertUser(object)
      insertData(table,db)
      insertData(user,db)
      }catch(err){
        console.log("Error creating data: "+ err)
      }
  }
  // TWEET !! FALSE FLAG
  else{
    try{
      let tweetTable = queries.createTweetTable(object)
      let tweet = queries.insertTweet(object)
      insertData(tweetTable,db)
      insertData(tweet,db)
      }catch(err){
        console.log("Error creating data: "  +err)
      }
  }
  console.log("Data logged")
  
} // end of create data

/**
 * Inserts data into a database.
 * @param {*} db 
 */
function insertData(query,db) {
  try{
  db.serialize(function(){
    db.run(query)
  })
  }catch(err){
    console.log("Error inserting data: " + err)
  }
}

/**
 * Closes a database connection, returns error message to console if error is thrown. 
 * @param{sqlite3} db 
 */
function closeCon(db) {
  db.close((err) => {
    if(err){
        return console.error(err.message);
    }
    console.log("Database closed");
  })
}

/**
 * Opens a connection to a sqlite3 database. If the database does not exist, it will create a new one in memory. 
 * As default it is set to readable and writable.  
 */
function connect(){
  let db = new sqlite3.Database('twitter', (err) => {
    if(err) {
        return console.error(err.message)
    }
    else {
    console.log("db connected successfully")
    }
  });
  return db;
}





