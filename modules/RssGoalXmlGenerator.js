const handlebars = require('handlebars');
const moment = require('moment-timezone');

/*
    TODO
        Unit tests!
        Fix UTC issue
        Site field in XML
        External handlebars?
*/

const feedTemplate = handlebars.compile(`<?xml version="1.0" encoding="UTF-8"?>
<rss>
<channel>
    <title>{{channelTitle}}</title>
    {{#each items}}
        <item>
            <title>{{itemTitle}}</title>
            <guid>{{itemGuid}}</guid>
            <pubDate>{{itemPubDate}}</pubDate>
            {{#if isPodcast}}
            <enclosure url="http://soundbible.com/grab.php?id=2030&amp;type=mp3" type="audio/mpeg"/>
            {{/if}}
        </item>
    {{/each}}
    </channel>
</rss>`);

const rssGoalXmlGenerator = ({channelTitle, dueDate, goalDate, isPodcast, itemTitlePrefix}) => {
    const context = {};
    const entries = [];

    context.channelTitle = channelTitle;

    const dueDateMoment = momentWithTimezone(dueDate);
    const goalDateMoment = momentWithTimezone(goalDate).endOf('day');

    while(goalDateMoment.isBefore()){
        if(dueDateMoment.isoWeekday() < 6){
            entries.push({
                isPodcast: typeof isPodcast === 'string' && isPodcast.toLowerCase() === 'true',
                itemTitle: itemTitlePrefix + ' ' + dueDateMoment.format('YYYY-MM-DD'),
                itemGuid: goalDateMoment.utc().format('ddd, DD MMM YYYY HH:mm:ss z'),
                itemPubDate: goalDateMoment.utc().format('ddd, DD MMM YYYY HH:mm:ss z')
            });

            dueDateMoment.add(1, 'day');
            goalDateMoment.add(2, 'day');
        }
        else {
            dueDateMoment.add(1, 'day');
        }
    }

    context.items = entries;

    const xml = feedTemplate(context);

    return xml;
};

const momentWithTimezone = (...args) => {
    args.push('Australia/Sydney');
    return moment.tz.apply(this, args);
};

module.exports = rssGoalXmlGenerator;