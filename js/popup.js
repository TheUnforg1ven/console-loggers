import * as Emotes from './emotes.js'
import * as Channel  from './channel.js'

const userEmotes = ['https://api.betterttv.net/3/cached/frankerfacez/users/twitch/70075625'];
const channelEmotes = ['https://api.betterttv.net/3/cached/users/twitch/70075625'];

Channel.getChannelId()
        .then(value => console.log(value));

(function(userEmotes, channelEmotes) {
    const _privateLog = console.log;
    const _privateError = console.error;
    const _privateWarn = console.warn;
    const _privateInfo = console.info;
    const _privateGroup = console.group;

    Emotes.getEmotes(userEmotes, channelEmotes);

    console.log = (...args) => {
        const copy = [...args];
        Emotes.overrideConsole(copy, ...args);
        _privateLog.apply(console, copy);
    };

    console.error = (...args) => {
        const copy = [...args];
        Emotes.overrideConsole(copy, ...args);
        _privateError.apply(console, copy);
    };
  
    console.info = (...args) => {
        const copy = [...args];
        Emotes.overrideConsole(copy, ...args);
        _privateInfo.apply(console, copy);
     };

    console.warn = (...args) => {
        const copy = [...args];
        Emotes.overrideConsole(copy, ...args);
        _privateWarn.apply(console, copy);
    };

    console.group = (...args) => {
        const copy = [...args];
        Emotes.overrideConsole(copy, ...args);
        _privateGroup.apply(console, copy);
    };
})(userEmotes, channelEmotes);