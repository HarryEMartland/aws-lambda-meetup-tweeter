const moment = require('moment');
const fetch = require('node-fetch');
const Twitter = require('twitter');

const groupSuffix = require('./groupSuffix.json');
const venueSuffic = require('./venueSuffix.json');

const meetupBaseUrl = 'https://api.meetup.com/';
const MEETUP_API_KEY = process.env.MEETUP_API_KEY;

const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

exports.handler = function (event, context, callback) {
    tweetEvents()
        .then(function () {
            callback();
        })
        .catch(function (e) {
            callback(e);
        });
};


function tweetEvents() {
    return fetch(meetupBaseUrl + 'self/events?&sign=true&photo-host=public&page=20&rsvp=yes,waitlist&status=upcoming&key=' + MEETUP_API_KEY)
        .then(response => response.json())
        .then(function (events) {
            return Promise.all(events
                .map(createTweet)
                .filter(tweet => tweet)
                .map(tweet))
        })
}

function tweet(tweet) {
    console.log(tweet);
    return client.post('statuses/update', tweet)
}

let createTweet = exports.createTweet = function (event) {
    event.time = moment(event.time);
    let timeFrame;
    if (isLessThanOneDay(event.time, moment())) {
        timeFrame = "tomorrow"
    } else if (isAWeekAway(event.time, moment())) {
        timeFrame = "next week"
    } else {
        return;
    }

    let suffix = "";
    if (groupSuffix[event.group.id + ""]) {
        suffix = suffix + " " + groupSuffix[event.group.id];
    }
    if (venueSuffic[event.venue.id + ""]) {
        suffix = suffix + " " + venueSuffic[event.venue.id];
    }

    return {
        status: `Looking forward to ${event.group.name} at ${event.venue.name} ${timeFrame} ${event.link}${suffix}`,
        lat: event.venue.lat,
        long: event.venue.lon
    }
};

let isLessThanOneDay = exports.isLessThanOneDay = function (time, now) {
    return time.isBetween(now, moment(now).add(1, 'days'));
};

let isAWeekAway = exports.isAWeekAway = function (time, now) {
    let weekAway = moment(now).add(1, 'week');
    return time.isBetween(moment(weekAway).subtract(1, 'days'), weekAway);
};