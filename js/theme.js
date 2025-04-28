// 主题管理模块

/**
 * 初始化主题切换功能
 */
export function setupThemeToggle() {
    // 检查本地存储中是否有保存的主题偏好
    const savedTheme = localStorage.getItem('grove-theme');
    
    // 如果有保存的主题偏好，应用它
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // 没有保存的偏好，检查系统偏好
        checkSystemTheme();
    }
    
    // 暂时不在UI上添加主题切换按钮，后续会在设置页面中提供
}

/**
 * 应用指定的主题
 * @param {string} theme - 主题名称 ('light' 或 'dark')
 */
export function applyTheme(theme) {
    const body = document.body;
    
    // 移除所有主题相关的类
    body.classList.remove('theme-light', 'theme-dark');
    
    // 添加选择的主题类
    body.classList.add(`theme-${theme}`);
    
    // 保存主题偏好到本地存储
    localStorage.setItem('grove-theme', theme);
}

/**
 * 检查系统的颜色主题偏好
 */
function checkSystemTheme() {
    // 检查系统是否支持深色模式并且用户偏好深色
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // 应用相应的主题
    applyTheme(prefersDark ? 'dark' : 'light');
    
    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        applyTheme(newTheme);
    });
} 