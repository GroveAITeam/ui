/**
 * tools.js
 * 管理AI可使用的工具
 */

// 工具定义
const tools = {
    // 本地工具
    'knowledge_base': {
        name: '知识库',
        description: '从本地知识库中检索信息',
        icon: 'book-open',
        category: 'local',
        func: async (query, knowledgeBaseId) => {
            // 实际实现中，这会调用后端API来检索本地知识库
            console.log(`从知识库检索: ${query}, 知识库ID: ${knowledgeBaseId || '默认'}`);
            return `这是关于"${query}"的模拟知识库响应。在实际实现中，这将是从知识库中检索的真实内容。`;
        }
    },
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
    'browser_automation': {
        name: '浏览器自动化',
        description: '基于Playwright的无障碍树的浏览器自动化工具',
        icon: 'chrome-line',
        category: 'online',
        func: async (action, params) => {
            // 实际实现中，这会调用浏览器自动化API
            console.log(`执行浏览器自动化: ${action}`, params);
            return `浏览器自动化操作"${action}"已执行。`;
        },
        actions: {
            // 基于快照的交互
            browser_click: '点击网页元素',
            browser_hover: '悬停在网页元素上',
            browser_drag: '拖放操作',
            browser_type: '在可编辑元素中输入文本',
            browser_select_option: '选择下拉选项',
            browser_snapshot: '捕获当前页面的无障碍快照',
            browser_take_screenshot: '截取当前页面的截图',
            // 基于视觉的交互
            browser_screen_move_mouse: '移动鼠标到指定位置',
            browser_screen_capture: '截取当前页面的截图',
            browser_screen_click: '点击鼠标左键',
            browser_screen_drag: '拖拽鼠标左键',
            browser_screen_type: '输入文本',
            browser_press_key: '按下键盘按键',
            // 标签管理
            browser_tab_list: '列出浏览器标签',
            browser_tab_new: '打开新标签',
            browser_tab_select: '选择标签',
            browser_tab_close: '关闭标签',
            // 导航
            browser_navigate: '导航到指定URL',
            browser_navigate_back: '返回上一页',
            browser_navigate_forward: '前进到下一页',
            // 文件和媒体
            browser_file_upload: '上传文件',
            browser_pdf_save: '将页面保存为PDF',
            // 实用工具
            browser_wait: '等待指定时间',
            browser_close: '关闭页面',
            browser_install: '安装浏览器'
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
    },
    // 新增工具
    'baidu_search': {
        name: '百度AI搜索',
        description: '使用百度AI搜索引擎进行智能搜索',
        icon: 'search-line',
        category: 'online',
        func: async (query) => {
            console.log(`百度AI搜索: ${query}`);
            return `搜索结果将在这里显示。需要配置百度AI搜索API。`;
        }
    },
    'baidu_map': {
        name: '百度地图位置服务',
        description: '获取位置信息、导航和地理编码服务',
        icon: 'map-pin-line',
        category: 'online',
        func: async (action, params) => {
            console.log(`百度地图服务: ${action}`, params);
            return `地图服务结果将在这里显示。需要配置百度地图API Key。`;
        }
    },
    'baidu_netdisk': {
        name: '百度网盘',
        description: '访问和管理百度网盘文件',
        icon: 'cloud-line',
        category: 'online',
        func: async (action, params) => {
            console.log(`百度网盘操作: ${action}`, params);
            return `网盘操作结果将在这里显示。需要配置百度网盘API。`;
        }
    },
    'media_generator': {
        name: '多媒体内容生成',
        description: '生成文本、语音、图像和视频内容',
        icon: 'movie-line',
        category: 'online',
        func: async (type, params) => {
            console.log(`生成${type}内容:`, params);
            return `生成的内容将在这里显示。需要配置MiniMax-MCP API。`;
        }
    },
    'flomo': {
        name: 'Flomo',
        description: '快速记录想法和笔记',
        icon: 'sticky-note-line',
        category: 'online',
        func: async (content) => {
            console.log(`保存到Flomo: ${content}`);
            return `笔记已保存。需要配置Flomo API。`;
        }
    },
    'alipay': {
        name: '支付宝',
        description: '处理支付和转账',
        icon: 'wallet-line',
        category: 'online',
        func: async (action, params) => {
            console.log(`支付宝操作: ${action}`, params);
            return `支付操作结果将在这里显示。需要配置支付宝API。`;
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