// 工作台页面功能模块
import { initChat } from './chat.js';

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
            messageCount: 8,
            isActive: true
        },
        { 
            id: 'session2', 
            title: 'Python数据分析问题', 
            preview: '解决了Pandas数据处理的问题，包括如何有效地处理大型数据集和数据可视化...',
            date: '4月27日',
            messageCount: 12,
            isActive: false
        },
        { 
            id: 'session3', 
            title: '周末旅行计划', 
            preview: '制定了一个周末短途旅行的行程，包括景点推荐、交通和住宿选择...',
            date: '4月25日',
            messageCount: 6,
            isActive: false
        }
    ],
    'work': [
        { 
            id: 'work1', 
            title: '项目进度报告', 
            preview: '讨论了当前项目的进度、遇到的问题和解决方案...',
            date: '4月29日',
            messageCount: 15,
            isActive: false
        }
    ],
    'personal': [
        { 
            id: 'personal1', 
            title: '健身计划', 
            preview: '制定了一个每周健身计划，包括有氧运动和力量训练...',
            date: '4月26日',
            messageCount: 4,
            isActive: false
        }
    ],
    'study': [
        { 
            id: 'study1', 
            title: '机器学习笔记', 
            preview: '整理了关于神经网络和深度学习的基础知识...',
            date: '4月24日',
            messageCount: 10,
            isActive: false
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
    
    // 设置会话项点击事件
    setupSessionItemClicks();
    
    // 初始化聊天功能
    initChat();
}

/**
 * 设置空间列表及其交互
 */
function setupSpaces() {
    const spacesList = document.querySelector('.spaces-list');
    if (!spacesList) return;
    
    // 监听空间项的点击
    spacesList.addEventListener('click', (event) => {
        const spaceItem = event.target.closest('.space-item');
        if (!spaceItem) return;
        
        // 移除所有空间项的活动状态
        document.querySelectorAll('.space-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // 添加活动状态到当前点击的项
        spaceItem.classList.add('active');
        
        // 获取空间名称
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
            alert('此功能在完整版中将允许创建新的空间');
        });
    }
}

/**
 * 渲染指定空间的会话列表
 * @param {string} spaceId - 空间ID
 */
function renderSessions(spaceId) {
    const sessionsContent = document.querySelector('.sessions-content');
    if (!sessionsContent) return;
    
    // 获取当前空间的会话
    const sessions = DEMO_SESSIONS[spaceId] || [];
    
    // 清空现有内容
    sessionsContent.innerHTML = '';
    
    if (sessions.length === 0) {
        // 如果没有会话，显示空状态
        sessionsContent.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <i class="bi bi-chat-square-text"></i>
                </div>
                <h3 class="empty-state-title">没有会话</h3>
                <p class="empty-state-desc">在此空间中创建一个新会话，开始与AI助手交流。</p>
                <button class="btn btn-primary new-session-btn">
                    <i class="bi bi-plus"></i>
                    <span>新对话</span>
                </button>
            </div>
        `;
    } else {
        // 添加会话项
        sessions.forEach(session => {
            const sessionItem = createSessionItem(session);
            sessionsContent.appendChild(sessionItem);
        });
    }
}

/**
 * 创建会话项元素
 * @param {Object} session - 会话数据
 * @returns {HTMLElement} - 会话项元素
 */
function createSessionItem(session) {
    const item = document.createElement('div');
    item.className = `session-item${session.isActive ? ' active' : ''}`;
    item.setAttribute('data-session-id', session.id);
    
    item.innerHTML = `
        <h4 class="session-title">${session.title}</h4>
        <p class="session-preview">${session.preview}</p>
        <div class="session-footer">
            <span>${session.date}</span>
            <span>${session.messageCount}条消息</span>
        </div>
    `;
    
    return item;
}

/**
 * 设置新建会话按钮
 */
function setupNewSessionButton() {
    const newSessionBtns = document.querySelectorAll('.new-session-btn');
    newSessionBtns.forEach(btn => {
        btn.addEventListener('click', createNewSession);
    });
}

/**
 * 创建新会话
 */
function createNewSession() {
    // 移除所有会话的活动状态
    document.querySelectorAll('.session-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 更新聊天标题
    const chatTitle = document.querySelector('.chat-title');
    if (chatTitle) {
        chatTitle.textContent = '新对话';
    }
    
    // 清空聊天消息
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
        chatMessages.innerHTML = `
            <div class="message ai-message">
                <div class="tool-indicator">
                    <i class="bi bi-robot"></i>
                    <span>默认智能体</span>
                </div>
                你好！我是Grove AI助手。我可以帮助你解答问题、完成任务或进行日常对话。你有什么需要帮助的吗？
            </div>
        `;
    }
}

/**
 * 设置会话项点击事件
 */
function setupSessionItemClicks() {
    const sessionsContent = document.querySelector('.sessions-content');
    if (!sessionsContent) return;
    
    sessionsContent.addEventListener('click', (event) => {
        const sessionItem = event.target.closest('.session-item');
        if (!sessionItem) return;
        
        // 移除所有会话项的活动状态
        document.querySelectorAll('.session-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // 添加活动状态到当前点击的项
        sessionItem.classList.add('active');
        
        // 获取会话ID
        const sessionId = sessionItem.getAttribute('data-session-id');
        
        // 更新聊天标题
        const chatTitle = document.querySelector('.chat-title');
        if (chatTitle) {
            chatTitle.textContent = sessionItem.querySelector('.session-title').textContent;
        }
        
        // 在实际应用中，这里会加载特定会话的聊天记录
        // 目前仅显示示例消息
        const chatMessages = document.querySelector('.chat-messages');
        if (chatMessages) {
            chatMessages.innerHTML = `
                <div class="message ai-message">
                    <div class="tool-indicator">
                        <i class="bi bi-robot"></i>
                        <span>默认智能体</span>
                    </div>
                    这是一个示例会话。在实际应用中，这里会显示该会话的历史消息记录。
                </div>
            `;
        }
    });
} 