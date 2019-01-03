const readScriptureXmlGenerator = require('../modules/ReadScriptureXmlGenerator');

const url = require('url');

const feed = (req, res) => {
    const requestParameters = url.parse(req.url, true).query;

    const xml = readScriptureXmlGenerator(requestParameters);

    res.end(xml);
};

module.exports = feed;