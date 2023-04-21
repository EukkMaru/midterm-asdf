const SteamAPI = require('steamapi');
const fs = require('fs');
const API_KEY = require('./config.json').key;
const steam = new SteamAPI(API_KEY);

steam.getAppList().then(games => {
    const filteredGames = games.filter(game => game.appid < 10000000);
    fs.writeFileSync('defaultGameList.json', JSON.stringify(filteredGames, null, 2));
});