const { getUserData } = require('./fetch');
const fs = require('fs');
const { spawn } = require('child_process');

if (process.argv.length < 3) {
  console.error('Please provide a user ID as an argument.');
  process.exit(1);
}

const uid = process.argv[2];

async function main() {
  const userObj = await getUserData(uid);

  if (userObj) {
    const rawData = fs.readFileSync('clustered_data_formatted.json');
    const data = JSON.parse(rawData);

    let clusterCounts = { 0: 0, 1: 0, 2: 0 };
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

    pythonProcess.stdout.on('data', (data) => {
      console.log(`Python output: ${data}`);
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
