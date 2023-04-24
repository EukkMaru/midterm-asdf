const SteamAPI = require('steamapi');
const fs = require('fs');
const API_KEY = require('./config.json').key;
const steam = new SteamAPI(API_KEY);

// Function to get user achievements for each game
async function getUserAchievements(uid, appID) {
  try {
    const achievements = await steam.getUserAchievements(uid, appID);
    return achievements;
  } catch (error) {
    console.error(`Error fetching achievements for appID ${appID}: ${error}`);
    if (error.toString().toLowerCase().includes('forbidden')) {
      return 'forbidden';
    }
    return null;
  }
}

// Calculate achievement clear rate
function calculateAchievementRate(achievements) {
  const totalAchievements = achievements.length;
  const completedAchievements = achievements.filter((achievement) => achievement.achieved).length;

  return (completedAchievements / totalAchievements) * 100;
}

async function getUserData(uid) {
  try {
    const stats = await steam.getUserOwnedGames(uid);

    const achievementsPromises = stats.map(async (game) => {
      const achievementsData = await getUserAchievements(uid, game.appID);
      if (!achievementsData || achievementsData === 'forbidden') {
        return null;
      }

      const rate = calculateAchievementRate(achievementsData.achievements);
      return {
        appID: game.appID,
        gameName: achievementsData.name,
        achievements: achievementsData.achievements,
        rate,
        playTime: game.playTime,
      };
    });

    const achievementsResults = await Promise.all(achievementsPromises);

    const achievementsByAppID = achievementsResults.reduce((acc, result) => {
      if (result) {
        acc[result.appID] = {
          steamID: uid,
          gameName: result.gameName,
          achievements: result.achievements,
          rate: result.rate,
          playTime: result.playTime,
        };
      }
      return acc;
    }, {});

    return { [uid]: achievementsByAppID };
  } catch (error) {
    console.error(`Error fetching user-owned games: ${error}`);
    return null;
  }
}

// Main function
async function main() {
  if (!process.argv[2]) {
    console.error('Error: No user ID provided');
    return;
  }

  try {
    const uid = process.argv[2];
    const newUserData = await getUserData(uid);

    // Read the existing data from the JSON file
    let existingData;
    try {
      existingData = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
    } catch (error) {
      console.log('Creating a new JSON file.');
      existingData = {};
    }

    // Update the existing data with the new user data
    const updatedData = {
      ...existingData,
      ...newUserData,
    };

    // Write the updated data to the JSON file
    fs.writeFileSync('./data.json', JSON.stringify(updatedData, null, 2));
  } catch (error) {
    console.error(`Error fetching user-owned games: ${error}`);
  }
}

main();

module.exports = {
  getUserData,
};