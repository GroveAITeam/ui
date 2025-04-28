/**
 * storage.js
 * 管理应用程序数据的本地存储
 */

// 存储键名
const STORAGE_KEYS = {
    SPACES: 'grove_spaces',
    SESSIONS: 'grove_sessions',
    MESSAGES: 'grove_messages',
    SETTINGS: 'grove_settings'
};

// 初始化本地存储
function initStorage() {
    // 检查空间存储
    if (!localStorage.getItem(STORAGE_KEYS.SPACES)) {
        const defaultSpaces = [
            {
                id: 'default',
                name: '默认空间',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        saveSpaces(defaultSpaces);
    }
    
    // 检查会话存储
    if (!localStorage.getItem(STORAGE_KEYS.SESSIONS)) {
        const defaultSessions = [
            {
                id: 'default_session',
                spaceId: 'default',
                name: '新建会话',
                preview: '开始一个新的对话...',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                modelId: 'gpt-4',
                agentId: 'default'
            }
        ];
        saveSessions(defaultSessions);
    }
    
    // 检查消息存储
    if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
        const defaultMessages = {
            'default_session': [
                {
                    id: 'welcome',
                    sessionId: 'default_session',
                    role: 'system',
                    content: '欢迎使用Grove AI Studio！我是您的AI助手，有什么可以帮您的吗？',
                    createdAt: new Date().toISOString()
                }
            ]
        };
        saveMessages(defaultMessages);
    }
    
    // 检查设置存储
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
        const defaultSettings = {
            theme: 'light',
            defaultModelId: 'gpt-4',
            defaultAgentId: 'default',
            creativity: 50
        };
        saveSettings(defaultSettings);
    }
}

// 空间相关操作
function getSpaces() {
    const spacesJson = localStorage.getItem(STORAGE_KEYS.SPACES);
    return spacesJson ? JSON.parse(spacesJson) : [];
}

function saveSpaces(spaces) {
    localStorage.setItem(STORAGE_KEYS.SPACES, JSON.stringify(spaces));
}

function addSpace(name) {
    const spaces = getSpaces();
    const newSpace = {
        id: 'space_' + Date.now(),
        name: name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    spaces.push(newSpace);
    saveSpaces(spaces);
    return newSpace;
}

function updateSpace(spaceId, updates) {
    const spaces = getSpaces();
    const index = spaces.findIndex(space => space.id === spaceId);
    if (index !== -1) {
        spaces[index] = { 
            ...spaces[index], 
            ...updates, 
            updatedAt: new Date().toISOString() 
        };
        saveSpaces(spaces);
        return spaces[index];
    }
    return null;
}

function deleteSpace(spaceId) {
    const spaces = getSpaces();
    const filteredSpaces = spaces.filter(space => space.id !== spaceId);
    if (filteredSpaces.length < spaces.length) {
        saveSpaces(filteredSpaces);
        
        // 同时删除关联的会话
        const sessions = getSessions();
        const filteredSessions = sessions.filter(session => session.spaceId !== spaceId);
        saveSessions(filteredSessions);
        
        return true;
    }
    return false;
}

// 会话相关操作
function getSessions(spaceId = null) {
    const sessionsJson = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    const sessions = sessionsJson ? JSON.parse(sessionsJson) : [];
    
    if (spaceId) {
        return sessions.filter(session => session.spaceId === spaceId);
    }
    return sessions;
}

function saveSessions(sessions) {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
}

function addSession(spaceId, name = '新建会话', modelId = 'gpt-4', agentId = 'default') {
    const sessions = getSessions();
    const newSession = {
        id: 'session_' + Date.now(),
        spaceId: spaceId,
        name: name,
        preview: '开始一个新的对话...',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        modelId: modelId,
        agentId: agentId
    };
    sessions.push(newSession);
    saveSessions(sessions);
    
    // 为新会话添加默认欢迎消息
    const messages = getAllMessages();
    messages[newSession.id] = [
        {
            id: 'welcome_' + Date.now(),
            sessionId: newSession.id,
            role: 'system',
            content: '欢迎使用Grove AI Studio！我是您的AI助手，有什么可以帮您的吗？',
            createdAt: new Date().toISOString()
        }
    ];
    saveMessages(messages);
    
    return newSession;
}

function getSession(sessionId) {
    const sessions = getSessions();
    return sessions.find(session => session.id === sessionId) || null;
}

function updateSession(sessionId, updates) {
    const sessions = getSessions();
    const index = sessions.findIndex(session => session.id === sessionId);
    if (index !== -1) {
        sessions[index] = { 
            ...sessions[index], 
            ...updates, 
            updatedAt: new Date().toISOString() 
        };
        saveSessions(sessions);
        return sessions[index];
    }
    return null;
}

function deleteSession(sessionId) {
    const sessions = getSessions();
    const filteredSessions = sessions.filter(session => session.id !== sessionId);
    if (filteredSessions.length < sessions.length) {
        saveSessions(filteredSessions);
        
        // 同时删除关联的消息
        const messages = getAllMessages();
        delete messages[sessionId];
        saveMessages(messages);
        
        return true;
    }
    return false;
}

// 消息相关操作
function getAllMessages() {
    const messagesJson = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return messagesJson ? JSON.parse(messagesJson) : {};
}

function getMessages(sessionId) {
    const allMessages = getAllMessages();
    return allMessages[sessionId] || [];
}

function saveMessages(messages) {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
}

function addMessage(sessionId, role, content, tools = []) {
    const allMessages = getAllMessages();
    const sessionMessages = allMessages[sessionId] || [];
    
    const newMessage = {
        id: 'msg_' + Date.now(),
        sessionId: sessionId,
        role: role,
        content: content,
        tools: tools,
        createdAt: new Date().toISOString()
    };
    
    sessionMessages.push(newMessage);
    allMessages[sessionId] = sessionMessages;
    saveMessages(allMessages);
    
    // 更新会话预览和时间戳
    if (role === 'user') {
        updateSession(sessionId, {
            preview: content.length > 50 ? content.substring(0, 47) + '...' : content
        });
    }
    
    return newMessage;
}

// 设置相关操作
function getSettings() {
    const settingsJson = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settingsJson ? JSON.parse(settingsJson) : {};
}

function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

function updateSettings(updates) {
    const settings = getSettings();
    const updatedSettings = { ...settings, ...updates };
    saveSettings(updatedSettings);
    return updatedSettings;
}

// 导出模块
export {
    initStorage,
    getSpaces,
    addSpace,
    updateSpace,
    deleteSpace,
    getSessions,
    getSession,
    addSession,
    updateSession,
    deleteSession,
    getMessages,
    addMessage,
    getSettings,
    updateSettings
}; 