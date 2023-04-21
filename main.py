import os
import subprocess
import json
import time

data = None

with open('dataSub.json') as file:
    data = json.load(file)

index = 0

def fetch(uid, index = index):
    print(f"Fetching {uid}")
    process = subprocess.Popen(['node', 'fetch.js', uid], stdout=None, stderr=None)
    exit_code = process.wait()
    print(f"Exit code {exit_code} for {uid}")
    index += 1
    time.sleep(5)
    if exit_code == 0:
        fetch(data["target"][index], index)
    else:
        print("Error")
        quit()
    

fetch(data["target"][0])


