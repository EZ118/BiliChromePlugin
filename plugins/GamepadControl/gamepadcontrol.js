// ==UserScript==
// @name GamepadControl
// @author EZ118
// @license MIT 
// @version 0.1
// ==/UserScript==

(function() {
    var currentIndex = 0;
    var selectableElements = [];
    var isInitialized = false;

    var styleText = document.createElement('style');
    styleText.innerHTML = ".selected { outline: 3px solid var(--s-color-primary, #00687b); border-radius:3px; background-color:var(--s-color-secondary-container, #cee7ef); }";
    document.head.appendChild(styleText);

    // 初始化插件
    function initializePlugin() {
        if (isInitialized) return;
        isInitialized = true;

        // 获取所有可选的元素
        updateSelectableElements();

        // 设置第一个元素为焦点
        if (selectableElements.length > 0) {
            selectableElements[currentIndex].classList.add('selected');
        }

        // 监听键盘事件
        document.addEventListener('keydown', handleNavigation);

        // 监听手柄事件
        window.addEventListener('gamepadconnected', function(event) {
            console.log('Gamepad connected:', event.gamepad.id);
            setInterval(pollGamepad, 100); // 每100ms检查一次手柄状态
        });

        // 监听页面内容变化（局部刷新）
        observeDOMChanges();

        // 监听容器显示状态变化
        observeContainerVisibility();
    }

    // 更新可选元素列表
    function updateSelectableElements() {
        // 获取所有可选的元素
        var allElements = Array.from(document.querySelectorAll(
            '.reply_item .content, .s-card, s-button, s-icon-button, a, .more_reply, video, input[type="text"], s-chip'
        ));

        // 根据当前显示的容器动态更新可选元素
        var activeContainer = getActiveContainer();
        if (activeContainer) {
            selectableElements = Array.from(activeContainer.querySelectorAll(
                '.reply_item .content, .s-card, s-button, s-icon-button, a, .more_reply, video, input[type="text"], s-chip'
            ));
        } else {
            selectableElements = allElements;
        }

        // 重置当前选中索引
        currentIndex = 0;
        if (selectableElements.length > 0) {
            selectableElements[currentIndex].classList.add('selected');
        }
    }

    // 获取当前显示的容器
    function getActiveContainer() {
        var containers = [
            document.getElementById('player_container'),
            document.getElementById('live_container'),
            document.getElementById('dlg_container')
        ];

        // 按优先级（z-index 或 DOM 顺序）返回第一个显示的容器
        for (var i = 0; i < containers.length; i++) {
            if (containers[i] && isElementVisible(containers[i])) {
                return containers[i];
            }
        }
        return null;
    }

    // 判断元素是否可见
    function isElementVisible(element) {
        return element.offsetWidth > 0 && element.offsetHeight > 0 &&
               window.getComputedStyle(element).display !== 'none' &&
               window.getComputedStyle(element).visibility !== 'hidden';
    }

    // 处理导航
    function handleNavigation(event) {
        var key = event.key;

        // 键盘方向键处理
        if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
            event.preventDefault();
            moveFocus(key);
        }

        // 键盘 Enter 键处理
        if (key === 'Enter') {
            confirmSelection();
        }
    }

    // 处理手柄输入
    function pollGamepad() {
        var gamepad = navigator.getGamepads()[0];
        if (!gamepad) return;

        var axes = gamepad.axes;

        // 摇杆上下左右移动
        if (axes[1] < -0.5) { // 上
            moveFocus('ArrowUp');
        } else if (axes[1] > 0.5) { // 下
            moveFocus('ArrowDown');
        } else if (axes[0] < -0.5) { // 左
            moveFocus('ArrowLeft');
        } else if (axes[0] > 0.5) { // 右
            moveFocus('ArrowRight');
        }

        // 手柄确认按钮（通常为 A 按钮）
        if (gamepad.buttons[0].pressed) {
            confirmSelection();
        }
    }

    // 移动焦点
    function moveFocus(direction) {
        if (selectableElements.length === 0) return;

        // 移除当前选中状态
        selectableElements[currentIndex].classList.remove('selected');

        var rows = Math.floor(Math.sqrt(selectableElements.length));
        var cols = rows;

        switch (direction) {
            case 'ArrowUp':
                currentIndex = (currentIndex - cols + selectableElements.length) % selectableElements.length;
                break;
            case 'ArrowDown':
                currentIndex = (currentIndex + cols) % selectableElements.length;
                break;
            case 'ArrowLeft':
                currentIndex = (currentIndex - 1 + selectableElements.length) % selectableElements.length;
                break;
            case 'ArrowRight':
                currentIndex = (currentIndex + 1) % selectableElements.length;
                break;
        }

        // 添加新的选中状态
        selectableElements[currentIndex].classList.add('selected');
        selectableElements[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // 确认选择
    function confirmSelection() {
        if (selectableElements.length === 0) return;

        var selectedElement = selectableElements[currentIndex];
        selectedElement.click(); // 触发点击事件
        console.log('Selected element:', selectedElement);
    }

    // 监听 DOM 变化（局部刷新）
    function observeDOMChanges() {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    updateSelectableElements();
                    if (selectableElements.length > 0) {
                        selectableElements[currentIndex].classList.add('selected');
                    }
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 监听容器显示状态变化
    function observeContainerVisibility() {
        var containers = [
            document.getElementById('player_container'),
            document.getElementById('live_container'),
            document.getElementById('dlg_container')
        ];

        containers.forEach(function(container) {
            if (container) {
                var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.attributeName === 'style' || mutation.attributeName === 'class') {
                            updateSelectableElements();
                        }
                    });
                });

                observer.observe(container, { attributes: true });
            }
        });
    }

    // 初始化插件
    initializePlugin();
})();