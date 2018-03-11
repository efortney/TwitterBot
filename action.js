//===== ACTION PAGE =====//

//===== imports =====//
var user        = require('./user.js')
var tweet       = require('./tweet.js')
var queries     = require('./queries.js')
// connection to database 
const sqlite3   = require('sqlite3').verbose(); //set this to verbose so we can get detailed stack traces 


module.exports = {
  /**
   * opens a stream and grabs data from a specified location
   */
  streamSearch: function(bot, param) {
    console.log("Watching for tweets from " + param.name)
    console.log(param.id)
    var stream = bot.stream('statuses/filter',
    { locations: param.id })
    stream.on('tweet', function (tweet) {
      var db = connect()
      queries.createLocationTable(param.id)
      collectData(tweet)
      closeCon(db)
    })
  },
}

/**
 * Callback function for the stream search function. 
 * Stores data in an array, passed to a user object.
 * @param {*} tweet, a tweet object from the twitter streaming API.  
 */
function collectData(tweet) {
  var data = [] // store all data in an arry and prepare to create a user object 
  let text = tweet.text;
  let userName = tweet.user.screen_name;
  let name = tweet.user.name;
  let location = tweet.place.full_name;
  let retweets = tweet.retweet_count;
  let favorites = tweet.favorite_count;
  let time = tweet.created_at;
  data.push(text,userName,name,location,retweets,favorites,time)
  createUser(data)
  createTweet(data)
}

/**
 * Create a user object from the data returned by the collect data function
 * This creates a user object, adds them to user list, which is exported to database
 * CALLBACK: insertData
 * @param {array} data 
 */
function createUser(data){
   let newUser = new user()
   newUser.userName = data[1];
   newUser.name = data[2];
   newUser.location = data[3]
   insertData(newUser)
}

/**
 * Create a tweet object, which will be stored in the database as a tweet object 
 * CALLBACK: insertData
 * @param {array} data 
 */
function createTweet(data){
  let newTweet = new tweet();
  tweet.text = data[0]
  tweet.date =data[6]
  tweet.userID = data[2]
  insertData(newTweet)
}

/**
 * Insert an objet into the sqlite database 
 * @param {object} a tweet or user object 
 */
function insertData(object) {
  // flag the object as not a user
  let flag = false;
  console.log(typeof(object))
  // if the object contains a username, then it is user. 
  if(object.hasOwnProperty('userName')){
    flag = true;
  }

  // TWEET !! FALSE FLAG
  if(flag == false){
    console.log("inserting tweet into database")
    queries.createTweetTable()
    queries.insertTweet(object)
  }
  // USER !! TRUE FLAG
  else{
  console.log("Inserting user into database")
  queries.createUserTable(object)
  queries.insertUser(object)
  }

} // end of insert data

/**
 * Closes a database connection, returns error message to console if error is thrown. 
 * @param {sqlite3} db 
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
  let db = new sqlite3.Database(':twitter', (err) => {
    if(err) {
        return console.error(err.message)
    }
    else {
    console.log("db connected successfully")
    }
  });
  return db;
}





