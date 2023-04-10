const SteamAPI = require('steamapi');
const fs = require('fs');
const API_KEY = require('./config.json').key;
const steam = new SteamAPI(API_KEY);

// Sleep function to add delay
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to get user achievements for each game
async function getUserAchievements(uid, appID) {
  try {
    const achievements = await steam.getUserAchievements(uid, appID);
    return achievements;
  } catch (error) {
    console.error(`Error fetching achievements for appID ${appID}: ${error}`);
    return null;
  }
}

// Calculate achievement clear rate
function calculateAchievementRate(achievements) {
  const totalAchievements = achievements.length;
  const completedAchievements = achievements.filter((achievement) => achievement.achieved).length;

  return (completedAchievements / totalAchievements) * 100;
}

// Main function for a single user
async function fetchUserData(uid) {
  try {
    const stats = await steam.getUserOwnedGames(uid);

    const achievementsPromises = stats.map(async (game) => {
      const achievementsData = await getUserAchievements(uid, game.appID);
      if (!achievementsData) {
        return null;
      }

      const rate = calculateAchievementRate(achievementsData.achievements);
      return { appID: game.appID, gameName: achievementsData.name, achievements: achievementsData.achievements, rate };
    });

    const achievementsResults = await Promise.all(achievementsPromises);

    const achievementsByAppID = achievementsResults.reduce((acc, result) => {
      if (result) {
        acc[result.appID] = {
          steamID: uid,
          gameName: result.gameName,
          achievements: result.achievements,
          rate: result.rate,
        };
      }
      return acc;
    }, {});

    return achievementsByAppID;
  } catch (error) {
    console.error(`Error fetching user-owned games for user ${uid}: ${error}`);
    return null;
  }
}

// Main function for multiple users
async function main(target) {
  const combinedData = {};

  for (const uid of target) {
    const userData = await fetchUserData(uid);

    if (userData && Object.keys(userData).length > 0) {
      combinedData[uid] = userData;
    }

    console.log(`Fetched data for user ${uid}. Waiting 30 seconds before the next user...`);
    await sleep(30000); // Wait for 30 seconds
  }

  fs.writeFileSync('./data.json', JSON.stringify(combinedData, null, 2));
}


// Define an array of target user IDs
const target = [
  "76561198350153786",
  "76561198001031145",
  "76561198006491028",
  "76561198012473508",
  "76561198014253216",
  "76561198018718868",
  "76561198058382010",
  "76561198058644013",
  "76561198088888036",
  "76561198101843631",
  "76561198108523836",
  "76561198127149016",
  "76561198157220470",
  "76561198211316659",
  "76561198215835045",
  "76561198223818352",
  "76561198239930982",
  "76561198255693019",
  "76561198262376179",
  "76561198262385168",
  "76561198273070107",
  "76561198276777475",
  "76561198277759043",
  "76561198283160889",
  "76561198290130012",
  "76561198299158002",
  "76561198306088299",
  "76561198310106005",
  "76561198323913943",
  "76561198335175480",
  "76561198339074177",
  "76561198346059346",
  "76561198347834057",
  "76561198349886578",
  "76561198351930240",
  "76561198354699040",
  "76561198356149983",
  "76561198356778481",
  "76561198358678402",
  "76561198372655802",
  "76561198384941838",
  "76561198386682107",
  "76561198392968781",
  "76561198395973611",
  "76561198411348257",
  "76561198412808898",
  "76561198415484202",
  "76561198418794719",
  "76561198425283135",
  "76561198427327456",
  "76561198428908713",
  "76561198435186506",
  "76561198446573244",
  "76561198450643192",
  "76561198744607024",
  "76561198801129332",
  "76561198813356705",
  "76561198822197512",
  "76561198823304131",
  "76561198834238414",
  "76561198834645524",
  "76561198834779434",
  "76561198853439964",
  "76561198878676343",
  "76561198899816318",
  "76561198903545089",
  "76561198911260973",
  "76561199000979645",
  "76561199001076921",
  "76561199024315062",
  "76561199027531540",
  "76561199033735281",
  "76561199035776090",
  "76561199048713474",
  "76561199054835434",
  "76561199060942714",
  "76561199070443885",
  "76561199094920325",
  "76561199098943482",
  "76561199101129937",
  "76561199148446259",
  "76561199176313954",
  "76561199205296302",
  "76561199229065397"
]; 

main(target);
