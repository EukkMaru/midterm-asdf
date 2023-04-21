import matplotlib.pyplot as plt
import numpy as np
from sklearn import datasets, linear_model
from sklearn.metrics import mean_squared_error, r2_score
import json

with open('./output.json') as file:
    data = json.load(file)

rates = [game["rate"] for game in data.values()]
achievements = [game["achievement"] for game in data.values()]

plt.scatter(achievements, rates, color='black')

plt.xlabel("Achievements")
plt.ylabel("Rate")
plt.title("Dft_plt")

plt.show()