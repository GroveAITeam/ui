/**
 * 侧边栏组件
 * 处理所有页面通用的侧边栏交互
 */

/**
 * 初始化侧边栏
 * @param {string} currentPage - 当前页面的ID
 */
export function initSidebar(currentPage) {
    // 高亮当前页面对应的菜单项
    updateActiveMenuItem(currentPage);
    
    // 添加响应式菜单切换
    addResponsiveMenuToggle();
    
    // 可以添加更多侧边栏相关的功能初始化
}

/**
 * 更新当前活动的菜单项
 * @param {string} currentPage - 当前页面的ID
 */
function updateActiveMenuItem(currentPage) {
    // 移除所有菜单项的活动状态
    document.querySelectorAll('.nav-menu li').forEach(item => {
        item.classList.remove('active');
    });
    
    // 根据当前页面ID查找对应的菜单项
    let selector;
    switch (currentPage) {
        case 'workspace':
            selector = '.nav-menu li:nth-child(1)';
            break;
        case 'local-tools':
            selector = '.nav-menu li:nth-child(2)';
            break;
        case 'online-tools':
            selector = '.nav-menu li:nth-child(3)';
            break;
        case 'agents':
            selector = '.nav-menu li:nth-child(4)';
            break;
        case 'settings':
            selector = '.sidebar-footer .nav-menu li';
            break;
        default:
            selector = '';
    }
    
    // 添加活动状态
    if (selector) {
        const activeItem = document.querySelector(selector);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }
}

/**
 * 添加响应式菜单切换功能
 */
function addResponsiveMenuToggle() {
    // 创建菜单切换按钮
    const toggleButton = document.createElement('button');
    toggleButton.className = 'menu-toggle';
    toggleButton.innerHTML = '<i class="ri-menu-line"></i>';
    toggleButton.setAttribute('aria-label', '菜单');
    
    // 添加到DOM
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.parentNode.insertBefore(toggleButton, sidebar);
        
        // 添加点击事件
        toggleButton.addEventListener('click', () => {
            sidebar.classList.toggle('show');
            toggleButton.classList.toggle('active');
            if (toggleButton.classList.contains('active')) {
                toggleButton.innerHTML = '<i class="ri-close-line"></i>';
            } else {
                toggleButton.innerHTML = '<i class="ri-menu-line"></i>';
            }
        });
        
        // 点击页面其他区域关闭菜单
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !toggleButton.contains(e.target)) {
                sidebar.classList.remove('show');
                toggleButton.classList.remove('active');
                toggleButton.innerHTML = '<i class="ri-menu-line"></i>';
            }
        });
    }
}

// DOM元素
const sidebar = document.querySelector('.sidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const menuItems = document.querySelectorAll('.menu-item');

// 初始化
function init() {
    // 设置菜单项点击事件
    setupMenuItems();
    
    // 设置响应式菜单切换
    setupResponsiveMenu();
    
    // 高亮当前页面
    highlightCurrentPage();
}

// 设置菜单项点击事件
function setupMenuItems() {
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            // 移除所有活动状态
            menuItems.forEach(i => i.classList.remove('active'));
            
            // 添加活动状态到当前项
            item.classList.add('active');
        });
    });
}

// 设置响应式菜单切换
function setupResponsiveMenu() {
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            if (sidebar) {
                sidebar.classList.toggle('collapsed');
            }
        });
    }
}

// 高亮当前页面
function highlightCurrentPage() {
    // 获取当前页面路径
    const currentPath = window.location.pathname;
    
    // 移除所有活动状态
    menuItems.forEach(item => item.classList.remove('active'));
    
    // 根据路径高亮对应菜单项
    menuItems.forEach(item => {
        const link = item.querySelector('a');
        if (link && link.getAttribute('href') === currentPath) {
            item.classList.add('active');
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init); 