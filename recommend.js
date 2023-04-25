const SteamAPI = require('steamapi');
const fs = require('fs');
const API_KEY = require('./config.json').key;
const steam = new SteamAPI(API_KEY);

const useruuid = 76561198350153786;

// Get most_similar_user and max_similarity from command-line arguments
const most_similar_user = process.argv[2];
const max_similarity = parseFloat(process.argv[3]);

async function getUnownedGames(user1, user2) {
  // Read and parse data.json
  const userData = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

  // Get game data for both users
  const user1Data = userData[user1];
  const user2Data = userData[user2];

  const user1Games = new Set(Object.keys(user1Data));
  const user2Games = Object.keys(user2Data);

  const unownedGames = user2Games.filter((game) => !user1Games.has(game));
  return unownedGames;
}

async function recommendTopGames(useruuid, most_similar_user) {
  const unownedGames = await getUnownedGames(useruuid, most_similar_user);

  // Read and parse output.json
  const gameRatings = JSON.parse(fs.readFileSync('./output.json', 'utf8'));

  // Filter game ratings to include only unowned games
  const unownedGameRatings = unownedGames
    .map((gameId) => gameRatings[gameId])
    .filter((rating) => rating);

  // Sort game ratings by rate in descending order and pick top 5
  const topGames = unownedGameRatings
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 5)
    .map((game) => game.appID);

  console.log('Top 5 recommended games:', topGames);
}

recommendTopGames(useruuid, most_similar_user);
