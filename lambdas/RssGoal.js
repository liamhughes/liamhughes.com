const handlebars = require('handlebars');
const moment = require('moment-timezone');

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

const feed = (req, res) => {

    var context = {}, 
        dueDate,
        entries = [],
        targetDate;

    context.channelTitle = 'RSS Goal';

    dueDate = momentWithTimezone('2018-11-05');
    targetDate = momentWithTimezone('2018-09-11').endOf('day');

    while(targetDate.isBefore()){
        if(dueDate.isoWeekday() < 6){
            entries.push({
                itemTitle: 'RSS Goal: ' + dueDate.format('YYYY-MM-DD'),
                itemGuid: targetDate.utc().format('ddd, DD MMM YYYY HH:mm:ss z'),
                itemPubDate: targetDate.utc().format('ddd, DD MMM YYYY HH:mm:ss z')
            });

            dueDate.add(1, 'day');
            targetDate.add(2, 'day');
        }
        else {
            dueDate.add(1, 'day');
        }
    }

    context.items = entries;

    res.end(feedTemplate(context));
};

const momentWithTimezone = (...args) => {
    args.push('Australia/Sydney');
    return moment.tz.apply(this, args);
};

module.exports = feed;