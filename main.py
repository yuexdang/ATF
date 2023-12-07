from flask import Flask, render_template, request, abort, jsonify, redirect
from random import choice
from ast import literal_eval
from datetime import datetime

from utils import conf_handle, dataHash, data_handler, transUrl, png_files
from utils.utils import PicList, QTList, get_other_element

app = Flask(__name__, static_folder="static")

Pic_data = PicList()
Qt_data = QTList()

nowTest = 0

@app.route("/")
def Page_Main():
    global nowTest
    nowTest = 0 if nowTest >= 2 else nowTest

    return render_template("index.html", timerC = len(Pic_data), timerF = len(Qt_data),
                           dataC = len(data_handler.read_data(1)[1]), dataF = len(data_handler.read_data(2)[1]), showData = dataHash["showData"])

# 测试区域

@app.route("/ChoiceTest")
def Page_Choice():
    return render_template("ChoiceTest.html", choice = len(Pic_data), timer = dataHash["waitTime"], showData = dataHash["showData"])

@app.route("/FindTest")
def Page_Find():
    return render_template("FindTest.html", choice = len(Qt_data), timer = dataHash["waitTime"], showData = dataHash["showData"])


@app.route("/CTicket")
def Page_CTicket():
    if Pic_data:
        random_number = choice(list(Pic_data.keys()))
        random_tuple = Pic_data.get(random_number, (None, None))
        return render_template("CTicket.html", num = random_number, img = random_tuple, last = len(Pic_data), waitTime = dataHash["waitTime"], 
                               coordinates = dataHash["coordinates"], size = (dataHash["length"], dataHash["width"]))
    else:
        return redirect("./end&id=1")

@app.route("/FTicket")
def Page_FTicket():
    if Qt_data:
        random_number = choice(Qt_data)
        return render_template("FTicket.html", Qt = random_number, last = len(Qt_data), waitTime = dataHash["waitTime"], coordinates = dataHash["coordinates"], 
                               size = (dataHash["length"], dataHash["width"]))
    else:
        return redirect("./end&id=2")


@app.route("/end&id=<int:id>")
def Page_End(id):
    global nowTest
    nowTest += 1
    return render_template("end.html", id=id, showNext = nowTest, canExit = dataHash["showData"])


@app.route("/refresh&id=<int:id>")
def Component_End(id):
    global Pic_data, Qt_data

    if id == 1:
        Pic_data = PicList()
    else:
        Qt_data = QTList()

    return jsonify("success"), 200

@app.route("/dataC", methods=['POST'])
def Component_DataC():
    global Pic_data
    if request.method == 'POST':
        try:
            data = request.get_json()
            Did = int(data.get("id", None))
            Dtime = data.get("time", None)
            Dpic = data.get("pic", None)
            current_time = datetime.now().strftime("%Y%m%d_%H%M")

            if Did in Pic_data:
                oddDpic = get_other_element(Pic_data[Did], Dpic)
                del Pic_data[Did]
                print("已删除")

                data_handler.add_data(sheet_name="Choice", data={"机票代码": Dpic, "选择时间(s)": Dtime, "对比机票代号": "对照机票:"+oddDpic, "测试时间":current_time})

            else:
                return jsonify({"error": "我只是写了这种错误，理论上触发不了，你能把这个触发了我只能说牛批。重启试试吧"}), 500

            return jsonify("success"), 200

        except Exception as e:
            print("Error:", str(e))
            return jsonify({"error": "代码出问题了"}), 500
    return "无效访问"


@app.route("/dataF", methods=['POST'])
def Component_DataF():
    global Qt_data
    if request.method == 'POST':
        try:
            data = request.get_json()
            DQt = literal_eval(data.get("Qt", None))
            Dtime = data.get("time", None)
            DBool = data.get("answer", None)
            current_time = datetime.now().strftime("%Y%m%d_%H%M")

            if DQt in Qt_data:
                Qt_data.remove(DQt)
                print("已删除")

                data_handler.add_data(sheet_name="Finder", data={"机票代号": DQt[0], "题目": DQt[1][0], "选择时间(s)": Dtime, "正确情况": DBool, "测试时间":current_time})

            else:
                return jsonify({"error": "我只是写了这种错误，理论上触发不了，你能把这个触发了我只能说牛批。重启试试吧"}), 500

            return jsonify("success"), 200

        except Exception as e:
            print("Error:", str(e))
            return jsonify({"error": "代码出问题了"}), 500
    return jsonify("无效访问"), 500

# 统计区域

@app.route("/DataSet&id=<int:id>")
def Page_DataSet(id):
    if dataHash["showData"] != "1":
        return jsonify("无效访问"), 500
    
    data = data_handler.read_data(id)
    return render_template("DataSet.html", data = data, id = id)

@app.route("/Settings")
def Page_Settings():
    # 抽离坐标
    FloatDic = {}
    StaticDic = {}

    for n, (k, v) in enumerate(dataHash["coordinates"].items()):
        if n >= 4:
            FloatDic[int(k[1:])] = (v["left"][:-2], v["top"][:-2])
        else:
            StaticDic[k[1:]] = (v["left"][:-2], v["top"][:-2])

    return render_template("Setting.html", time = dataHash["waitTime"], dataPath = transUrl(dataHash["data_path"]), dataName = dataHash["file_name"], 
                           staticPath = transUrl(dataHash["folder_path"]), length = dataHash["length"], width = dataHash["width"],
                           answerList = list(dataHash["answerList"].keys()), locateList = (FloatDic, StaticDic), picNum = png_files,
                           showData = dataHash["showData"])


@app.route("/Accuracy")
def Page_Accuracy():
    if dataHash["showData"] != "1":
        return jsonify("无效访问"), 500
    
    current_time = datetime.now().strftime("%Y/%m/%d %H:%M")
    data = data_handler.counter_data(2)
    sumTime = 0
    sumData = 0
    _Hash = []

    for key in sorted(list(data["机票代号"].keys())):
        _dN = data["机票代号"][key]
        _tN = round(data["选择时间(s)"][key], 2)
        _pN = data["正确情况"][key]
        _Hash.append([key, [_dN, _tN, _pN]])

        sumData = sumData + _dN
        sumTime = sumTime + _tN

    return render_template("Accuracy.html", DataTime = current_time, DataNum = sumData, Hash = _Hash, sumTime = sumTime)


@app.route("/Set",methods=['POST'])
def Component_Set():
    
    if request.method == 'POST':
        data = request.get_json()
        old, new = tuple(data.items())[0]

        if ">D" in old:
            number , opt = old.replace(">D","").split(":")
            _locate = dataHash["coordinates"][f"D{number}"]
            if opt == "L":
                _locate["left"] = new + "em"
            else:
                _locate["top"] = new + "em"

            __copyHash = dataHash["coordinates"]
            __copyHash[f"D{number}"] = _locate
            
            conf_handle.write_conf("coordinates", __copyHash)
        
        else: 
            conf_handle.write_conf(old, new)
        
        return jsonify("success"), 200

# @app.route("/Clear&id=<int:id>")
# def Component_Clear(id):
#     data_handler.del_data(id)

#     return jsonify("success"), 200

if __name__ == "__main__":

    from webbrowser import open
    open("http://127.0.0.1:5000/")

    app.run(port=5000)
