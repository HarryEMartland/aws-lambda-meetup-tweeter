const jsonlint = require('jsonlint');
const fs = require('fs');

describe('Suffix', function () {

    it('groupSuffix', function () {
        jsonlint.parse(fs.readFileSync('src/groupSuffix.json', "utf8"))
    });

    it('vueSuffix', function () {
        jsonlint.parse(fs.readFileSync('src/venueSuffix.json', "utf8"))
    });

});