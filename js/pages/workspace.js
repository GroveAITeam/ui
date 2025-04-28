// 导入模块
import { initStorage, getSpaces, addSpace, getSessions, addSession, getMessages, addMessage, getSession, updateSession } from '../storage.js';
import { getAllTools, executeTool, detectToolRequests } from '../tools.js';
import { getAvailableModels, getDefaultModel, creativityToTemperature } from '../models.js';
import { getAvailableAgents, getDefaultAgent, getAgentTools } from '../agents.js';
import { formatMarkdown, getRelativeTime, autoResizeTextarea, scrollToBottom } from '../utils/common.js';

// DOM元素
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-message');
const chatMessages = document.querySelector('.chat-messages');
const addSpaceButton = document.getElementById('add-space');
const addSessionButton = document.getElementById('add-session');
const modelSelect = document.getElementById('model-select');
const agentSelect = document.getElementById('agent-select');
const creativitySlider = document.getElementById('creativity-slider');
const currentSpace = document.getElementById('current-space');
const spaceDropdown = document.getElementById('space-dropdown');

// 应用状态
let currentSpaceId = 'default';
let currentSessionId = 'default_session';

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
    messageInput.addEventListener('input', () => autoResizeTextarea(messageInput));
    
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
    
    // 设置空间选择器点击事件
    setupSpaceSelector();
}

// 设置空间选择器
function setupSpaceSelector() {
    // 点击当前空间显示下拉菜单
    currentSpace.addEventListener('click', () => {
        spaceDropdown.classList.toggle('show');
    });
    
    // 点击页面其他区域关闭下拉菜单
    document.addEventListener('click', (e) => {
        if (!currentSpace.contains(e.target) && !spaceDropdown.contains(e.target)) {
            spaceDropdown.classList.remove('show');
        }
    });
}

// 加载空间列表
function loadSpaces() {
    const spaces = getSpaces();
    // 设置当前空间名称
    const currentSpaceObj = spaces.find(space => space.id === currentSpaceId);
    if (currentSpaceObj) {
        currentSpace.querySelector('span').textContent = currentSpaceObj.name;
    }
    
    // 清空容器
    spaceDropdown.innerHTML = '';
    
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
            // 更新当前空间
            currentSpaceId = space.id;
            currentSpace.querySelector('span').textContent = space.name;
            // 加载该空间的会话
            loadSessions(currentSpaceId);
            // 关闭下拉菜单
            spaceDropdown.classList.remove('show');
        });
        
        // 添加到容器
        spaceDropdown.appendChild(spaceElement);
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
            // 加载该会话
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
        option.selected = model.id === defaultModel.id;
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
        option.selected = agent.id === defaultAgent.id;
        agentSelect.appendChild(option);
    });
}

// 发送消息
async function sendMessage() {
    const messageText = messageInput.value.trim();
    if (!messageText) return;
    
    // 清空输入框
    messageInput.value = '';
    autoResizeTextarea(messageInput);
    
    // 添加用户消息到聊天
    addMessageToChat('user', messageText);
    
    // 添加消息到存储
    addMessage(currentSessionId, {
        role: 'user',
        content: messageText,
        timestamp: new Date().toISOString()
    });
    
    // 添加加载指示器
    addLoadingIndicator();
    
    try {
        // 生成AI响应
        const aiResponse = await generateAIResponse(messageText);
        
        // 移除加载指示器
        removeLoadingIndicator();
        
        // 添加AI响应到聊天
        addMessageToChat('assistant', aiResponse.content, aiResponse.tools);
        
        // 添加消息到存储
        addMessage(currentSessionId, {
            role: 'assistant',
            content: aiResponse.content,
            tools: aiResponse.tools,
            timestamp: new Date().toISOString()
        });
        
        // 更新会话预览
        updateSession(currentSessionId, {
            preview: messageText,
            updatedAt: new Date().toISOString()
        });
        
        // 重新加载会话列表以更新预览和时间
        loadSessions(currentSpaceId);
    } catch (error) {
        console.error('生成AI响应时出错：', error);
        removeLoadingIndicator();
        addMessageToChat('system', '生成响应时发生错误，请重试。');
    }
}

// 加载会话
function loadSession(sessionId) {
    const session = getSession(sessionId);
    if (!session) return;
    
    // 更新标题
    document.title = `Grove AI Studio - ${session.name}`;
    
    // 清空消息容器
    chatMessages.innerHTML = '';
    
    // 加载会话消息
    const messages = getMessages(sessionId);
    messages.forEach(message => {
        addMessageToChat(message.role, message.content, message.tools || []);
    });
    
    // 设置模型和智能体选择器
    if (session.modelId) {
        modelSelect.value = session.modelId;
    }
    
    if (session.agentId) {
        agentSelect.value = session.agentId;
    }
    
    // 滚动到底部
    scrollToBottom(chatMessages);
}

