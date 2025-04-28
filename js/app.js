// 导入其他模块
import { loadPage } from './router.js';
import { initWorkspace } from './workspace.js';
import { setupThemeToggle } from './theme.js';

// 应用程序初始化
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

// 初始化应用程序
function initApp() {
    // 设置页面导航
    setupNavigation();
    
    // 初始化主题切换
    setupThemeToggle();
    
    // 默认加载工作台页面
    loadPage('workspace');
}

// 设置导航功能
function setupNavigation() {
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有项目的活动状态
            sidebarItems.forEach(i => i.classList.remove('active'));
            
            // 为当前项目添加活动状态
            this.classList.add('active');
            
            // 获取要加载的页面
            const page = this.getAttribute('data-page');
            
            // 加载相应页面
            loadPage(page);
        });
    });
}

// 导出为全局对象（如果需要）
window.App = {
    loadPage
}; 