import sys
import numpy as np
from numpy import dot #https://wikidocs.net/24603
from numpy.linalg import norm

def cos_sim(A, B):
  return dot(A, B)/(norm(A)*norm(B))

#subject initialization: 비교 대상들을 담아둘 딕셔너리 초기화 / 비교 대상 벡터들의 크기를 'vectorsize'로 지정
def subinit(vectorsize: int):
    global subject #딕셔너리
    global vsize #벡터들의 크기
    err1 = 'subinit error: vector size is not natural number'
    subject = {}
    try:
        if (vectorsize > 0 and float(vectorsize) % 1 == 0):
            vsize = int(vectorsize)
            return 1
        else:
            print(err1)
            return -1
    except:
        print(err1)
        return -2

#add subject: 이름이 'name'인 'array'를 비교 대상에 추가
def subadd(name: str, array):
    global subject
    global vsize
    err1 = 'subadd error: initiation not done'
    err2 = 'subadd error: subject is not array'
    err3 = 'subadd error: array size has been set as ' + str(vsize)
    err4 = 'subadd error: duplicated name'
    try:
        if(array.size != vsize):
            print(err3)
            return -3
        if(name in subject):
            print(err4)
            return -4
        dict[name] = array
        return 1
    except:
        if(type(array) == type(np.array([]))):
            print(err1)
            return -1
        else:
            print(err2)
            return -2

#delete subject: 이름이 'name'인 'array'를 비교 대상에서 제거
def subdel(name: str):
    global subject
    err1 = 'subdel error: subject named with ' + str(name) + 'not exist'
    if(name in subject):
        del[name]
        return 1
    else:
        print(err1)
        return -1

#calculate cosine similarity: 'target'과 subject 내 모든 대상의 코사인 비교 후 상위 'count'개 출력
def subcos(target, count = 1):
    global subject
    global vsize
    err1 = 'subcos error: initiation not done'
    err2 = 'subcos error: target is not array'
    err3 = 'subcos error: array size has been set as ' + str(vsize)
    err4 = 'subcos error: count is not natural number'
    try:
        if(target.size != vsize):
            print(err3)
            return -3
        if (count > 0 and float(count) % 1 == 0):
            cosdict = {}
            for key, value in subject.items():
                cosdict[key] = cos_sim(target, value)
            cossort = sorted(cosdict.items(), key=lambda x: x[1], reverse=True) #https://korbillgates.tistory.com/171
            returnlist = []
            for i in range(count):
                returnlist.append(eval('cossort[' + str(i) + '][0]'))
            return returnlist
        else:
            print(err4)
            return -1
    except:
        if(type(target) == type(np.array([]))):
            print(err2)
            return -2
        else:
            print(err1)
            return -1


def main():
    unit_vector = [float(x) for x in sys.argv[1:]]

    # Process the unit vector
    print('Received unit vector in Python:', unit_vector)

if __name__ == '__main__':
    main()
