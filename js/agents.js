/**
 * agents.js
 * 管理智能体相关的功能
 */

// 可用智能体列表
const availableAgents = [
    {
        id: 'default',
        name: '默认助手',
        description: '通用智能助手，可调用所有本地工具箱及已启用的在线工具箱，拥有基础的两层交互能力。适合日常问答、文件管理、网络搜索等多种场景。',
        tools: ['all'],
        default: true,
        icon: 'ri-robot-line',
        status: 'active',
        interactionLevels: 2,
        interactionDescription: '当智能体需要使用工具时，会先征得您的同意。对于可能影响系统或数据的操作，会显示详细操作计划并请求您确认。'
    }
    // 其他智能体设置为开发中状态，在UI中会显示为"即将推出"
];

// 智能体工具说明
const toolDescriptions = {
    'web_search': '网络搜索 - 从互联网获取最新信息',
    'web_content': '网页内容提取 - 分析和提取网页内容',
    'browser_automation': '浏览器自动化 - 模拟浏览器操作',
    'notes': '笔记 - 创建和管理笔记内容',
    'file_assistant': '文件助手 - 文件和文件夹管理',
    'weather': '天气 - 获取天气信息',
    'map': '地图 - 位置查询和路线规划',
    'database': '数据库 - 结构化数据存储和查询',
    'knowledge_base': '知识库 - 从本地文档获取信息'
};

// 获取可用智能体列表
function getAvailableAgents() {
    return availableAgents.filter(agent => agent.status === 'active');
}

// 获取开发中的智能体列表
function getUpcomingAgents() {
    return availableAgents.filter(agent => agent.status === 'upcoming');
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
        const allTools = getAllTools();
        return allTools.map(toolId => {
            return {
                id: toolId,
                name: toolDescriptions[toolId] || toolId
            };
        });
    }
    
    return agent.tools.map(toolId => {
        return {
            id: toolId,
            name: toolDescriptions[toolId] || toolId
        };
    });
}

// 获取所有可用工具
function getAllTools() {
    return [
        'web_search',
        'web_content',
        'browser_automation',
        'notes',
        'file_assistant',
        'weather',
        'map',
        'database',
        'knowledge_base'
    ];
}

// 模拟工具调用流程（在实际应用中会更复杂）
function simulateToolCall(agentId, query, toolId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                thinking: `分析您的请求"${query}"，我认为需要使用${toolDescriptions[toolId]}工具`,
                toolRequest: `我需要使用${toolDescriptions[toolId]}工具来完成您的请求，是否允许？`,
                result: `使用${toolDescriptions[toolId]}工具的结果`,
                response: `基于工具结果，我可以告诉您...`
            });
        }, 1500);
    });
}

// 导出模块
export {
    getAvailableAgents,
    getUpcomingAgents,
    getDefaultAgent,
    setDefaultAgent,
    getAgentTools,
    getAllTools,
    simulateToolCall
}; 