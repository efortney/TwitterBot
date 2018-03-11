//=====STATEMENTS=====//
//Statements are created as functions in order to be used in the exports module. 

module.exports = {

    insertTweet : function(tweet) {
        sql = 'INSERT INTO tweets (tweetID, tweetText, date) VALUES ('
        + tweet.userID + ', ' + tweet.text  + ', ' +  tweet.date +  ' )';
        return sql; 
    },

    insertUser : function(user) { 
        sql = 'INSERT INTO users (userID, userName, location) VALUES ('
        + user.name + ', ' + user.userName + ', ' + user.location + ')';
        return sql;
    },

    /**
     * Creates a table based on the name of the location given
     * @param{String} name: name of the location 
     */
    createLocationTable : function(name) {
        let sql = 'CREATE TABLE IF NOT EXSITS ' + name + ' (' 
        + 'name text PRIMARY KEY, ' 
        + 'user_count INTERGER, '
        + 'total_tweets INTEGER';
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
        + ' userName text,'
        + 'FOREIGN KEY (userName) REFERENCES users (userName)';
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
        + ' favoriteCount int,'
        + ' retweetCount int,'
        + ' overallPopularity int'
        return sql;
    }
}