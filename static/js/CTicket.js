var Nid = 0;
var [id, ImageInfo1, ImageInfo2, last, waitTime] = document.getElementById("title").innerText.split(":");

function convertStringToNumber(str) {
    // 使用parseInt将字符串转为数字
    var numberValue = parseInt(str, 10);
    // 如果parseInt返回NaN，可以根据实际情况处理
    // 乘以1000
    var multipliedValue = numberValue * 1000;
    // 使用Math.round取整
    var roundedValue = Math.round(multipliedValue);
    return roundedValue;
}

waitTime = convertStringToNumber(waitTime)

document.addEventListener("DOMContentLoaded", function() {
    var startTime;
    var stopBool;

    // 记录页面加载时的时间
    document.body.onload = function() {
        startTime = new Date();
        stopBool = false;


    };

    // 图片点击事件
    function picClick(event) {
        var endTime = new Date();
        var elapsedTime = (endTime - startTime) / 1000; // 消耗时间，单位秒

        // 获取点击图片的URL

        // 解析图片的名称
        var imageName = event.target.id;

        // 准备要发送的数据
        var data = {
            "id": id,
            "time": elapsedTime,
            "pic": imageName,
        };

        // 发送数据到指定的URL
        if (!stopBool) {
            sendDataToServer(data);
        }
        stopBool = true;
    }

    // 绑定按钮点击事件
    document.getElementById("i1").addEventListener("click", function(event) {
        picClick(event);
    });

    document.getElementById("i2").addEventListener("click", function(event) {
        picClick(event);
    });

});


function sendDataToServer(data) {
    var url = "http://127.0.0.1:5000/dataC";

    // 使用XMLHttpRequest发送数据
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    // 设置一个标志来追踪请求是否完成
    var requestCompleted = false;

    // 设置一个计时器，等待10秒
    var timeoutId = setTimeout(function() {
        // 如果在10秒内没有收到响应，取消请求并处理超时
        if (!requestCompleted) {
            xhr.abort(); // 取消请求
            alert("请求超时");
        }
    }, 10000); // 10秒

    // 设置请求完成的回调函数
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            // 请求完成，清除计时器
            clearTimeout(timeoutId);

            if (xhr.status === 200) {
                // 请求成功，处理响应
                var responseData = JSON.parse(xhr.responseText);
                handleResponse(responseData);
            } else {
                // 请求失败，处理错误
                alert("请求失败,已重置时间,请继续选择。\n状态码：" + xhr.status);
                startTime = new Date();
                stopBool = false;
            }

            // 标记请求已完成
            requestCompleted = true;
        }
    };

    // 发送请求
    xhr.send(JSON.stringify(data));
}

// 处理响应的函数
function handleResponse(responseData) {
    // 在这里处理服务器的响应数据
    console.log("收到服务器响应:", responseData);
    timerFunction();
}


function timerFunction() {
    // 获取 main 和 sight 的 div 元素
    var mainDiv = document.getElementById('choice');
    var sightDiv = document.getElementById('sight');

    // 修改 main 的样式
    mainDiv.style.display = 'none';

    // 清除 sight 的样式
    sightDiv.style = '';

    // 设置定时器，在1秒后恢复至最初状态
    setTimeout(function() { location.reload(); }, waitTime); // 时间单位为毫秒，这里设置为1秒
}

// 调用计时器函数



// 座位号后面的字母是ABCJKL
// 登机口就A或者B加一个数字

function generateAndInsertHTML(imgInfo) {

    // 抽取数字
    function getNumericSuffix(str) {
        // 添加条件检查，确保字符串不是 undefined 或 null
        if (str && typeof str === 'string') {
            str = str.split(".")[0]
                // 使用正则表达式匹配字符串末尾的数字部分
            var match = str.match(/\d+$/);

            // 如果找到匹配，则返回匹配的数字部分，否则返回 null
            return match ? parseInt(match[0], 10) : null;
        } else {
            return null;
        }
    }

    // 生成两个英文字母和四个数字
    function generateRandomString() {
        var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var randomLetters = '';
        for (var i = 0; i < 2; i++) {
            randomLetters += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        var randomNumber = Math.floor(1000 + Math.random() * 9000); // 生成四位随机数字
        return randomLetters + randomNumber;
    }

    // 生成A/B+两个随机数字
    function generateRandomAB() {
        var randomLetter = Math.random() < 0.5 ? 'A' : 'B';
        var randomNumber = Math.floor(1 + Math.random() * 2); // 生成1或2的随机数字
        return randomLetter + randomNumber;
    }

    // 生成四位的时间"时+分"
    function generateRandomTime() {
        var randomHour = Math.floor(Math.random() * 24);
        var randomMinute = Math.floor(Math.random() * 60);
        return randomHour.toString().padStart(2, '0') + randomMinute.toString().padStart(2, '0');
    }

    // 生成两位随机数字+A/B/C/J/K/L
    function generateRandomNumberAndLetter() {
        var randomNumber = Math.floor(10 + Math.random() * 90); // 生成10到99的随机数字
        var letters = 'ABCJKL';
        var randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
        return randomNumber + randomLetter;
    }

    // 生成要插入的 HTML 代码
    var Flight = generateRandomString();
    var Gate = generateRandomAB();
    var Time = generateRandomTime();
    var Seat = generateRandomNumberAndLetter();

    Nid = Nid + 1
    var ImgID = getNumericSuffix(imgInfo)
    var generatedHTML = `
        <div class="content-block float-content" id="i${Nid}" >
            <div class="PicDiv DivFlight D${ImgID * 4 - 3}" id="${imgInfo}">${Flight}</div>
            <div class="PicDiv DivOther D${ImgID * 4 - 2}" id="${imgInfo}">${Gate}</div>
            <div class="PicDiv DivOther D${ImgID * 4 - 1}" id="${imgInfo}">${Time}</div>
            <div class="PicDiv DivOther D${ImgID *4}" id="${imgInfo}">${Seat}</div>

            <div class="PicDiv DivSmall Da" id="${imgInfo}">${Flight}</div>
            <div class="PicDiv DivOther Db" id="${imgInfo}">${Seat}</div>
            <div class="PicDiv DivSmall Dc" id="${imgInfo}">${Flight}</div>
            <div class="PicDiv DivOther Dd" id="${imgInfo}">${Seat}</div>
            <img src="static/pictures/${imgInfo}" class="img-fluid" id="${imgInfo}" alt="机票图${Nid}">
        </div>
    `;

    // 插入到 id 为 "insert" 的 div 中
    document.getElementById('insert').innerHTML += generatedHTML;
}

// 调用函数生成并插入 HTML 代码
generateAndInsertHTML(ImageInfo1);
generateAndInsertHTML(ImageInfo2);