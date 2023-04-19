def classfy (data, user):
    data_dic = {}
    data_ta = ["rate", "playTime"]
    for n in data_ta:
        data_dic[n] = data.get(n)

    user_dic = {}
    user_ta = ["rate", "playTime"]
    for n in user_ta:
        user_dic[n] = user.get(n)
    return data_dic, user_dic

def compare (data_dic, user_dic):
    data_score = {}
    score_sum = {}
    k = 1000
    k_add = 0.2
    t_max = 0
    t = 0
    a = 0
    for value in user_dic.items():
        if user_dic["playTime"] == 0:
            data_score[value] = 0
        else :
            if data_dic["playTime"] > user_dic["playTime"]:
                t_max = data_dic["playTime"]
            else :
                t_max = user_dic["playTime"]
                if(data_dic["playTime"]>k and user_dic["playTime"]>k):
                    t_plus = k_add
                else :
                    t_plus = 0
            t = ((1-abs(data_dic["playTime"] - user_dic["playTime"])/t_max) + t_plus) / (1 + t_plus)
            a = 1 - abs(data_dic["rate"] - user_dic["rate"])
            data_score[value] = t + a
    for value in user_dic.items():
        score_sum[value] = score_sum + data_score
    return score_sum

def select (score_sum, data):
    mscore = max(score_sum)
    max_data = None
    for key, value in data.item:
        if value == mscore:
            max_data = key
    return max_data

data = {}
user = {}
data_dic, user_dic = classfy(data, user)
score_sum = compare(data_dic, user_dic)
max_data = select(score_sum, data)
max_ID = max_data.get("steamID")