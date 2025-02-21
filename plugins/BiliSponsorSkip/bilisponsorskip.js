// ==UserScript==
// @name BiliSponsorSkip
// @author EZ118
// @license MIT 
// @version 0.1
// ==/UserScript==

// 以上内容不属于JS插件的规范，BiliScape不会读取，仅向代码阅读者注明插件信息

// 创建元素
var jumpBtn = document.createElement('s-icon-button');
jumpBtn.id = 'player_jumpSponsorClip';
jumpBtn.title = '一键跳伞';
jumpBtn.innerHTML = '<s-icon><svg class="icon icon-tabler icon-tabler-parachute" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none" stroke="none"/><path d="M22 12a10 10 0 1 0 -20 0"/><path d="M22 12c0 -1.66 -1.46 -3 -3.25 -3c-1.8 0 -3.25 1.34 -3.25 3c0 -1.66 -1.57 -3 -3.5 -3s-3.5 1.34 -3.5 3c0 -1.66 -1.46 -3 -3.25 -3c-1.8 0 -3.25 1.34 -3.25 3"/><path d="M2 12l10 10l-3.5 -10"/><path d="M15.5 12l-3.5 10l10 -10"/></svg></s-icon>';
document.getElementById("player_scrSwitchBtn").parentElement.append(jumpBtn);


var controlButton = document.getElementById("player_jumpSponsorClip");
var videoContainer = document.getElementById('player_videoContainer');

controlButton.addEventListener("click", function () {
    var bvid = window.bvidPlayingNow;
    var cid = window.cidPlayingNow;

    $.ajax({
        url: "https://bsbsb.top/api/skipSegments?videoID=" + bvid + "&cid=" + cid + "&actionType=skip",
        method: 'GET',
        success: function (result) {
            if (!Array.isArray(result) || result.length === 0) {
                window.showToast("数据返回错误");
                return;
            }

            // 处理视频元数据加载
            if (videoContainer.readyState < 2) {
                videoContainer.addEventListener('loadedmetadata', handleSegments);
            } else {
                handleSegments();
            }

            function handleSegments() {
                var currentTime = videoContainer.currentTime;
                var foundSegment = false;

                for (var i = 0; i < result.length && !foundSegment; i++) {
                    var segmentStart = result[i]['segment'][0];
                    var segmentEnd = result[i]['segment'][1];

                    if (currentTime >= (segmentStart - 10) && currentTime < segmentEnd) {
                        // 当前时间在当前段落内
                        videoContainer.currentTime = segmentEnd;
                        foundSegment = true;
                        window.showToast("已跳转");
                    }
                }

                if(!foundSegment) {
                    window.showToast("未到恰饭片段（恰饭片段前10秒可跳转）");
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            window.showToast("没有恰饭片段的数据");
        }
    });
});