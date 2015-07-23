module.exports = {
    /**
     *  Get the man who tweeted
     */
    getAccount: function (tweet) {
        return tweet.user.screen_name;
      },

    getHashtag: function (tweet) {
    var hashtags = [];
        for(var j=0; j<tweet.entities.hashtags.length; j++){
                hashtags[j] = tweet.entities.hashtags[j].text;
        }
        return hashtags;
    },

}