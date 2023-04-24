const fs = require('fs');
const data = require('./data.json');

const rawData = fs.readFileSync('clustered_data_formatted.json');
const clusteredData = JSON.parse(rawData);

function normalizeVector(clusterCounts) {
  const magnitude = Math.sqrt(
    clusterCounts[0] ** 2 +
    clusterCounts[1] ** 2 +
    clusterCounts[2] ** 2
  );

  return [
    clusterCounts[0] / magnitude,
    clusterCounts[1] / magnitude,
    clusterCounts[2] / magnitude
  ];
}

function main() {
  let population = {};

  for (const uid in data) {
    const userObj = data[uid];

    let clusterCounts = { 0: 0, 1: 0, 2: 0 };

    for (const gameId in userObj) {
      const game = Object.values(clusteredData).find((game) => game.id === gameId);
      if (game) {
        clusterCounts[game.cluster]++;
      }
    }

    const unitVector = normalizeVector(clusterCounts);
    population[uid] = unitVector;
  }

  fs.writeFileSync('population.json', JSON.stringify(population, null, 2));
}

main();
