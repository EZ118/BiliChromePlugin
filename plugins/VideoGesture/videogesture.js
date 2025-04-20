// ==UserScript==
// @name VideoGesture
// @author EZ118
// @license MIT 
// @version 0.1
// ==/UserScript==

var video = document.getElementById('player_videoContainer');
var touchStartX = 0;
var touchStartY = 0;
var touchEndX = 0;
var touchEndY = 0;
var touchStartTime = 0;
var isDragging = false;
var isLongPress = false;
var longPressTimer;
var touchMoveThreshold = 30; // 滑动阈值
var doubleTapThreshold = 300; // 双击时间阈值
var lastTapTime = 0;

// 创建提示框
var tooltip = document.createElement('div');
tooltip.style.position = 'absolute';
tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
tooltip.style.color = '#fff';
tooltip.style.padding = '5px 10px';
tooltip.style.borderRadius = '5px';
tooltip.style.display = 'none';
tooltip.style.zIndex = '104';
tooltip.style.textAlign = 'center';
tooltip.style.fontSize = '16px';
document.body.appendChild(tooltip);

// 显示提示框
function showTooltip(text) {
    var rect = video.getBoundingClientRect();
    var centerX = rect.left + rect.width / 2;
    var centerY = rect.top + rect.height / 2;

    tooltip.innerHTML = text;
    tooltip.style.left = centerX - tooltip.offsetWidth / 2 + 'px';
    tooltip.style.top = centerY - tooltip.offsetHeight / 2 + 'px';
    tooltip.style.display = 'block';
}

// 隐藏提示框
function hideTooltip() {
    tooltip.style.display = 'none';
}

// 处理触摸开始事件
function handleTouchStart(event) {
    if (event.touches.length === 1) {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
        touchStartTime = Date.now();
        isDragging = false;
        isLongPress = false;

        // 长按检测
        longPressTimer = setTimeout(function () {
            isLongPress = true;
        }, 500); // 长按时间阈值
    }
}

// 处理触摸移动事件
function handleTouchMove(event) {
    if (event.touches.length === 1) {
        touchEndX = event.touches[0].clientX;
        touchEndY = event.touches[0].clientY;

        var deltaX = touchEndX - touchStartX;
        var deltaY = touchEndY - touchStartY;

        if (Math.abs(deltaX) > touchMoveThreshold || Math.abs(deltaY) > touchMoveThreshold) {
            isDragging = true;
            clearTimeout(longPressTimer); // 取消长按检测

            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                // 垂直滑动：调节音量
                var volumeStep = 0.02; // 音量调节步长，灵敏度更低
                var newVolume = video.volume;

                if (deltaY < 0) {
                    // 向上滑动：增加音量
                    newVolume = Math.min(video.volume + volumeStep, 1);
                } else {
                    // 向下滑动：减小音量
                    newVolume = Math.max(video.volume - volumeStep, 0);
                }

                video.volume = newVolume;
                showTooltip('Volume: ' + Math.round(newVolume * 100) + '%');
            } else {
                // 水平滑动：调节进度
                var newTime = video.currentTime + (deltaX / video.offsetWidth) * video.duration;
                newTime = Math.max(0, Math.min(newTime, video.duration));
                showTooltip(formatTime(newTime));
            }
        }
    }
}

// 处理触摸结束事件
function handleTouchEnd(event) {
    if (isLongPress) {
        // 长按不处理
        return;
    }

    if (isDragging) {
        // 滑动结束，隐藏提示框
        hideTooltip();
        if (Math.abs(touchEndX - touchStartX) > Math.abs(touchEndY - touchStartY)) {
            // 水平滑动：设置新进度
            var newTime = video.currentTime + ((touchEndX - touchStartX) / video.offsetWidth) * video.duration;
            video.currentTime = Math.max(0, Math.min(newTime, video.duration));
        }
    } else {
        // 点击或双击
        var currentTime = Date.now();
        if (currentTime - lastTapTime < doubleTapThreshold) {
            // 双击：暂停/播放
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        } else {
            // 单击：暂停/播放
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        }
        lastTapTime = currentTime;
    }
}

// 格式化时间
function formatTime(time) {
    var minutes = Math.floor(time / 60);
    var seconds = Math.floor(time % 60);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

// 绑定事件
video.addEventListener('touchstart', handleTouchStart, false);
video.addEventListener('touchmove', handleTouchMove, false);
video.addEventListener('touchend', handleTouchEnd, false);

// 鼠标操作
video.addEventListener('click', function () {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
});

video.addEventListener('dblclick', function () {
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.mozRequestFullScreen) { // Firefox
        video.mozRequestFullScreen();
    } else if (video.webkitRequestFullscreen) { // Chrome, Safari and Opera
        video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) { // IE/Edge
        video.msRequestFullscreen();
    }
});