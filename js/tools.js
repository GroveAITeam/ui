/**
 * tools.js
 * 管理AI可使用的工具
 */

// 工具定义
const tools = {
    // 本地工具
    'web_content': {
        name: '网络助手',
        description: '获取指定URL的网页内容',
        icon: 'global',
        category: 'local',
        func: async (url) => {
            // 实际实现中，这会调用后端API来获取网页内容
            console.log(`获取网页内容: ${url}`);
            return `这是从 ${url} 获取的模拟内容。在实际实现中，这将是真实的网页内容。`;
        }
    },
    'notes': {
        name: '笔记工具',
        description: '保存笔记到本地',
        icon: 'file-text',
        category: 'local',
        func: async (title, content) => {
            // 实际实现中，这会将笔记保存到本地存储
            console.log(`保存笔记: ${title}`);
            return `笔记"${title}"已保存。`;
        }
    },
    'file_assistant': {
        name: '文件助手',
        description: '管理本地文件和文件夹',
        icon: 'folder',
        category: 'local',
        func: async (operation, path, params) => {
            // 实际实现中，这会通过后端API操作文件系统
            console.log(`文件操作: ${operation}, 路径: ${path}`);
            return `文件操作"${operation}"已执行。`;
        }
    },
    'database': {
        name: '本地数据库',
        description: '存储和检索结构化数据',
        icon: 'database',
        category: 'local',
        func: async (operation, table, data) => {
            // 实际实现中，这会通过后端API操作本地数据库
            console.log(`数据库操作: ${operation}, 表: ${table}`);
            return `数据库操作"${operation}"已执行。`;
        }
    },
    
    // 在线工具
    'web_search': {
        name: '网络搜索',
        description: '在互联网上搜索信息',
        icon: 'search',
        category: 'online',
        func: async (query) => {
            // 实际实现中，这会调用搜索API
            console.log(`执行搜索: ${query}`);
            return `这是关于"${query}"的模拟搜索结果。在实际实现中，这将是真实的搜索结果。`;
        }
    },
    'weather': {
        name: '天气工具',
        description: '获取指定位置的天气信息',
        icon: 'cloud',
        category: 'online',
        func: async (location) => {
            // 实际实现中，这会调用天气API
            console.log(`获取天气: ${location}`);
            return `${location}今天晴朗，温度23°C，适合户外活动。这是模拟的天气数据。`;
        }
    },
    'map': {
        name: '地图工具',
        description: '获取地点信息或路线',
        icon: 'map',
        category: 'online',
        func: async (location, queryType) => {
            // 实际实现中，这会调用地图API
            console.log(`地图查询: ${queryType} for ${location}`);
            return `已找到${location}的${queryType}信息。这是模拟的地图数据。`;
        }
    }
};

// 获取所有工具
function getAllTools() {
    return tools;
}

// 获取工具列表（按类别分组）
function getToolsByCategory() {
    const result = {
        local: [],
        online: []
    };
    
    for (const [id, tool] of Object.entries(tools)) {
        result[tool.category].push({
            id,
            name: tool.name,
            description: tool.description,
            icon: tool.icon
        });
    }
    
    return result;
}

// 执行工具
async function executeTool(toolId, ...args) {
    if (tools[toolId]) {
        try {
            return await tools[toolId].func(...args);
        } catch (error) {
            console.error(`执行工具 ${toolId} 时出错:`, error);
            return `执行工具时出错: ${error.message}`;
        }
    } else {
        return `找不到工具: ${toolId}`;
    }
}

// 检测文本中的工具请求
function detectToolRequests(text) {
    // 这是一个简化的实现，实际中可能需要更复杂的检测逻辑
    const requests = [];
    
    if (text.includes('搜索') || text.includes('查找')) {
        requests.push({
            tool: 'web_search',
            args: [text.replace(/.*搜索|查找\s*/, '').trim()]
        });
    }
    
    if (text.includes('天气')) {
        const locationMatch = text.match(/(.{2,10}的)*天气/);
        const location = locationMatch ? locationMatch[1]?.replace('的', '') : '北京';
        requests.push({
            tool: 'weather',
            args: [location || '北京']
        });
    }
    
    return requests;
}

// 导出模块
export {
    getAllTools,
    getToolsByCategory,
    executeTool,
    detectToolRequests
}; 