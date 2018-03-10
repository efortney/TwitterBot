//===== ACTION PAGE =====//

//===== imports =====//
var user = require('./user.js')
var tweetObject = require('./tweet.js')

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
      collectData(tweet)
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
}

/**
 * Create a user object from the data returned by the collect data function
 * This creates a user object, adds them to user list, which is exported to mongodb
 * @param {array} data 
 */
function createUser(data){
   let newUser = new user()
   newUser.userName = data[1];
   newUser.name = data[2];
   newUser.location = data[3]
   newUser.retweetCount = parseInt(data[4]);
   newUser.favoriteCount = parseInt(data[5]);
   newUser.tweet = data[0];
   insertData(newUser)
}

/**
 * Insert a user into the Mongodb database 
 * User must contain at minimum: name, handle, 1 tweet 
 * @param {object} user 
 */
function insertData(user) {
  console.log(user.name)
  console.log(user.location)
  console.log(user.tweet)
}

