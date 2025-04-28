// 导入模块
import { initStorage, getSpaces, addSpace, getSessions, addSession, getMessages, addMessage, getSession, updateSession } from './storage.js';
import { getAllTools, executeTool, detectToolRequests } from './tools.js';
import { getAvailableModels, getDefaultModel, creativityToTemperature } from './models.js';
import { getAvailableAgents, getDefaultAgent, getAgentTools } from './agents.js';

// DOM元素
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-message');
const chatMessages = document.querySelector('.chat-messages');
const spaceItems = document.querySelectorAll('.space-item');
const sessionItems = document.querySelectorAll('.session-item');
const addSpaceButton = document.getElementById('add-space');
const addSessionButton = document.getElementById('add-session');
const modelSelect = document.getElementById('model-select');
const agentSelect = document.getElementById('agent-select');
const creativitySlider = document.getElementById('creativity-slider');

// 应用状态
let currentSpaceId = 'default';
let currentSessionId = 'default_session';

// 自动调整文本区域高度
function autoResizeTextarea() {
    messageInput.style.height = 'auto';
    messageInput.style.height = (messageInput.scrollHeight > 120 ? 120 : messageInput.scrollHeight) + 'px';
}

// 初始化
async function init() {
    // 初始化存储
    initStorage();
    
    // 加载空间和会话
    loadSpaces();
    loadSessions(currentSpaceId);
    
    // 加载当前会话
    loadSession(currentSessionId);
    
    // 填充模型和智能体选择器
    populateModelSelect();
    populateAgentSelect();
    
    // 设置文本区域事件
    messageInput.addEventListener('input', autoResizeTextarea);
    
    // 发送消息事件
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // 添加空间按钮事件
    addSpaceButton.addEventListener('click', () => {
        // 弹出添加空间对话框
        const spaceName = prompt('请输入新空间名称：');
        if (spaceName && spaceName.trim() !== '') {
            createNewSpace(spaceName.trim());
        }
    });
    
    // 添加会话按钮事件
    addSessionButton.addEventListener('click', () => {
        // 创建新会话
        createNewSession(currentSpaceId);
    });
    
    // 模型选择事件
    modelSelect.addEventListener('change', function() {
        const selectedModelId = this.value;
        console.log('模型已变更为：', selectedModelId);
        
        // 更新当前会话的模型设置
        if (currentSessionId) {
            updateSession(currentSessionId, { modelId: selectedModelId });
        }
    });
    
    // 智能体选择事件
    agentSelect.addEventListener('change', function() {
        const selectedAgentId = this.value;
        console.log('智能体已变更为：', selectedAgentId);
        
        // 更新当前会话的智能体设置
        if (currentSessionId) {
            updateSession(currentSessionId, { agentId: selectedAgentId });
        }
    });
    
    // 创意度滑块事件
    creativitySlider.addEventListener('input', function() {
        const creativity = parseInt(this.value);
        console.log('创意度已设置为：', creativity);
        console.log('Temperature: ', creativityToTemperature(creativity));
    });
    
    // 添加折叠面板功能
    setupPanelToggles();
}

// 设置面板折叠/展开功能
function setupPanelToggles() {
    const toggleSpacesButton = document.getElementById('toggle-spaces');
    const toggleSessionsButton = document.getElementById('toggle-sessions');
    const spacesPanel = document.querySelector('.spaces-panel');
    const sessionsPanel = document.querySelector('.sessions-panel');
    
    // 折叠/展开空间面板
    toggleSpacesButton.addEventListener('click', () => {
        spacesPanel.classList.toggle('collapsed');
        
        // 更新按钮图标
        const icon = toggleSpacesButton.querySelector('i');
        if (spacesPanel.classList.contains('collapsed')) {
            icon.className = 'ri-arrow-right-s-line';
        } else {
            icon.className = 'ri-arrow-left-s-line';
        }
    });
    
    // 折叠/展开会话面板
    toggleSessionsButton.addEventListener('click', () => {
        sessionsPanel.classList.toggle('collapsed');
        
        // 更新按钮图标
        const icon = toggleSessionsButton.querySelector('i');
        if (sessionsPanel.classList.contains('collapsed')) {
            icon.className = 'ri-arrow-right-s-line';
        } else {
            icon.className = 'ri-arrow-left-s-line';
        }
    });
}

