// 工作台页面功能模块
import { loadPage } from './router.js';

// 示例数据 - 实际应用中会从后端获取
const DEMO_SPACES = [
    { id: 'default', name: '默认空间', isActive: true },
    { id: 'work', name: '工作项目', isActive: false },
    { id: 'personal', name: '个人项目', isActive: false },
    { id: 'study', name: '学习笔记', isActive: false }
];

const DEMO_SESSIONS = {
    'default': [
        { 
            id: 'session1', 
            title: '如何使用AI辅助写作', 
            preview: '我们讨论了几种使用AI进行内容创作的方法，包括大纲生成、润色和内容扩展...',
            date: '4月28日',
            messageCount: 8
        },
        { 
            id: 'session2', 
            title: 'Python数据分析问题', 
            preview: '解决了Pandas数据处理的问题，包括如何有效地处理大型数据集和数据可视化...',
            date: '4月27日',
            messageCount: 12
        },
        { 
            id: 'session3', 
            title: '周末旅行计划', 
            preview: '制定了一个周末短途旅行的行程，包括景点推荐、交通和住宿选择...',
            date: '4月25日',
            messageCount: 6
        }
    ],
    'work': [
        { 
            id: 'work1', 
            title: '项目进度报告', 
            preview: '讨论了当前项目的进度、遇到的问题和解决方案...',
            date: '4月29日',
            messageCount: 15
        },
        { 
            id: 'work2', 
            title: '会议纪要', 
            preview: '整理了今天团队会议的主要内容和决定...',
            date: '4月28日',
            messageCount: 7
        }
    ],
    'personal': [
        { 
            id: 'personal1', 
            title: '健身计划', 
            preview: '制定了一个每周健身计划，包括有氧运动和力量训练...',
            date: '4月26日',
            messageCount: 4
        }
    ],
    'study': [
        { 
            id: 'study1', 
            title: '机器学习笔记', 
            preview: '整理了关于神经网络和深度学习的基础知识...',
            date: '4月24日',
            messageCount: 10
        },
        { 
            id: 'study2', 
            title: '英语学习材料', 
            preview: '收集了一些实用的英语学习资源和练习方法...',
            date: '4月23日',
            messageCount: 5
        }
    ]
};

// 当前选中的空间
let currentSpace = 'default';

/**
 * 初始化工作台页面
 */
export function initWorkspace() {
    // 设置空间列表
    setupSpaces();
    
    // 设置会话列表
    renderSessions(currentSpace);
    
    // 设置新建会话按钮
    setupNewSessionButton();
    
    // 设置会话卡片点击事件
    setupSessionCardClicks();
}

/**
 * 设置空间列表及其交互
 */
function setupSpaces() {
    const spacesList = document.querySelector('.spaces-list');
    if (!spacesList) return;
    
    // 监听空间项的点击
    spacesList.addEventListener('click', (event) => {
        // 找到被点击的空间项元素
        const spaceItem = event.target.closest('.space-item');
        if (!spaceItem) return;
        
        // 移除所有空间项的活动状态
        document.querySelectorAll('.space-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // 添加活动状态到当前点击的项
        spaceItem.classList.add('active');
        
        // 获取空间ID（这里简单用空间名称作为ID）
        const spaceName = spaceItem.querySelector('span').textContent;
        
        // 更新会话标题
        const sessionsTitle = document.querySelector('.sessions-title');
        if (sessionsTitle) {
            sessionsTitle.textContent = spaceName;
        }
        
        // 更新当前空间
        currentSpace = DEMO_SPACES.find(space => space.name === spaceName)?.id || 'default';
        
        // 重新渲染会话列表
        renderSessions(currentSpace);
    });
    
    // 设置添加新空间按钮
    const addSpaceButton = document.querySelector('.spaces-add');
    if (addSpaceButton) {
        addSpaceButton.addEventListener('click', () => {
            // 这里会打开一个添加空间的对话框，简化版先用alert
            alert('此功能在完整版中将允许创建新的空间');
        });
    }
}

/**
 * 渲染指定空间的会话列表
 * @param {string} spaceId - 空间ID
 */
function renderSessions(spaceId) {
    const sessionsGrid = document.querySelector('.sessions-grid');
    const emptyState = document.querySelector('.empty-state');
    
    if (!sessionsGrid || !emptyState) return;
    
    // 获取当前空间的会话
    const sessions = DEMO_SESSIONS[spaceId] || [];
    
    if (sessions.length === 0) {
        // 如果没有会话，显示空状态
        sessionsGrid.classList.add('hidden');
        emptyState.classList.remove('hidden');
    } else {
        // 有会话，显示会话网格
        emptyState.classList.add('hidden');
        sessionsGrid.classList.remove('hidden');
        
        // 清空现有内容
        sessionsGrid.innerHTML = '';
        
        // 添加会话卡片
        sessions.forEach(session => {
            const sessionCard = createSessionCard(session);
            sessionsGrid.appendChild(sessionCard);
        });
    }
}

/**
 * 创建会话卡片元素
 * @param {Object} session - 会话数据
 * @returns {HTMLElement} - 会话卡片元素
 */
function createSessionCard(session) {
    const card = document.createElement('div');
    card.className = 'session-card';
    card.setAttribute('data-session-id', session.id);
    
    card.innerHTML = `
        <h4 class="session-title">${session.title}</h4>
        <p class="session-preview">${session.preview}</p>
        <div class="session-footer">
            <span>${session.date}</span>
            <span>${session.messageCount}条消息</span>
        </div>
    `;
    
    return card;
}

/**
 * 设置新建会话按钮
 */
function setupNewSessionButton() {
    // 工作台顶部的新建会话按钮
    const newSessionBtn = document.querySelector('.new-session-btn');
    if (newSessionBtn) {
        newSessionBtn.addEventListener('click', () => {
            // 打开新的聊天页面
            loadPage('chat');
        });
    }
    
    // 空状态下的新建会话按钮
    const emptyStateBtn = document.querySelector('.empty-state .btn-primary');
    if (emptyStateBtn) {
        emptyStateBtn.addEventListener('click', () => {
            // 打开新的聊天页面
            loadPage('chat');
        });
    }
}

/**
 * 设置会话卡片点击事件
 */
function setupSessionCardClicks() {
    // 使用事件委托监听会话卡片的点击
    const sessionsContent = document.getElementById('sessions-content');
    if (sessionsContent) {
        sessionsContent.addEventListener('click', (event) => {
            const sessionCard = event.target.closest('.session-card');
            if (sessionCard) {
                const sessionId = sessionCard.getAttribute('data-session-id');
                if (sessionId) {
                    // 在实际应用中会加载特定会话
                    // 这里简化为打开聊天页面
                    loadPage('chat');
                }
            }
        });
    }
} 