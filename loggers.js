const userEmotes = ['https://api.betterttv.net/3/cached/frankerfacez/users/twitch/70075625'];
const channelEmotes = ['https://api.betterttv.net/3/cached/users/twitch/70075625'];

const _emoteLibrary = {};
const _scale = '1x';
const _promises = [];
const _fullData = {};
 
let emotesId = [];
let regexArr = [];
let defaultRegex = /.*/;

function getEmotes(userEmotes, channelEmotes, callback = () => 0) {
    userEmotes.forEach(url => {
        window.fetch(url)
            .then(bttvResponse => bttvResponse.json())
            .then(emotesData =>
                emotesData.forEach(emote => {
                    const image = new Image();

                    _fullData[emote.code] = {
                        width: 0,
                        height: 0,
                        src: emote.images[_scale],
                    };

                    const currentObj = _fullData[emote.code];
                    image.src = emote.images[_scale];

                    _promises.push(new Promise(resolve => {
                        image.onload = function () {
                            currentObj.width = this.width;
                            currentObj.height = this.height;
                            resolve();
                        };
                    }))
                }, {})
            ).then(() => {
                channelEmotes.forEach(url => {
                    window.fetch(url)
                        .then(bttvResponse => bttvResponse.json())
                        .then(({ channelEmotes = [], sharedEmotes = [] }) => {
                            const fullEmotes = [...channelEmotes, ...sharedEmotes].map(({ code, id }) => ({
                                code,
                                url: `https://cdn.betterttv.net/emote/${id}/${_scale}`
                            }))

                            fullEmotes.forEach(emote => {
                                const image = new Image();
                                _fullData[emote.code] = {
                                    width: 0,
                                    height: 0,
                                    src: emote.url,
                                };

                                const currentObj = _fullData[emote.code];

                                image.src = emote.url;

                                _promises.push(new Promise(resolve => {
                                    image.onload = function () {
                                        currentObj.width = this.width;
                                        currentObj.height = this.height;
                                        resolve();
                                    };
                                }))
                            }, {})

                        }).then(() => {
                            Promise.all(_promises).then(() => {
                                Object.assign(_emoteLibrary, _fullData);
                                emotesId = Object.keys(_emoteLibrary);
                                regexArr = emotesId.map(key => new RegExp(`\\b${key}\\b`, 'g'))
                                defaultRegex = new RegExp(emotesId.map(x => `\\b${x}\\b`).join('|'), 'g')
                                callback();
                            })
                        })
                });
            })
    });
}

function ifElementExist(element) {
    var splitedArray = element.split(" ");

    for (const [key] of Object.entries(_fullData)) {
        for(const elem of splitedArray) {
            if(elem === key)
              return true;
        }
    }

    return false;
}

function overrideConsole(copy, ...args){
    for (let index = 0; index < args.length; index++) {
        const element = args[index];
        if (typeof element === 'string' && ifElementExist(element)) {

            let elems = [];
            regexArr.forEach(regex => {
                const oc = element.match(regex);
                if (oc) {
                    elems.push(...oc)
                }
            });

            const result = elems.map(emoteKey => {
                const { height, src } = _emoteLibrary[emoteKey];

                return `background: url(${src}); line-height: ${height}px; background-repeat: no-repeat; font-size: 2px`
            });


            const insertPos = index + 1;
            if (insertPos > copy.length) {
                copy.push(...result)
            } else {
                copy.splice(insertPos, 0, ...result);
            }

            const newString = element.replace(defaultRegex, emoteKey => {
                const { width } = _emoteLibrary[emoteKey];
                return `%c${' '.repeat(width)}`;
            })

            copy.splice(index, 1, newString)
        }
    }
}

(function(userEmotes, channelEmotes) {
    const _privateLog = console.log;
    const _privateError = console.error;
    const _privateWarn = console.warn;
    const _privateInfo = console.info;

    getEmotes(userEmotes, channelEmotes);

    console.log = (...args) => {
        const copy = [...args];
        overrideConsole(copy, ...args);
        _privateLog.apply(console, copy);
    };

    console.error = (...args) => {
        const copy = [...args];
        overrideConsole(copy, ...args);
        _privateError.apply(console, copy);
    };
  
    console.info = (...args) => {
        const copy = [...args];
        overrideConsole(copy, ...args);
        _privateInfo.apply(console, copy);
     };

    console.warn = (...args) => {
        const copy = [...args];
        overrideConsole(copy, ...args);
        _privateWarn.apply(console, copy);
    };
})(userEmotes, channelEmotes);