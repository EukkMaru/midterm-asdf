const SteamAPI = require('steamapi');
const fs = require('fs');
const API_KEY = require('./config.json').key;
const steam = new SteamAPI(API_KEY);
const useruuid = 76561198350153786;

steam.getGameSchema('1794680').then((game) => {
    console.log(game);
    });