// 加载空间列表
function loadSpaces() {
    const spaces = getSpaces();
    const spacesContainer = document.querySelector('.spaces-list');
    
    // 清空容器
    spacesContainer.innerHTML = '';
    
    // 添加空间项
    spaces.forEach(space => {
        const spaceElement = document.createElement('div');
        spaceElement.className = `space-item ${space.id === currentSpaceId ? 'active' : ''}`;
        spaceElement.dataset.id = space.id;
        spaceElement.innerHTML = `
            <i class="ri-folder-line"></i>
            <span>${space.name}</span>
        `;
        
        // 添加点击事件
        spaceElement.addEventListener('click', () => {
            // 移除所有active类
            document.querySelectorAll('.space-item').forEach(item => item.classList.remove('active'));
            // 为当前项添加active类
            spaceElement.classList.add('active');
            // 加载该空间的会话
            currentSpaceId = space.id;
            loadSessions(currentSpaceId);
        });
        
        // 添加到容器
        spacesContainer.appendChild(spaceElement);
    });
}

// 加载会话列表
function loadSessions(spaceId) {
    const sessions = getSessions(spaceId);
    const sessionsContainer = document.querySelector('.sessions-list');
    
    // 清空容器
    sessionsContainer.innerHTML = '';
    
    // 添加会话项
    sessions.forEach(session => {
        const sessionElement = document.createElement('div');
        sessionElement.className = `session-item ${session.id === currentSessionId ? 'active' : ''}`;
        sessionElement.dataset.id = session.id;
        
        // 计算相对时间
        const relativeTime = getRelativeTime(new Date(session.updatedAt));
        
        sessionElement.innerHTML = `
            <div class="session-info">
                <h3>${session.name}</h3>
                <p>${session.preview}</p>
            </div>
            <div class="session-time">${relativeTime}</div>
        `;
        
        // 添加点击事件
        sessionElement.addEventListener('click', () => {
            // 移除所有active类
            document.querySelectorAll('.session-item').forEach(item => item.classList.remove('active'));
            // 为当前项添加active类
            sessionElement.classList.add('active');
            // 加载会话内容
            currentSessionId = session.id;
            loadSession(currentSessionId);
        });
        
        // 添加到容器
        sessionsContainer.appendChild(sessionElement);
    });
}

// 填充模型选择器
function populateModelSelect() {
    const models = getAvailableModels();
    const defaultModel = getDefaultModel();
    
    // 清空选择器
    modelSelect.innerHTML = '';
    
    // 添加模型选项
    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.id;
        option.textContent = model.name;
        
        if (model.id === defaultModel.id) {
            option.selected = true;
        }
        
        modelSelect.appendChild(option);
    });
}

// 填充智能体选择器
function populateAgentSelect() {
    const agents = getAvailableAgents();
    const defaultAgent = getDefaultAgent();
    
    // 清空选择器
    agentSelect.innerHTML = '';
    
    // 添加智能体选项
    agents.forEach(agent => {
        const option = document.createElement('option');
        option.value = agent.id;
        option.textContent = agent.name;
        
        if (agent.id === defaultAgent.id) {
            option.selected = true;
        }
        
        agentSelect.appendChild(option);
    });
}

// 获取相对时间
function getRelativeTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) {
        return '刚刚';
    } else if (diffMin < 60) {
        return `${diffMin}分钟前`;
    } else if (diffHour < 24) {
        return `${diffHour}小时前`;
    } else if (diffDay < 30) {
        return `${diffDay}天前`;
    } else {
        // 返回格式化的日期
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }
}

