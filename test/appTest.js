const assert = require('assert');
const moment = require('moment');
const mock = require('mock-require');

mock('../src/groupSuffix.json', {"432":"@test"});
mock('../src/venueSuffix.json', {"9876":"@venue"});

const app = require('../src/index');

describe('App', function () {
    describe('#isLessThanOneDay()', function () {

        it('should return false when same time', function () {

            const time = moment("2010-10-20 04:30");
            const now = moment("2010-10-20 04:30");

            assert.equal(false, app.isLessThanOneDay(time, now));
        });

        it('should return false when more than one day away', function () {

            const time = moment("2010-10-10 04:30");
            const now = moment("2010-10-20 04:30");

            assert.equal(false, app.isLessThanOneDay(time, now));
        });

        it('should return true when less than one day away', function () {

            const time = moment("2010-10-20 05:30");
            const now = moment("2010-10-20 04:30");

            assert.equal(true, app.isLessThanOneDay(time, now));
        });
    });

    describe('#isAWeekAway()', function () {

        it('should return false when same time', function () {

            const time = moment("2010-10-20 04:30");
            const now = moment("2010-10-20 04:30");

            assert.equal(false, app.isAWeekAway(time, now));
        });

        it('should return false when more than one week away', function () {

            const time = moment("2010-10-10 04:30");
            const now = moment("2010-10-20 04:30");

            assert.equal(false, app.isAWeekAway(time, now));
        });

        it('should return false when 5 days away', function () {

            const time = moment("2010-10-26 04:30");
            const now = moment("2010-10-20 04:30");

            assert.equal(false, app.isAWeekAway(time, now));
        });

        it('should return true when less one week away', function () {

            const time = moment("2010-10-27 03:30");
            const now = moment("2010-10-20 04:30");

            assert.equal(true, app.isAWeekAway(time, now));
        });
    });

    describe('#createTweet()', function () {

        it('should return null when date is not set', function () {
            const tweet = app.createTweet({});
            assert.equal(null, tweet)
        });

        it('should create tweet for tomorrow', function () {
            const tweet = app.createTweet({
                time: moment().add(1, 'hour'),
                group: {name: "Manchester Java"},
                venue: {name: "Federation", lat: 5.67, lon: 8.91},
                link: "www.com"
            });
            assert.equal("Looking forward to Manchester Java at Federation tomorrow www.com", tweet.status);
            assert.equal(5.67, tweet.lat);
            assert.equal(8.91, tweet.long);
        });

        it('should add group suffix if found', function () {

            const tweet = app.createTweet({
                time: moment().add(1, 'hour'),
                group: {name: "Manchester Java", id:432},
                venue: {name: "Federation", lat: 5.67, lon: 8.91},
                link: "www.com"
            });

            assert.equal(true, tweet.status.endsWith(" @test"))
        });

        it('should add venue suffix if found', function () {

            const tweet = app.createTweet({
                time: moment().add(1, 'hour'),
                group: {name: "Manchester Java"},
                venue: {name: "Federation", lat: 5.67, lon: 8.91, id:9876},
                link: "www.com"
            });

            assert.equal(true, tweet.status.endsWith(" @venue"))
        });

        it('should add venue and group suffix if found', function () {

            const tweet = app.createTweet({
                time: moment().add(1, 'hour'),
                group: {name: "Manchester Java", id:432},
                venue: {name: "Federation", lat: 5.67, lon: 8.91, id:9876},
                link: "www.com"
            });

            assert.equal(true, tweet.status.endsWith(" @test @venue"))
        });
    })
});