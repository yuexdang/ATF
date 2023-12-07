var Nid = 0;
var startTime;
var readTime;
var [Aid, ImageInfo, Question, Answer, last, waitTime] = document.getElementById("title").innerText.split(";");

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

function toggleDivVisibility() {
    // 获取 QA、sight 和 choice 的 div 元素
    var qaDiv = document.getElementById('QA');
    var sightDiv = document.getElementById('sight');
    var choiceDiv = document.getElementById('choice');

    // 将 QA 设为不可见，sight 设为可见
    qaDiv.style.display = 'none';
    sightDiv.style.display = 'block';

    // 设置定时器，在1秒后切换可见性
    setTimeout(function() {
        // 将 sight 设为不可见，choice 设为可见
        sightDiv.style.display = 'none';
        choiceDiv.style.display = 'block';
        startTime = new Date();
        console.log(startTime)
    }, waitTime); // 时间单位为毫秒
}

// 绑定点击事件到按钮
var part1Button = document.getElementById('part1');
part1Button.addEventListener('click', toggleDivVisibility);


document.addEventListener("DOMContentLoaded", function() {
    var stopBool;

    // 记录页面加载时的时间
    document.body.onload = function() {
        readTime = new Date();
        console.log(readTime)
        stopBool = false;


    };

    // 图片点击事件
    function picClick(Answer) {
        var endTime = new Date();
        var elapsedTime = (endTime - startTime) / 1000; // 消耗时间，单位秒

        // 准备要发送的数据
        var data = {
            "Qt": Aid,
            "time": elapsedTime,
            "answer": Answer,
        };

        // 发送数据到指定的URL
        if (!stopBool) {
            sendDataToServer(data);
        }
        stopBool = true;
    }

    generateAndInsertHTML(ImageInfo);

    var picDivs = document.querySelectorAll('.PicDiv');

    // 为每个 PicDiv 元素添加点击事件监听器
    picDivs.forEach(function(div) {
        div.addEventListener('click', function() {
            // 在点击时获取 div 的 id
            var chooseID = div.id;

            var isRight = false;
            if (chooseID == Answer) { isRight = true; }
            picClick(isRight);
        });
    });
});


function sendDataToServer(data) {
    var url = "http://127.0.0.1:5000/dataF";

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
    location.reload();
}

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
        <div class="content-block float-content">
            <div class="PicDiv DivFlight D${ImgID * 4 - 3}" id="1">${Flight}</div>
            <div class="PicDiv DivOther D${ImgID * 4 - 2}" id="2">${Gate}</div>
            <div class="PicDiv DivOther D${ImgID * 4 - 1}" id="3">${Time}</div>
            <div class="PicDiv DivOther D${ImgID * 4}" id="4">${Seat}</div>

            <div class="PicDiv DivSmall Da" id="1">${Flight}</div>
            <div class="PicDiv DivOther Db" id="4">${Seat}</div>
            <div class="PicDiv DivSmall Dc" id="1">${Flight}</div>
            <div class="PicDiv DivOther Dd" id="4">${Seat}</div>
            <img src="static/pictures/${imgInfo}" class="img-fluid" alt="机票图">
        </div>
    `;

    // 插入到 id 为 "insert" 的 div 中
    document.getElementById('insert').innerHTML += generatedHTML;
}