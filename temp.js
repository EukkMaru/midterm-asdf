const SteamAPI = require('steamapi');
const fs = require('fs');
const API_KEY = require('./config.json').key;
const steam = new SteamAPI(API_KEY);
const target = require('./dataSub.json').target[0];

steam.getUserOwnedGames(target).then(stats => {
    fs.writeFileSync('temp.json', JSON.stringify(stats, null, 2));
});