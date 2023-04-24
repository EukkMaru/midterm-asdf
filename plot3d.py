import json
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

def plot_3d_vectors(user_data):
    fig = plt.figure()
    ax = fig.add_subplot(111, projection='3d')

    for uid, vector in user_data.items():
        if not all(coord is None for coord in vector):
            ax.plot([0, vector[0]], [0, vector[1]], [0, vector[2]])

    ax.set_xlabel('X')
    ax.set_ylabel('Y')
    ax.set_zlabel('Z')

    # Set the limits of the axes
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.set_zlim(0, 1)

    plt.show()

def main():
    # Load user data from population.json
    with open('population.json', 'r') as file:
        user_data = json.load(file)

    # Replace 'null' values with 'None'
    user_data = {uid: [None if coord is None else float(coord) for coord in vector] for uid, vector in user_data.items()}

    plot_3d_vectors(user_data)

if __name__ == '__main__':
    main()
