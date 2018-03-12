//=====STATEMENTS=====//
//Statements are created as functions in order to be used in the exports module. 
'use strict'

module.exports = {

    /**
     * Inserts a tweet into the tweet table. 
     * @param{Object} a tweet object.
     */
    insertTweet : function(tweet) {
        sql = 'INSERT INTO tweets (tweetText, date, userName) VALUES ('
        + '"' + tweet.text  + '", "' +  tweet.date +  '", "' + tweet.userName + '" )';
        return sql; 
    },

    /**
     * Inserts a user into the user table.
     * @param{Object} a user object 
     */
    insertUser : function(user) { 
        sql = 'INSERT or replace INTO users (userID, userName, location, userID) VALUES ('
        +'"'+ user.name + '", "' + user.userName + '", "' + user.location + '", "' + user.userID +  '" )';
        return sql;
    },

    /**
     * Creates a table based on the name of the location given
     * @param{String} name: name of the location 
     */
    createLocationTable : function(name) {
        let sql = 'CREATE TABLE IF NOT EXISTS "' + name + '" (' 
        + 'name text PRIMARY KEY, ' 
        + 'user_count INT, '
        + 'total_tweets INT )';
        return sql;
    },

    /**
     * Creates a tweet table in the database
     */
    createTweetTable : function() {
        let sql = 'CREATE TABLE IF NOT EXISTS tweets ('
        + ' tweetID INTEGER PRIMARY KEY AUTOINCREMENT,'
        + ' tweetText text,'
        + ' date text,'
        + ' userName text, '
        + ' FOREIGN KEY (userName) REFERENCES users(userName) )'
        return sql;
    },

    /**
     * Creates a user table in the database
     */
    createUserTable : function() {
        let sql = 'CREATE TABLE IF NOT EXISTS users ('
        + ' userID text PRIMARY KEY,'
        + ' userName text,'
        + ' location text,'
        + ' favoriteCount INT,'
        + ' retweetCount INT,'
        + ' overallPopularity INT )'
        return sql;
    }
}
