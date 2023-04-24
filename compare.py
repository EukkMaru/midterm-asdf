def count (user_game):
    count_cluster = [0 for i in range(max(user_game))]
    for i in range(len(user_game)):
        for j in range(max(user_game)+1):
            if user_game[i-1] == j:
                count_cluster[j-1] += 1
    return count_cluster

def user_vector (count_cluster):
    total = sum(count_cluster)
    cluster_ratio = [0 for i in range(len(count_cluster))]
    for i in range(len(count_cluster)):
        cluster_ratio[i-1] = count_cluster[i-1]/total
    return cluster_ratio

count_cluster = count(user_game)
cluster_ratio = user_vector(count_cluster)