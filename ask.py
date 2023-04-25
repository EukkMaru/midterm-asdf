import json
import subprocess
import os

node_script = "vector.js"
uid = input('Please enter your SteamID(Dec): ')
output_file = "top5games.json"

process = subprocess.run(["node", node_script, uid], stdout=subprocess.PIPE, text=True, stderr=subprocess.DEVNULL)

with open(output_file, "r") as f:
    top5_games = json.load(f)

print("Your game recommendations:")

for index, (game_id, game_name) in enumerate(top5_games.items(), start=1):
    print(f"{index}. {game_name} - https://store.steampowered.com/app/{game_id}")
