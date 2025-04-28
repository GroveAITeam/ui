// 页面路由模块
import { initWorkspace } from './workspace.js';

// 定义页面路径映射
const PAGES = {
    'workspace': '/pages/workspace.html',
    'knowledge-base': '/pages/under-construction.html',
    'web-search': '/pages/under-construction.html',
    'file-assistant': '/pages/under-construction.html',
    'settings': '/pages/under-construction.html'
};

// 当前加载的页面
let currentPage = null;

/**
 * 加载页面内容
 * @param {string} pageName - 要加载的页面名称
 */
export async function loadPage(pageName) {
    // 确保页面存在
    if (!PAGES[pageName]) {
        console.error(`页面 "${pageName}" 不存在`);
        return;
    }
    
    // 设置当前页面
    currentPage = pageName;
    
    try {
        // 获取HTML内容
        const response = await fetch(PAGES[pageName]);
        if (!response.ok) {
            throw new Error(`无法加载页面: ${response.status} ${response.statusText}`);
        }
        
        const html = await response.text();
        
        // 更新内容容器
        const contentContainer = document.getElementById('content-container');
        contentContainer.innerHTML = html;
        
        // 根据页面执行相应的初始化
        initPageSpecific(pageName);
        
    } catch (error) {
        console.error('加载页面时出错:', error);
        document.getElementById('content-container').innerHTML = `
            <div class="error-container">
                <h3>加载页面时出错</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

/**
 * 根据页面名称执行特定的初始化
 * @param {string} pageName - 页面名称
 */
function initPageSpecific(pageName) {
    switch(pageName) {
        case 'workspace':
            // 初始化工作台
            initWorkspace();
            break;
    }
}

/**
 * 获取当前页面名称
 * @returns {string} 当前页面名称
 */
export function getCurrentPage() {
    return currentPage;
} 