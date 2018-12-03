const rssGoalXmlGenerator = require('../modules/RssGoalXmlGenerator');

const url = require('url');


const feed = (req, res) => {
    const requestParameters = url.parse(req.url, true).query;

    const xml = rssGoalXmlGenerator(requestParameters);

    res.end(xml);
};

module.exports = feed;