// 发送消息
async function sendMessage() {
    const message = messageInput.value.trim();
    if (message === '') return;
    
    // 添加用户消息到本地存储
    const userMessage = addMessage(currentSessionId, 'user', message);
    
    // 添加用户消息到聊天
    addMessageToChat('user', message);
    
    // 清空输入框并重置高度
    messageInput.value = '';
    autoResizeTextarea();
    
    // 显示AI正在思考的指示器
    addLoadingIndicator();
    
    // 获取当前会话信息
    const session = getSession(currentSessionId);
    
    // 检测工具请求
    const toolRequests = detectToolRequests(message);
    const toolResults = [];
    
    // 执行工具请求
    for (const request of toolRequests) {
        try {
            const result = await executeTool(request.tool, ...request.args);
            toolResults.push({
                tool: request.tool,
                result: result
            });
        } catch (error) {
            console.error('工具执行错误:', error);
        }
    }
    
    // 生成AI响应
    setTimeout(async () => {
        // 移除加载指示器
        removeLoadingIndicator();
        
        // 生成响应内容
        let responseContent = '';
        let usedTools = [];
        
        // 如果有工具结果，根据工具结果生成响应
        if (toolResults.length > 0) {
            for (const { tool, result } of toolResults) {
                const toolInfo = getAllTools()[tool];
                responseContent += result + '\n\n';
                usedTools.push({
                    name: toolInfo.name,
                    icon: toolInfo.icon
                });
            }
        } else {
            // 否则，生成普通响应
            const aiResponse = generateAIResponse(message);
            responseContent = aiResponse.text;
            usedTools = aiResponse.tools;
        }
        
        // 添加AI消息到本地存储
        addMessage(currentSessionId, 'assistant', responseContent, usedTools);
        
        // 添加AI响应到聊天
        addMessageToChat('assistant', responseContent, usedTools);
        
        // 滚动到底部
        scrollToBottom();
    }, 1500);
}

// 加载会话
function loadSession(sessionId) {
    const session = getSession(sessionId);
    if (!session) return;
    
    // 更新会话标题
    document.querySelector('.chat-title').textContent = session.name;
    
    // 设置模型和智能体选择器
    modelSelect.value = session.modelId;
    agentSelect.value = session.agentId;
    
    // 获取会话消息
    const messages = getMessages(sessionId);
    
    // 清空聊天区域
    chatMessages.innerHTML = '';
    
    // 添加消息到聊天
    messages.forEach(msg => {
        if (msg.role === 'system') {
            addMessageToChat('system', msg.content);
        } else if (msg.role === 'user') {
            addMessageToChat('user', msg.content);
        } else if (msg.role === 'assistant') {
            addMessageToChat('assistant', msg.content, msg.tools || []);
        }
    });
    
    // 滚动到底部
    scrollToBottom();
}

// 添加消息到聊天
function addMessageToChat(sender, text, tools = []) {
    // 移除加载指示器（如果有）
    removeLoadingIndicator();
    
    // 创建消息元素
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    // 消息内容
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // 简单Markdown处理
    const formattedText = formatMarkdown(text);
    contentDiv.innerHTML = formattedText;
    
    messageDiv.appendChild(contentDiv);
    
    // 如果有工具使用，添加工具图标
    if (tools && tools.length > 0) {
        const toolsDiv = document.createElement('div');
        toolsDiv.className = 'message-tools';
        
        tools.forEach(tool => {
            const toolSpan = document.createElement('span');
            toolSpan.className = 'tool-icon';
            toolSpan.title = `使用了${tool.name}工具`;
            toolSpan.innerHTML = `<i class="ri-${tool.icon}-line"></i>`;
            toolsDiv.appendChild(toolSpan);
        });
        
        messageDiv.appendChild(toolsDiv);
    }
    
    // 添加到聊天区域
    chatMessages.appendChild(messageDiv);
    
    // 滚动到底部
    scrollToBottom();
}

