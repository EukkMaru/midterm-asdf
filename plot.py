import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.cluster import spectral_clustering
from sklearn.metrics.pairwise import rbf_kernel
from sklearn.preprocessing import StandardScaler
import json
import math

class Dataset:
    def __init__(self, data, target, feature_names, target_names, frame):
        self.data = data
        self.target = target
        self.feature_names = feature_names
        self.target_names = target_names
        self.frame = frame

with open('./output.json') as file:
    data = json.load(file)

# Filter out entries with None or NaN values
filtered_data = {k: v for k, v in data.items() if v["rate"] is not None and not math.isnan(v["rate"]) and v["achievement"] is not None and not math.isnan(v["achievement"])}

ids = list(filtered_data.keys())
rates = [game["rate"] for game in filtered_data.values()]
achievements = [game["achievement"] for game in filtered_data.values()]

df = pd.DataFrame({"id": ids, "rate": rates, "achievement": achievements})

dataset = Dataset(
    data=df[['rate']].values,
    target=df['achievement'].values,
    feature_names=['rate'],
    target_names=['achievement'],
    frame=df
)

scaler = StandardScaler()
data_normalized = scaler.fit_transform(dataset.data)

# Compute the RBF kernel
gamma = 0.0008
kernel_matrix = rbf_kernel(data_normalized, gamma=gamma)

# Apply spectral clustering
n_clusters = 3
labels = spectral_clustering(kernel_matrix, n_clusters=n_clusters, random_state=42, assign_labels='discretize')

# Plot the results
colors = ['b', 'g', 'r', 'c', 'm', 'y', 'k', 'w']

for cluster, color in zip(range(n_clusters), colors):
    # Get data points that fall in this cluster
    index = np.where(labels == cluster)
    # Make the plot
    plt.scatter(dataset.target[index], dataset.data[index], c=color, label=f'Cluster {cluster}')

plt.xlabel('Achievement')
plt.ylabel('Rate')
plt.title('Spectral Clustering with RBF Kernel')
plt.legend()
plt.show()

df['cluster'] = labels

# Convert the DataFrame to a JSON object
json_data = df.to_dict(orient='index')

# Save the JSON object to a file
with open('clustered_data_formatted.json', 'w') as outfile:
    json.dump(json_data, outfile, indent=4)