// 添加消息到聊天
function addMessageToChat(sender, text, tools = []) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}`;
    
    // 创建头像和名称
    let avatarIcon, senderName;
    if (sender === 'user') {
        avatarIcon = 'ri-user-line';
        senderName = '用户';
    } else if (sender === 'assistant') {
        avatarIcon = 'ri-robot-line';
        senderName = 'Grove AI';
    } else {
        avatarIcon = 'ri-information-line';
        senderName = '系统';
    }
    
    // 格式化文本
    let formattedText = sender === 'assistant' ? formatMarkdown(text) : text;
    
    // 构建消息HTML
    messageElement.innerHTML = `
        <div class="message-avatar">
            <i class="${avatarIcon}"></i>
        </div>
        <div class="message-content">
            <div class="message-header">
                <span class="message-sender">${senderName}</span>
            </div>
            <div class="message-text">${formattedText}</div>
        </div>
    `;
    
    // 如果有工具使用记录，添加工具结果
    if (tools && tools.length > 0) {
        const toolsContainer = document.createElement('div');
        toolsContainer.className = 'tools-container';
        
        tools.forEach(tool => {
            const toolElement = document.createElement('div');
            toolElement.className = 'tool-usage';
            toolElement.innerHTML = `
                <div class="tool-header">
                    <i class="ri-tools-line"></i>
                    <span>${tool.name}</span>
                </div>
                <div class="tool-result">${formatMarkdown(tool.result)}</div>
            `;
            toolsContainer.appendChild(toolElement);
        });
        
        messageElement.querySelector('.message-content').appendChild(toolsContainer);
    }
    
    // 添加到聊天
    chatMessages.appendChild(messageElement);
    
    // 滚动到底部
    scrollToBottom(chatMessages);
}

// 添加加载指示器
function addLoadingIndicator() {
    const loadingElement = document.createElement('div');
    loadingElement.className = 'message assistant loading';
    loadingElement.innerHTML = `
        <div class="message-avatar">
            <i class="ri-robot-line"></i>
        </div>
        <div class="message-content">
            <div class="typing-indicator">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    chatMessages.appendChild(loadingElement);
    scrollToBottom(chatMessages);
}

// 移除加载指示器
function removeLoadingIndicator() {
    const loadingElement = chatMessages.querySelector('.loading');
    if (loadingElement) {
        chatMessages.removeChild(loadingElement);
    }
}

// 创建新空间
function createNewSpace(name) {
    const spaceId = 'space_' + Date.now();
    addSpace({
        id: spaceId,
        name: name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
    
    // 重新加载空间列表
    loadSpaces();
    
    // 切换到新空间
    currentSpaceId = spaceId;
    loadSessions(spaceId);
}

// 创建新会话
function createNewSession(spaceId) {
    const sessionId = 'session_' + Date.now();
    addSession(spaceId, {
        id: sessionId,
        name: '新会话',
        preview: '开始新的对话',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        modelId: getDefaultModel().id,
        agentId: getDefaultAgent().id
    });
    
    // 重新加载会话列表
    loadSessions(spaceId);
    
    // 切换到新会话
    currentSessionId = sessionId;
    loadSession(sessionId);
}

// 生成AI响应
async function generateAIResponse(userMessage) {
    // 获取当前会话的设置
    const session = getSession(currentSessionId);
    const modelId = session.modelId || getDefaultModel().id;
    const agentId = session.agentId || getDefaultAgent().id;
    const creativity = parseInt(creativitySlider.value);
    
    // 在实际应用中，这里会调用AI服务生成响应
    // 这里使用模拟的响应作为示例
    return new Promise((resolve) => {
        setTimeout(() => {
            const toolsDetected = detectToolRequests(userMessage);
            
            if (toolsDetected.length > 0) {
                // 使用工具
                const toolPromises = toolsDetected.map(tool => executeTool(tool.name, tool.params));
                
                Promise.all(toolPromises).then(toolResults => {
                    const toolsWithResults = toolsDetected.map((tool, i) => ({
                        name: tool.name,
                        params: tool.params,
                        result: toolResults[i]
                    }));
                    
                    resolve({
                        content: `我已经为您执行了所请求的工具。您可以在下方查看结果。还有其他问题吗？`,
                        tools: toolsWithResults
                    });
                });
            } else {
                // 普通回复
                const responses = [
                    "这是一个AI的示例回复。在实际应用中，这里会连接到AI模型生成回复。",
                    "我是Grove AI Studio的助手。我可以帮助您完成各种任务和回答问题。",
                    "您好！我注意到您正在使用Grove AI Studio。这是一个功能强大的AI工作台。",
                    `您提到的"${userMessage}"很有趣。让我思考一下...`,
                    "我可以帮助您编写代码、分析数据、回答问题或者只是聊天。您需要什么帮助？"
                ];
                
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                resolve({
                    content: randomResponse,
                    tools: []
                });
            }
        }, 1000); // 模拟1秒延迟
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init); 