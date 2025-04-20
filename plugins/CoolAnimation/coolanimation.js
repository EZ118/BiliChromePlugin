// ==UserScript==
// @name         CoolAnimation
// @author       EZ118
// @license      MIT 
// @version      0.1
// ==/UserScript==


(function () {
    // 保存原始的 player.open 方法
    var originalPlayerOpen = player.open;

    // 劫持 player.open 方法
    player.open = function () {
        console.log('执行 player.open() 动画');

        // 获取目标元素（假设 player.open 操作的是某个特定元素）
        var targetElement = document.querySelector('#player_container'); // 替换为实际的目标元素选择器

        // 添加缩放动画
        if (targetElement) {
            // 使用 CSS 动画实现缩放效果
            targetElement.style.transition = 'transform 0.2s ease-in-out';
            targetElement.style.transform = 'scale(0.9) translateX(30%)';

            // 在动画完成后恢复原始大小
            setTimeout(function () {
                targetElement.style.transform = 'scale(1) translateX(0)';
            }, 100); // 动画时长与 transition 匹配
        }

        // 调用原始的 player.open 方法，保留其原有功能
        if (typeof originalPlayerOpen === 'function') {
            originalPlayerOpen.apply(this, arguments);
        }
    };




    // 保存原始的 player.open 方法
    var originalModalOpen = modal.open;

    // 劫持 player.open 方法
    modal.open = function () {
        console.log('执行 modal.open() 动画');

        // 获取目标元素（假设 player.open 操作的是某个特定元素）
        var targetElement = document.querySelector('.dlg_container_real'); // 替换为实际的目标元素选择器

        // 添加缩放动画
        if (targetElement) {
            // 使用 CSS 动画实现缩放效果
            targetElement.style.transition = 'transform 0.2s ease-in-out';
            targetElement.style.transform = 'scale(0.6) translateX(-10%) translateY(-50%)';

            // 在动画完成后恢复原始大小
            setTimeout(function () {
                targetElement.style.transform = 'scale(1) translateX(-50%) translateY(-50%)';
            }, 50); // 动画时长与 transition 匹配
        }

        // 调用原始的 player.open 方法，保留其原有功能
        if (typeof originalModalOpen === 'function') {
            originalModalOpen.apply(this, arguments);
        }
    };
})();