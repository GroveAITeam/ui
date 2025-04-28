/**
 * agents.js
 * 管理智能体相关的功能
 */

// 可用智能体列表
const availableAgents = [
    {
        id: 'default',
        name: '默认助手',
        description: '通用智能助手，可回答问题并使用所有可用工具',
        tools: ['all'],
        default: true
    },
    {
        id: 'web',
        name: '网络研究员',
        description: '专注于网络自动化和数据提取的助手',
        tools: ['browser_automation', 'web_content'],
        default: false
    },
    {
        id: 'writer',
        name: '写作助手',
        description: '帮助写作、润色和编辑文本的助手',
        tools: ['notes'],
        default: false
    },
    {
        id: 'file',
        name: '文件管理员',
        description: '帮助管理文件和文件夹的助手',
        tools: ['file_assistant'],
        default: false
    }
];

// 获取可用智能体列表
function getAvailableAgents() {
    return availableAgents;
}

// 获取默认智能体
function getDefaultAgent() {
    return availableAgents.find(agent => agent.default) || availableAgents[0];
}

// 设置默认智能体
function setDefaultAgent(agentId) {
    availableAgents.forEach(agent => {
        agent.default = (agent.id === agentId);
    });
}

// 获取智能体使用的工具
function getAgentTools(agentId) {
    const agent = availableAgents.find(a => a.id === agentId);
    if (!agent) return [];
    
    if (agent.tools.includes('all')) {
        return getAllTools();
    }
    
    return agent.tools;
}

// 获取所有可用工具
function getAllTools() {
    return [
        'web_search',
        'web_content',
        'notes',
        'file_assistant',
        'weather',
        'map',
        'database'
    ];
}

// 导出模块
export {
    getAvailableAgents,
    getDefaultAgent,
    setDefaultAgent,
    getAgentTools,
    getAllTools
}; 