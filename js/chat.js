// 聊天功能模块

/**
 * 初始化聊天界面
 */
export function initChat() {
    setupChatInput();
    setupModelSelect();
    setupAgentSelect();
}

/**
 * 设置聊天输入框和发送功能
 */
function setupChatInput() {
    const chatInput = document.querySelector('.chat-input');
    const sendButton = document.querySelector('.send-button');
    
    if (!chatInput || !sendButton) return;
    
    // 发送按钮点击事件
    sendButton.addEventListener('click', () => {
        sendMessage();
    });
    
    // 输入框按Enter发送（Shift+Enter换行）
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // 自动调整输入框高度
    chatInput.addEventListener('input', () => {
        // 重置高度
        chatInput.style.height = 'auto';
        
        // 计算新高度（根据内容）
        const newHeight = Math.min(chatInput.scrollHeight, 150);
        
        // 设置新高度
        chatInput.style.height = `${newHeight}px`;
    });
}

/**
 * 发送消息
 */
function sendMessage() {
    const chatInput = document.querySelector('.chat-input');
    const chatMessages = document.querySelector('.chat-messages');
    
    if (!chatInput || !chatMessages) return;
    
    const message = chatInput.value.trim();
    
    // 如果消息为空，不发送
    if (!message) return;
    
    // 创建并添加用户消息元素
    const userMessageElement = createUserMessageElement(message);
    chatMessages.appendChild(userMessageElement);
    
    // 清空输入框
    chatInput.value = '';
    chatInput.style.height = 'auto';
    
    // 滚动到底部
    scrollToBottom();
    
    // 模拟AI响应（在实际应用中，这里会调用后端API）
    simulateAIResponse();
}

/**
 * 创建用户消息元素
 * @param {string} message - 消息内容
 * @returns {HTMLElement} - 消息元素
 */
function createUserMessageElement(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message user-message';
    messageElement.textContent = message;
    
    return messageElement;
}

/**
 * 创建AI消息元素
 * @param {string} message - 消息内容
 * @param {string} tool - 使用的工具/智能体（可选）
 * @returns {HTMLElement} - 消息元素
 */
function createAIMessageElement(message, tool = null) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message ai-message';
    
    // 如果指定了工具/智能体，添加工具指示器
    if (tool) {
        const toolIndicator = document.createElement('div');
        toolIndicator.className = 'tool-indicator';
        
        toolIndicator.innerHTML = `
            <i class="bi bi-robot"></i>
            <span>${tool}</span>
        `;
        
        messageElement.appendChild(toolIndicator);
    }
    
    // 添加消息内容
    messageElement.appendChild(document.createTextNode(message));
    
    return messageElement;
}

/**
 * 滚动聊天窗口到底部
 */
function scrollToBottom() {
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

/**
 * 模拟AI响应（仅用于演示）
 */
function simulateAIResponse() {
    const chatMessages = document.querySelector('.chat-messages');
    if (!chatMessages) return;
    
    // 添加加载状态
    const loadingElement = document.createElement('div');
    loadingElement.className = 'message ai-message loading';
    loadingElement.textContent = '...';
    chatMessages.appendChild(loadingElement);
    
    // 滚动到底部
    scrollToBottom();
    
    // 模拟2秒后收到回复
    setTimeout(() => {
        // 移除加载状态
        chatMessages.removeChild(loadingElement);
        
        // 创建回复
        const aiResponse = createAIMessageElement(
            '我已收到你的消息。这是一个演示回复，实际应用中这里会返回真实的AI生成内容。',
            '默认智能体'
        );
        
        // 添加到聊天区域
        chatMessages.appendChild(aiResponse);
        
        // 滚动到底部
        scrollToBottom();
    }, 2000);
}

/**
 * 设置模型选择
 */
function setupModelSelect() {
    const modelSelect = document.getElementById('model-select');
    if (modelSelect) {
        modelSelect.addEventListener('change', () => {
            // 在实际应用中，这里会设置使用的模型
            console.log('模型已更改为:', modelSelect.value);
        });
    }
}

/**
 * 设置智能体选择
 */
function setupAgentSelect() {
    const agentSelect = document.getElementById('agent-select');
    if (agentSelect) {
        agentSelect.addEventListener('change', () => {
            // 在实际应用中，这里会设置使用的智能体
            console.log('智能体已更改为:', agentSelect.value);
        });
    }
} 