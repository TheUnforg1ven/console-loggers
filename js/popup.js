import * as Emotes from './emotes.js'
import * as Channel  from './channel.js'

let userEmotes = ['https://api.betterttv.net/3/cached/frankerfacez/users/twitch/70075625'];
let channelEmotes = ['https://api.betterttv.net/3/cached/users/twitch/70075625'];

const list = document.getElementById("list");
const input = document.getElementById("input");

let tempList; 
let tempId;

let dataUE = localStorage.getItem("UElist");
let dataCE = localStorage.getItem("CElist");

// 'dataUE' change with 'userEmotes'
if (dataUE.length == 1) {
    tempList = [];
    tempId = 0;
    tempList.push({
        id: tempId,
        name: "SilverName",
        channelId: 70075625,
        trash: false
    });
    tempId++;
}

let dataT = localStorage.getItem("Tlist");

// 'dataUE' change with 'userEmotes'
if (dataUE.length == 1) {
    localStorage.setItem("UElist",  JSON.stringify(userEmotes));
    localStorage.setItem("CElist",  JSON.stringify(channelEmotes));
    localStorage.setItem("Tlist",  JSON.stringify(tempList));
}

dataUE = localStorage.getItem("UElist");
dataCE = localStorage.getItem("CElist");

userEmotes = JSON.parse(dataUE);
channelEmotes = JSON.parse(dataCE);

if (dataT) {
    tempList = JSON.parse(dataT);
    tempId = tempList.length;
    loadTlist(tempList);
}

function loadTlist(list) {
    list.forEach(element => {
        addChannelName(element.name, element.id, element.trash)
    });
}

function addChannelName(channelName, id, trash) {
    if (trash) return;

    const item = `
        <li class="item">
            <p class="text">${channelName}</p>
            <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
        </li>
                 `;
    const position = "beforeend";
    list.insertAdjacentHTML(position, item);
}

function removeChannel(element) {
    if (userEmotes.length > 1 && channelEmotes.length > 1) {
        element.parentNode.parentNode.removeChild(element.parentNode);
        userEmotes = userEmotes.filter(item => item != `https://api.betterttv.net/3/cached/frankerfacez/users/twitch/${tempList[element.id].channelId}`);
        channelEmotes = channelEmotes.filter(item => item != `https://api.betterttv.net/3/cached/users/twitch/${tempList[element.id].channelId}`);
        tempList[element.id].trash = true;

        localStorage.setItem("UElist",  JSON.stringify(userEmotes))
        localStorage.setItem("CElist",  JSON.stringify(channelEmotes))
        localStorage.setItem("Tlist",  JSON.stringify(tempList))
    }
    else {
        alert("There must be at least one channel in list")
    }
}

list.addEventListener("click", (event) => {
    const element = event.target;
    const elementJob = element.attributes.job.value;

    if (elementJob == "delete") {
        removeChannel(element);
    }
});


document.addEventListener("keyup", (event) => {
    if (event.key === 'Enter') {
        const elem = input.value;
        if (elem) {
            Channel.getChannelId(elem)
                .then(result => {
                    if (result != "No such streamer :C") {
                        addChannelName(elem, tempId, false);
                        userEmotes.push(`https://api.betterttv.net/3/cached/frankerfacez/users/twitch/${result}`);
                        channelEmotes.push(`https://api.betterttv.net/3/cached/users/twitch/${result}`);

                        localStorage.setItem("UElist",  JSON.stringify(userEmotes))
                        localStorage.setItem("CElist",  JSON.stringify(channelEmotes))

                        tempList.push({
                            id: tempId,
                            name: elem,
                            channelId: result,
                            trash: false
                        });
                        localStorage.setItem("Tlist",  JSON.stringify(tempList))
                        console.log(userEmotes);
                        console.log(channelEmotes);
                        tempId++;
                        document.location.reload();
                    }
                });
            
        }
        input.value = '';
    }
});


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