// 添加加载指示器
function addLoadingIndicator() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message assistant loading';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = '<span></span><span></span><span></span>';
    
    contentDiv.appendChild(typingIndicator);
    loadingDiv.appendChild(contentDiv);
    
    chatMessages.appendChild(loadingDiv);
    scrollToBottom();
}

// 移除加载指示器
function removeLoadingIndicator() {
    const loadingIndicator = document.querySelector('.message.loading');
    if (loadingIndicator) {
        loadingIndicator.remove();
    }
}

// 滚动到底部
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 创建新空间
function createNewSpace(name) {
    // 添加到存储
    const newSpace = addSpace(name);
    
    // 重新加载空间列表
    loadSpaces();
    
    // 切换到新空间
    currentSpaceId = newSpace.id;
    
    // 创建一个新会话
    createNewSession(currentSpaceId);
}

// 创建新会话
function createNewSession(spaceId) {
    // 添加到存储
    const newSession = addSession(spaceId);
    
    // 重新加载会话列表
    loadSessions(spaceId);
    
    // 切换到新会话
    currentSessionId = newSession.id;
    loadSession(currentSessionId);
}

// 简单的Markdown格式化
function formatMarkdown(text) {
    // 将文本转换为HTML
    let html = text;
    
    // 处理段落
    html = html.replace(/\n\n/g, '</p><p>');
    
    // 处理换行
    html = html.replace(/\n/g, '<br>');
    
    // 处理粗体
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // 处理斜体
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // 处理代码块
    html = html.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');
    
    // 处理行内代码
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // 处理有序列表
    html = html.replace(/^\d+\.\s+(.*?)$/gm, '<li>$1</li>');
    
    // 处理无序列表
    html = html.replace(/^-\s+(.*?)$/gm, '<li>$1</li>');
    
    // 包装在段落标签中
    html = `<p>${html}</p>`;
    
    // 清理重复的段落标签
    html = html.replace(/<\/p><p>/g, '</p>\n<p>');
    
    return html;
}

// 模拟AI响应生成（实际项目中应替换为实际AI请求）
function generateAIResponse(userMessage) {
    // 简单模拟，根据用户消息返回预设响应
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('你好') || lowerMessage.includes('嗨') || lowerMessage.includes('hi')) {
        return {
            text: '你好！我是Grove AI助手。我可以帮你回答问题、整理信息、或者帮助你完成任务。有什么我可以帮你的吗？',
            tools: []
        };
    }
    
    if (lowerMessage.includes('功能') || lowerMessage.includes('能做什么')) {
        return {
            text: 'Grove AI Studio提供多种功能：\n\n1. 智能对话：我可以回答问题、提供建议和帮助你思考问题\n2. 知识库：你可以添加文档，然后向其提问\n3. 文件助手：帮助你管理文件和文件夹\n4. 笔记：保存重要信息到笔记中\n5. 本地数据库：存储和查询结构化数据\n\n所有这些都优先在本地运行，注重你的隐私。',
            tools: []
        };
    }
    
    if (lowerMessage.includes('天气')) {
        return {
            text: '根据查询，今天北京天气晴朗，温度23°C，适合户外活动。未来三天预计保持晴好天气，温度在20-25°C之间。',
            tools: [{ name: '天气工具', icon: 'cloud' }]
        };
    }
    
    if (lowerMessage.includes('搜索') || lowerMessage.includes('查找')) {
        return {
            text: '我找到了一些相关信息：\n\n1. 关于你查询的话题，最新研究表明...\n2. 权威网站上提到...\n3. 最近的新闻报道显示...\n\n希望这些信息对你有帮助。需要了解更多细节吗？',
            tools: [{ name: '网络搜索', icon: 'global' }]
        };
    }
    
    // 默认响应
    return {
        text: '我理解你的问题。作为一个AI助手，我会尽力提供准确、有用的信息。你可以尝试询问我关于各种话题的问题，或者让我帮你完成一些任务。',
        tools: []
    };
}

// 初始化应用
document.addEventListener('DOMContentLoaded', init); 