const handlebars = require('handlebars');
const moment = require('moment-timezone');

/*
    TODO: Unit tests!
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
        </item>
    {{/each}}
    </channel>
</rss>`);

const rssGoalXmlGenerator = ({channelTitle, dueDate, goalDate, itemTitlePrefix}) => {
    const context = {};
    const entries = [];

    context.channelTitle = channelTitle;

    const dueDateMoment = momentWithTimezone(dueDate);
    const goalDateMoment = momentWithTimezone(goalDate).endOf('day');

    while(goalDateMoment.isBefore()){
        if(dueDateMoment.isoWeekday() < 6){
            entries.push({
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