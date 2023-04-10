const SteamAPI = require('steamapi');
const fs = require('fs');
const API_KEY = require('./config.json').key;
const steam = new SteamAPI(API_KEY);

steam.getUserFriends('76561198350153786').then(list => {
    data = list.map(friend => friend.steamID);
    data.unshift('76561198350153786');
    fs.writeFileSync('./dataSub.json', JSON.stringify(data, null, 2));
});