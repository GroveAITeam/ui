// 导入工具定义
import { getAllTools } from '../tools.js';

// DOM元素
const toolIcon = document.getElementById('tool-icon');
const toolName = document.getElementById('tool-name');
const toolDescription = document.getElementById('tool-description');
const toolDocs = document.getElementById('tool-docs');
const configForm = document.getElementById('config-form');
const toolGuide = document.getElementById('tool-guide');
const backLink = document.getElementById('back-link');
const saveBtn = document.getElementById('save-btn');

// 工具配置指南
const toolGuides = {
    baidu_search: {
        title: '百度AI搜索配置指南',
        steps: [
            '1. 访问百度智能云控制台',
            '2. 创建应用并获取API Key',
            '3. 在应用详情页面找到API URL'
        ]
    },
    baidu_map: {
        title: '百度地图配置指南',
        steps: [
            '1. 访问百度地图开放平台',
            '2. 注册开发者账号',
            '3. 创建应用并获取API Key'
        ]
    },
    baidu_netdisk: {
        title: '百度网盘配置指南',
        steps: [
            '1. 访问百度网盘开放平台',
            '2. 注册开发者账号',
            '3. 创建应用并获取API Key'
        ]
    },
    media_generator: {
        title: 'MiniMax配置指南',
        steps: [
            '1. 访问MiniMax开发者平台',
            '2. 注册账号并创建项目',
            '3. 在项目设置中获取API Key'
        ]
    },
    flomo: {
        title: 'Flomo配置指南',
        steps: [
            '1. 登录Flomo账号',
            '2. 访问API设置页面',
            '3. 生成并复制API Token'
        ]
    },
    alipay: {
        title: '支付宝配置指南',
        steps: [
            '1. 访问支付宝开放平台',
            '2. 注册开发者账号',
            '3. 创建应用并获取APP ID和Key'
        ]
    },
    weather: {
        title: '天气服务配置指南',
        steps: [
            '1. 访问和风天气开发平台',
            '2. 注册账号并实名认证',
            '3. 创建应用并获取API Key'
        ]
    }
};

// 获取URL参数中的工具ID
const urlParams = new URLSearchParams(window.location.search);
const toolId = urlParams.get('id');

// 初始化
async function init() {
    if (!toolId) {
        alert('未指定工具ID');
        window.location.href = 'online-tools.html';
        return;
    }

    const tools = getAllTools();
    const tool = tools[toolId];
    
    if (!tool) {
        alert('工具不存在');
        window.location.href = 'online-tools.html';
        return;
    }

    // 设置返回链接
    backLink.href = tool.category === 'online' ? 'online-tools.html' : 'local-tools.html';

    // 加载工具基本信息
    loadToolInfo(tool);
    
    // 加载工具配置
    loadToolConfig(toolId);
    
    // 加载操作指南
    loadToolGuide(toolId);
    
    // 绑定事件
    bindEvents(toolId);
}

// 加载工具基本信息
function loadToolInfo(tool) {
    toolIcon.className = `ri-${tool.icon}`;
    toolName.textContent = tool.name;
    toolDescription.textContent = tool.description;
    
    // 加载文档内容
    const docs = toolDocs[toolId] || {
        description: tool.description,
        features: []
    };
    
    toolDocs.innerHTML = `
        <div class="doc-section">
            <p>${docs.description}</p>
        </div>
        ${docs.features.length > 0 ? `
        <div class="doc-section">
            <h4>主要特性</h4>
            <ul>
                ${docs.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
    `;
}

// 加载工具配置
function loadToolConfig(toolId) {
    const config = toolConfigForms[toolId];
    if (!config) {
        configForm.innerHTML = '<p class="no-config">此工具无需配置</p>';
        return;
    }
    
    // 从localStorage加载已保存的配置
    const savedConfig = JSON.parse(localStorage.getItem(`tool_config_${toolId}`) || '{}');
    
    // 生成配置表单
    configForm.innerHTML = config.fields.map(field => `
        <div class="form-group">
            <label for="${field.name}">${field.label}</label>
            <input
                type="${field.type}"
                id="${field.name}"
                name="${field.name}"
                placeholder="${field.placeholder}"
                value="${savedConfig[field.name] || ''}"
                ${field.required ? 'required' : ''}
            >
        </div>
    `).join('');
}

// 加载操作指南
function loadToolGuide(toolId) {
    const guide = toolGuides[toolId];
    if (!guide) {
        toolGuide.innerHTML = '<p class="no-guide">暂无配置指南</p>';
        return;
    }
    
    toolGuide.innerHTML = `
        <div class="guide-section">
            <h4>${guide.title}</h4>
            <ol>
                ${guide.steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
        </div>
    `;
}

// 绑定事件
function bindEvents(toolId) {
    // 保存配置
    configForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(configForm);
        const config = {};
        
        for (const [key, value] of formData.entries()) {
            config[key] = value;
        }
        
        localStorage.setItem(`tool_config_${toolId}`, JSON.stringify(config));
        alert('配置已保存');
        
        // 返回工具箱页面
        window.location.href = backLink.href;
    });
}

// 初始化页面
init(); 