# -*- coding: UTF-8 -*-

import json
import sys
import subprocess
from typing import List
from math import sqrt

def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    dot_product = sum(a * b for a, b in zip(vec1, vec2))
    magnitude = sqrt(sum(a * a for a in vec1)) * sqrt(sum(b * b for b in vec2))
    return dot_product / magnitude

def most_similar_vector(unit_vector: List[float], population_file: str) -> tuple:
    with open(population_file, 'r') as file:
        population = json.load(file)

    max_similarity = -1
    most_similar_user = None

    for user, vector in population.items():
        if vector.count(None) == 3:
            continue

        similarity = cosine_similarity(unit_vector, vector)
        if similarity > max_similarity:
            max_similarity = similarity
            most_similar_user = user

    return most_similar_user, max_similarity

unit_vector = [float(x) for x in sys.argv[1:]]
population_file = 'population.json'
most_similar_user, max_similarity = most_similar_vector(unit_vector, population_file)

subprocess.run(["node", "recommend.js", most_similar_user, str(max_similarity)])

# with open('./population.json') as file:
#     population = json.load(file)

# def cos_sim(A, B):
#   return dot(A, B)/(norm(A)*norm(B))

# #subject initialization: 비교 대상들을 담아둘 딕셔너리 초기화 / 비교 대상 벡터들의 크기를 'vectorsize'로 지정
# def subinit(vectorsize: int):
#     global subject #딕셔너리
#     global vsize #벡터들의 크기
#     err1 = 'subinit error: vector size is not natural number'
#     subject = {}
#     try:
#         if (vectorsize > 0 and float(vectorsize) % 1 == 0):
#             vsize = int(vectorsize)
#             return 1
#         else:
#             print(err1)
#             return -1
#     except:
#         print(err1)
#         return -2

# #add subject: 이름이 'name'인 'array'를 비교 대상에 추가
# def subadd(name: str, array):
#     global subject
#     global vsize
#     err1 = 'subadd error: initiation not done'
#     err2 = 'subadd error: subject is not array'
#     err3 = 'subadd error: array size has been set as ' + str(vsize)
#     err4 = 'subadd error: duplicated name'
#     try:
#         if(array.size != vsize):
#             print(err3)
#             return -3
#         if(name in subject):
#             print(err4)
#             return -4
#         dict[name] = array
#         return 1
#     except:
#         if(type(array) == type(np.array([]))):
#             print(err1)
#             return -1
#         else:
#             print(err2)
#             return -2

# #delete subject: 이름이 'name'인 'array'를 비교 대상에서 제거
# def subdel(name: str):
#     global subject
#     err1 = 'subdel error: subject named with ' + str(name) + 'not exist'
#     if(name in subject):
#         del[name]
#         return 1
#     else:
#         print(err1)
#         return -1

# #calculate cosine similarity: 'target'과 subject 내 모든 대상의 코사인 비교 후 상위 'count'개 출력
# def subcos(target, count = 1):
#     global subject
#     global vsize
#     err1 = 'subcos error: initiation not done'
#     err2 = 'subcos error: target is not array'
#     err3 = 'subcos error: array size has been set as ' + str(vsize)
#     err4 = 'subcos error: count is not natural number'
#     try:
#         if(target.size != vsize):
#             print(err3)
#             return -3
#         if (count > 0 and float(count) % 1 == 0):
#             cosdict = {}
#             for key, value in subject.items():
#                 cosdict[key] = cos_sim(target, value)
#             cossort = sorted(cosdict.items(), key=lambda x: x[1], reverse=True) #https://korbillgates.tistory.com/171
#             returnlist = []
#             for i in range(count):
#                 returnlist.append(eval('cossort[' + str(i) + '][0]'))
#             return returnlist
#         else:
#             print(err4)
#             return -1
#     except:
#         if(type(target) == type(np.array([]))):
#             print(err2)
#             return -2
#         else:
#             print(err1)
#             return -1


# def main():
#     unit_vector = [float(x) for x in sys.argv[1:]]

#     # Process the unit vector
#     subinit(3);
#     for key, value in population.items():
#         subadd(key, np.array(value))

#     sim = subcos(np.array(unit_vector), 1)
#     print(sim)

# if __name__ == '__main__':
#     main()
