from .setting import JsonHandle

print("配置文档加载中...")
conf_handle = JsonHandle('conf.json')

dataHash = conf_handle.dataHash
transUrl = conf_handle.transUrl

print("数据抓手加载中...")
from .dataOperation import DataHandle
data_handler = DataHandle(save_path=dataHash["data_path"], file_name=dataHash["file_name"])
data_handler.mk_data_set()

print("核对校验配置文件...")
from .utils import png_files

picNum = len(png_files)
if (picNum + 1) * 4 > len(dataHash["coordinates"]):
    # 此时图片有新增，数据表未加载相对应的尺寸，为其配置数据
    lastNum = int(list(dataHash["coordinates"].keys())[-1][1:])

    outerNum = int (picNum + 1 - (len(dataHash["coordinates"])//4))
    copyHash = dataHash["coordinates"]
    for _n in range(outerNum):
        for __n in range(4):
            copyHash[f"D{lastNum + (_n * 4) + __n + 1}"] = {"left": "0em","top": "0em"}
    conf_handle.write_conf("coordinates", copyHash)

    dataHash = copyHash

else:
    pass

print("预前数据已处理完毕！")
