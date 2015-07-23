var express = require('express');
var app     = express();
var http = require('http').Server(app);
var mongo = require('./mongo.js');
var helper = require('./TweeterHelper.js');
var filters= require('./filter.json');

/**
 * Mongo
 */
var host = process.env.MONGODB_ADDON_HOST;
var uri = process.env.MONGODB_ADDON_URI;
var pwd = process.env.MONGODB_ADDON_PASSWORD;
var user = process.env.MONGODB_ADDON_USER;
var db = process.env.MONGODB_ADDON_DB;
var port = process.env.MONGODB_ADDON_PORT;

//read in redis hashtags to track
var initTracks = function (){
    if(filters.follows) {
        for (var i = 0; i < filters.follows.length; i++) {
            console.log("follow " + filters.follows[i].name);
            t.follow(filters.follows[i].name);
        }
    }
    if(filters.hashtags) {
        for (var i = 0; i < filters.hashtags.length; i++) {
            console.log("hashtags " + filters.hashtags[i].name);
            t.track("#" + filters.hashtags[i].name);
        }
    }
}



var Twitter = require('node-tweet-stream');
var t;
if(process.env.consumerKey) {
    t = new Twitter({
        consumer_key:process.env.consumerKey,
        consumer_secret: process.env.consumerSecret,
        token: process.env.accessToken,
        token_secret: process.env.tokenSecret
    });
} else {
    console.log("error: missing twitter credentials");
}

//When new tweet 
t.on('tweet', function (tweet) {
    //store in mongo
    console.log("Adding tweet " + JSON.stringify(tweet));
    var coll = mongo.collection("FROM_"+helper.getAccount(tweet)); //Adding From because could start with forbidden char
    coll.insert(tweet, function(err, res){
        if(err){
            console.log("Error adding tweet -> " + err);
        }
    });
});

t.on('error', function (err) {
    console.log('Oh no. Twitter error')
});

t.on('reconnect', function(reconnect){
    if(reconnect.type == 'rate-limit'){
        // do something to reduce your requests to the api
        console.log('error. reconnect type rate-limit');
    }
    console.log('twitter reconnect :' + JSON.stringify(reconnect));

    initTracks();
});

app.get('/', function(req, res){
    res.status(200);
    res.send('app started');

});

app.get('/tweets', function(req, res){
    var ts = req.param('ts');
    var account = req.param('account');
    if(!account){
        res.status(400);
    }
    var coll = mongo.collection(follow);
    coll.find().toArray(function(err, tweets){
        return tweets;
    });
});

mongo.connect(uri, function(){
    console.log('Connected to mongo at: ' + uri);
    http.listen(8080, function(){
        console.log('Server is listening on port: '+8080);
    });
    initTracks();
});
