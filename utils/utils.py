import os
from itertools import permutations

from . import dataHash

# 元组取非
get_other_element = lambda tup, elem: tup[0] if tup[1] == elem else tup[1] if tup[0] == elem else None

png_files = [file for file in os.listdir(dataHash["folder_path"]) if file.endswith('.png')]

def PicList():
    combinations = {i+1:c for i,c in enumerate(list(permutations(png_files, 2)))}
    
    return combinations


def QTList():
    result = []

    for item in png_files:
    # 遍历字典的键值对
        for key, value in dataHash["answerList"].items():
            # 创建包含元组的列表，每个元组包含列表元素和与字典键值对组合的新字典
            result.append((item, [key, value]))
    return result

