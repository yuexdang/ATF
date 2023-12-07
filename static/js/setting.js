// 获取所有的 input 元素
const inputElements = document.querySelectorAll('input');

// 为每个 input 元素注册失去焦点事件监听器
inputElements.forEach(input => {
    let initialValue = input.value;
    input.addEventListener('blur', () => {
        // 检查内容是否改变
        if (input.value !== initialValue) {
            // 发送 POST 请求
            sendDataToServer(input.id, input.value);
            initialValue = input.value;
            showSavedNotification(input.id, input.value);
        }
    });
});

// 发送 POST 请求的函数
function sendDataToServer(id, content) {
    const url = "http://127.0.0.1:5000/Set";
    // 使用 Fetch API 发送 POST 请求
    fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                [id]: content
            })
        })
        .then(response => response.json())
        .then(data => {
            // 处理服务器响应
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function showSavedNotification(id, content) {
    const notificationDiv = document.createElement('div');
    notificationDiv.classList.add('notification');
    notificationDiv.textContent = `已保存：${id} = ${content}`;

    document.getElementById('main-content').appendChild(notificationDiv);

    // 触发浏览器的重绘以应用初始渐入效果
    void notificationDiv.offsetWidth;

    // 添加显示动画
    notificationDiv.classList.add('show');

    // 3秒后触发隐藏动画
    setTimeout(() => {
        notificationDiv.classList.remove('show');
        // 在动画结束后移除提示框
        setTimeout(() => {
            document.getElementById('main-content').removeChild(notificationDiv);
        }, 300);
    }, 3000);
}


// Function to open the lightbox with clicked image
function openLightbox(element) {
    // Find the nearest image within the clicked list-item
    var imgElement = element.querySelector('img');

    // Set the source of the lightbox image
    document.getElementById('lightbox-image').src = imgElement.src;

    // Display the lightbox
    document.getElementById('lightbox').style.display = 'flex';

    // Close the lightbox when clicking outside the image
    document.getElementById('lightbox').addEventListener('click', function(event) {
        if (event.target === this) {
            closeLightbox();
        }
    });
}

// Function to close the lightbox
function closeLightbox() {
    // Hide the lightbox
    document.getElementById('lightbox').style.display = 'none';
}