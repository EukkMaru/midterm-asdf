const SteamAPI = require('steamapi');
const fs = require('fs');
const API_KEY = require('./config.json').key;
const steam = new SteamAPI(API_KEY);
let outputfile = JSON.parse(fs.readFileSync('output.json', 'utf8'));

// Read the JSON file
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

let output = outputfile ? outputfile : {};

async function processGames() {
  for (const uid in data) {
    console.log(`Processing games for user ${uid}`);
    for (const appid in data[uid]) {
      if (!output.hasOwnProperty(appid)) {
        console.log(`Fetching game details and achievements for appid ${appid}`);
        try {
          const gameDetails = await getGameDetails(appid);
          if (gameDetails.metacritic) {
            const gameAchievements = await steam.getGameAchievements(appid);

            console.log(`Game achievements for appid ${appid}:`, gameAchievements);
            const totalAchievementRate = calculateAchievementRate(gameAchievements);
            const recommendations = gameDetails.metacritic.score;

            output[appid] = {
              rate: recommendations,
              achievement: totalAchievementRate,
            };

            console.log(`Writing output for appid ${appid}:`, output[appid]);
            // Write JSON file in real-time
            fs.writeFileSync('output.json', JSON.stringify(output, null, 2));
          } else {
            console.log(`No metacritic score found for appid ${appid}, skipping.`);
          }
        } catch (error) {
          console.error(`Error processing appid ${appid}:`, error.message);
        }
      }
    }
  }
}

function getGameDetails(appid) {
  console.log(`Fetching game details for appid ${appid}`);
  return steam.getGameDetails(appid);
}

function calculateAchievementRate(gameAchievements) {
  let totalRate = 0;
  let count = 0;

  for (const achievement in gameAchievements) {
    totalRate += gameAchievements[achievement];
    count++;
  }

  return count > 0 ? totalRate / count : 0;
}

processGames();
