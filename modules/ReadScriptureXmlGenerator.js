const handlebars = require('handlebars');
const moment = require('moment-timezone');

/*
    TODO
        Unit tests!
        Fix UTC issue
        Site field in XML
        External handlebars?
        Load entries directly from xlsx
        Move ReadScripture.json to B2?
*/

const feedTemplate = handlebars.compile(`<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" version="2.0">
<channel>
    <title>{{channelTitle}}</title>
    <link>{{channelLink}}</link>
    {{!--<language>{{channelLang}}</language>--}}
    {{!--<copyright>{{channelCopyright}}</copyright>--}}
    {{!--<itunes:subtitle>{{channelSubtitle}}</itunes:subtitle>--}}
    <itunes:author>{{channelAuthor}}</itunes:author>
    {{!--<itunes:summary>{{channelSummary}}</itunes:summary>  
    <itunes:owner>
        <itunes:name>{{channelOwnerName}}</itunes:name>
        <itunes:email>{{channelOwnerEmail}}</itunes:email>
    </itunes:owner>--}}
    <itunes:image href="{{channelImageUrl}}" />
    {{!--<itunes:category text="{{channelCategory}}"/>--}}
    {{#each items}}
        <item>
        <title>{{itemTitle}}</title>
        {{!--<itunes:author>{{itemAuthor}}</itunes:author>--}}
        {{!--<itunes:subtitle>{{itemSubtitle}}</itunes:subtitle>--}}
        {{!--<itunes:summary>{{itemSummary}}</itunes:summary>--}}
        {{!--<itunes:image href="{{itemImageUrl}}" />--}}
        {{!--<enclosure url="{{itemEnclosureUrl}}" length="{{itemEnclosureLength}}" type="{{itemEnclosureType}}"/>--}}
        <enclosure url="{{itemEnclosureUrl}}" type="{{itemEnclosureType}}"/>
        <guid>{{itemGuid}}</guid>
        <pubDate>{{itemPubDate}}</pubDate>
        {{!--<itunes:duration>{{itemDuration}}</itunes:duration>--}}
        </item>
    {{/each}}
    </channel>
</rss>`);

const importEntries = () => {
    return require('./ReadScripture.json');
};

const readScriptureXmlGenerator = () => {
    const context = {};
    
    context.channelTitle = 'Read Scripture';
    context.channelLink = 'http://thebibleproject.tumblr.com/readscripture';
    context.channelAuthor = 'The Bible Project';
    context.channelImageUrl = 'https://apkplz.com/storage/images/com/youmeforever/readscripture/300/read-scripture.png';
    
    const filteredEntries = importEntries().filter((entry) => {
        const date = momentWithTimezone(entry.date);
        return date.isBefore();
    });

    context.items = filteredEntries.map((entry) => {
        const date = momentWithTimezone(entry.date),
            itemUrl = 'https://f001.backblazeb2.com/file/ReadScripture/' + entry.file.split(' ').join('+');

        return {
            itemTitle: entry.title,
            itemEnclosureUrl: encodeURI(itemUrl),
            itemEnclosureType: 'audio/mpeg',
            itemGuid: date.format('ddd, DD MMM YYYY HH:mm:ss z'),
            itemPubDate: date.format('ddd, DD MMM YYYY HH:mm:ss z')
        };
    });

    const xml = feedTemplate(context);

    return xml;
};

const momentWithTimezone = (...args) => {
    args.push('Australia/Sydney');
    return moment.tz.apply(this, args);
};

module.exports = readScriptureXmlGenerator;