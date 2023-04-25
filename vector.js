const {
  getUserData
} = require('./fetch');
const SteamAPI = require('steamapi');
const fs = require('fs');
const API_KEY = require('./config.json').key;
const steam = new SteamAPI(API_KEY);
const {
  spawn
} = require('child_process');

if (process.argv.length < 3) {
  console.error('Please provide a user ID as an argument.');
  process.exit(1);
}

const uid = process.argv[2];

async function getGameName(gameId) {
  try {
    const game = await steam.getGameSchema(gameId);
    return game.gameName;
  } catch (error) {
    console.error(`Error fetching game name for game ID ${gameId}:`, error);
    return null;
  }
}


async function main() {
  const userObj = await getUserData(uid);

  if (userObj) {
    const rawData = fs.readFileSync('clustered_data_formatted.json');
    const data = JSON.parse(rawData);

    let clusterCounts = {
      0: 0,
      1: 0,
      2: 0
    };
    let gameIds = [];

    for (const gameId in userObj[uid]) {
      gameIds.push(gameId);
    }

    for (const key in data) {
      const game = data[key];
      if (gameIds.includes(game.id)) {
        clusterCounts[game.cluster]++;
      }
    }

    const magnitude = Math.sqrt(
      clusterCounts[0] ** 2 +
      clusterCounts[1] ** 2 +
      clusterCounts[2] ** 2
    );

    const unitVector = [
      clusterCounts[0] / magnitude,
      clusterCounts[1] / magnitude,
      clusterCounts[2] / magnitude
    ];

    // Call the Python script
    const pythonProcess = spawn('python3', ['vector_processing.py', ...unitVector]);

    pythonProcess.stdout.on('data', async (data) => {
      console.log(`Python output: ${data}`);
      const result = JSON.parse(data);

      const most_similar_user = result.most_similar_user;
      const max_similarity = result.max_similarity;

      // Get game IDs of most_similar_user
      const mostSimilarUserObj = await getUserData(most_similar_user);
      let mostSimilarUserGameIds = [];

      for (const gameId in mostSimilarUserObj[most_similar_user]) {
        mostSimilarUserGameIds.push(gameId);
      }

      // Print game IDs of both users
      console.log(`Game IDs of target user (${uid}):`, gameIds);
      console.log(`Game IDs of most similar user (${most_similar_user}):`, mostSimilarUserGameIds);

      // Load ratings from output.json
      const outputData = JSON.parse(fs.readFileSync('./output.json', 'utf-8'));

      // Find games that most_similar_user owns but target user does not own
      const uniqueGames = mostSimilarUserGameIds.filter((gameId) => !gameIds.includes(gameId));

      // Filter out games with missing or null ratings
      const uniqueGamesWithRatings = uniqueGames.filter((gameId) => outputData[gameId] && outputData[gameId].rate !== null);

      // Sort unique games by their ratings
      const sortedUniqueGames = uniqueGamesWithRatings.sort((a, b) => {
        const ratingA = outputData[a].rate;
        const ratingB = outputData[b].rate;
        return ratingB - ratingA; // Sort in descending order
      });

      // Get top 5 highest-rated games
      const top5Games = sortedUniqueGames.slice(0, 5);

      console.log(JSON.stringify(top5Games));
      const top5GamesObj = {};
      const fetchGameNamesPromises = [];

      for (const gameId of top5Games) {
        fetchGameNamesPromises.push(
          getGameName(gameId).then((gameName) => {
            if (gameName) {
              top5GamesObj[gameId] = gameName;
            }
          })
        );
      }

      Promise.all(fetchGameNamesPromises).then(() => {
        // Write the result object to the output file
        fs.writeFile('top5Games.json', JSON.stringify(top5GamesObj, null, 2), (err) => {
          if (err) {
            console.error('Error writing output file:', err);
          } else {
            console.log('Output file written successfully');
          }
        });
      });
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      console.log(`Python process exited with code ${code}`);
    });
  } else {
    console.log(`User ID ${uid} not found.`);
  }
}

main();