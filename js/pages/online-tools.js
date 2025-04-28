// 导入模块
import { getAllTools } from '../tools.js';

// DOM元素
const toolsContainer = document.querySelector('.tools-container');
const modal = document.querySelector('#tool-config-modal');
const modalTitle = modal.querySelector('.modal-header h3');
const modalBody = modal.querySelector('.modal-body');
const toolDocsElement = modalBody.querySelector('.tool-docs');
const toolConfigForm = modalBody.querySelector('.tool-config-form');
const closeBtn = modal.querySelector('.close-btn');
const cancelBtn = modal.querySelector('[data-action="cancel"]');
const saveBtn = modal.querySelector('[data-action="save"]');

// 工具文档定义
const toolDocs = {
    baidu_search: {
        title: '百度AI搜索',
        description: '使用百度AI搜索引擎进行智能搜索，支持自然语言理解和语义分析。',
        features: [
            '智能语义理解',
            '多模态搜索支持',
            '个性化搜索结果'
        ],
        privacyInfo: '搜索查询和相关上下文将发送至百度服务器进行处理。',
        apiDocUrl: 'https://cloud.baidu.com/doc/BAIDU_SEARCH/index.html'
    },
    baidu_map: {
        title: '百度地图位置服务',
        description: '提供地理编码、导航路线规划、周边搜索等位置服务。',
        features: [
            '地理编码和反地理编码',
            '实时路线规划',
            '周边兴趣点搜索'
        ],
        privacyInfo: '位置信息和搜索查询将发送至百度地图服务器。',
        apiDocUrl: 'https://lbsyun.baidu.com/index.php?title=webapi'
    },
    baidu_netdisk: {
        title: '百度网盘',
        description: '访问和管理百度网盘中的文件，支持文件上传、下载和分享。',
        features: [
            '文件上传和下载',
            '文件管理和分享',
            '文件预览'
        ],
        privacyInfo: '文件操作将通过百度网盘服务器进行。',
        apiDocUrl: 'https://pan.baidu.com/union/doc'
    },
    media_generator: {
        title: '多媒体内容生成',
        description: '基于MiniMax-MCP的多模态内容生成服务，支持文本、语音、图像和视频生成。',
        features: [
            '文本生成和改写',
            '语音合成和克隆',
            '图像和视频生成'
        ],
        privacyInfo: '生成请求和相关内容将发送至MiniMax服务器处理。',
        apiDocUrl: 'https://api.minimax.chat/document'
    },
    flomo: {
        title: 'Flomo',
        description: '快速记录想法和笔记的工具，支持标签组织和API集成。',
        features: [
            '快速笔记记录',
            '标签管理',
            'Markdown支持'
        ],
        privacyInfo: '笔记内容将同步至Flomo服务器。',
        apiDocUrl: 'https://flomoapp.com/api'
    },
    alipay: {
        title: '支付宝',
        description: '集成支付宝支付和转账功能，提供安全可靠的支付服务。',
        features: [
            '在线支付',
            '转账功能',
            '交易记录查询'
        ],
        privacyInfo: '支付信息将通过支付宝安全通道处理。',
        apiDocUrl: 'https://opendocs.alipay.com'
    },
    weather: {
        title: '天气服务',
        description: '获取实时天气信息和天气预报数据。',
        features: [
            '实时天气查询',
            '天气预报',
            '空气质量指数'
        ],
        privacyInfo: '位置信息将用于获取对应地区的天气数据。',
        apiDocUrl: 'https://dev.qweather.com'
    }
};

// 工具配置表单定义
const toolConfigForms = {
    baidu_search: {
        title: '百度AI搜索配置',
        fields: [
            {
                name: 'api_url',
                label: 'API URL',
                type: 'text',
                placeholder: '请输入百度AI搜索API的URL',
                required: true
            }
        ]
    },
    baidu_map: {
        title: '百度地图位置服务配置',
        fields: [
            {
                name: 'api_key',
                label: 'API Key',
                type: 'password',
                placeholder: '请输入百度地图API Key',
                required: true
            }
        ]
    },
    baidu_netdisk: {
        title: '百度网盘配置',
        fields: [
            {
                name: 'api_url',
                label: 'API URL',
                type: 'text',
                placeholder: '请输入百度网盘API的URL',
                required: true
            }
        ]
    },
    media_generator: {
        title: '多媒体内容生成配置',
        fields: [
            {
                name: 'api_url',
                label: 'API URL',
                type: 'text',
                placeholder: '请输入MiniMax-MCP API的URL',
                required: true
            }
        ]
    },
    flomo: {
        title: 'Flomo配置',
        fields: [
            {
                name: 'api_url',
                label: 'API URL',
                type: 'text',
                placeholder: '请输入Flomo API的URL',
                required: true
            }
        ]
    },
    alipay: {
        title: '支付宝配置',
        fields: [
            {
                name: 'app_id',
                label: 'APP ID',
                type: 'text',
                placeholder: '请输入支付宝APP ID',
                required: true
            },
            {
                name: 'app_key',
                label: 'APP Key',
                type: 'password',
                placeholder: '请输入支付宝APP Key',
                required: true
            }
        ]
    },
    weather: {
        title: '天气服务配置',
        fields: [
            {
                name: 'api_url',
                label: 'API URL',
                type: 'text',
                placeholder: '请输入天气API的URL',
                required: true
            }
        ]
    }
};

// 工具配置和启用状态存储
let toolConfigs = {};
let enabledTools = {};

// 初始化
function init() {
    // 从localStorage加载配置
    loadToolConfigs();
    loadEnabledTools();
    // 加载工具列表
    loadTools();
    // 绑定事件
    bindEvents();
}

// 加载工具配置
function loadToolConfigs() {
    const savedConfigs = localStorage.getItem('toolConfigs');
    if (savedConfigs) {
        toolConfigs = JSON.parse(savedConfigs);
    }
}

// 加载已启用的工具
function loadEnabledTools() {
    const savedEnabled = localStorage.getItem('enabledTools');
    if (savedEnabled) {
        enabledTools = JSON.parse(savedEnabled);
    }
}

// 保存工具配置
function saveToolConfigs() {
    localStorage.setItem('toolConfigs', JSON.stringify(toolConfigs));
}

// 保存已启用的工具
function saveEnabledTools() {
    localStorage.setItem('enabledTools', JSON.stringify(enabledTools));
}

// 加载工具列表
function loadTools() {
    const tools = getAllTools();
    const onlineTools = Object.entries(tools).filter(([_, tool]) => tool.category === 'online');
    
    // 清空容器
    toolsContainer.innerHTML = '';
    
    if (onlineTools.length === 0) {
        toolsContainer.innerHTML = '<div class="empty-state">没有可用的在线工具</div>';
        return;
    }
    
    // 添加工具卡片
    onlineTools.forEach(([id, tool]) => {
        const isConfigured = toolConfigs[id] && Object.keys(toolConfigs[id]).length > 0;
        const isEnabled = enabledTools[id] || false;
        
        const toolCard = document.createElement('div');
        toolCard.className = 'tool-card';
        toolCard.dataset.id = id;
        toolCard.innerHTML = `
            <div class="tool-icon">
                <i class="ri-${tool.icon}"></i>
                ${isConfigured ? '<span class="configured-badge"><i class="ri-check-line"></i></span>' : ''}
            </div>
            <div class="tool-info">
                <h3>${tool.name}</h3>
                <p>${tool.description}</p>
            </div>
            <div class="enable-switch">
                <label class="switch">
                    <input type="checkbox" ${isEnabled ? 'checked' : ''} ${!isConfigured ? 'disabled' : ''}>
                    <span class="switch-slider"></span>
                </label>
            </div>
        `;
        
        toolsContainer.appendChild(toolCard);
    });
}

// 绑定事件
function bindEvents() {
    // 工具卡片点击事件
    toolsContainer.addEventListener('click', (e) => {
        const toolCard = e.target.closest('.tool-card');
        if (!toolCard) return;
        
        const toolId = toolCard.dataset.id;
        const switchEl = e.target.closest('.switch');
        
        if (switchEl) {
            // 点击了启用开关
            e.stopPropagation();
            const checkbox = switchEl.querySelector('input');
            if (!checkbox.disabled) {
                toggleTool(toolId, checkbox.checked);
            }
        } else {
            // 点击了卡片其他部分
            openToolConfig(toolId);
        }
    });
    
    // 模态框关闭事件
    [closeBtn, cancelBtn].forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // 保存配置事件
    saveBtn.addEventListener('click', saveToolConfig);
}

// 切换工具启用状态
function toggleTool(toolId, enabled) {
    enabledTools[toolId] = enabled;
    saveEnabledTools();
    loadTools(); // 刷新显示
}

// 打开工具配置
function openToolConfig(toolId) {
    const tool = getAllTools()[toolId];
    const config = toolConfigForms[toolId];
    const docs = toolDocs[toolId];
    if (!tool || !config || !docs) return;
    
    modalTitle.textContent = config.title;
    
    // 生成文档内容
    toolDocsElement.innerHTML = `
        <div class="doc-section">
            <h4>功能介绍</h4>
            <p>${docs.description}</p>
        </div>
        <div class="doc-section">
            <h4>主要特性</h4>
            <ul>
                ${docs.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        </div>
        <div class="doc-section">
            <h4>隐私说明</h4>
            <p>${docs.privacyInfo}</p>
        </div>
        <div class="doc-section">
            <a href="${docs.apiDocUrl}" target="_blank" class="api-doc-link">
                <i class="ri-file-text-line"></i>
                <span>查看完整API文档</span>
            </a>
        </div>
    `;
    
    // 生成配置表单
    toolConfigForm.innerHTML = config.fields.map(field => `
        <div class="form-group">
            <label for="${field.name}">${field.label}</label>
            <input
                type="${field.type}"
                id="${field.name}"
                name="${field.name}"
                placeholder="${field.placeholder}"
                value="${toolConfigs[toolId]?.[field.name] || ''}"
                ${field.required ? 'required' : ''}
            >
        </div>
    `).join('');
    
    // 保存当前工具ID
    modal.dataset.toolId = toolId;
    
    // 显示模态框
    modal.classList.add('active');
}

// 关闭模态框
function closeModal() {
    modal.classList.remove('active');
    delete modal.dataset.toolId;
}

// 保存工具配置
function saveToolConfig() {
    const toolId = modal.dataset.toolId;
    if (!toolId) return;
    
    const formData = {};
    const inputs = toolConfigForm.querySelectorAll('input');
    
    // 收集表单数据
    inputs.forEach(input => {
        formData[input.name] = input.value.trim();
    });
    
    // 验证必填字段
    const config = toolConfigForms[toolId];
    const requiredFields = config.fields.filter(f => f.required).map(f => f.name);
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
        alert(`请填写以下必填字段：${missingFields.join(', ')}`);
        return;
    }
    
    // 保存配置
    toolConfigs[toolId] = formData;
    saveToolConfigs();
    
    // 重新加载工具列表
    loadTools();
    
    // 关闭模态框
    closeModal();
}

// 运行工具
function runTool(toolId) {
    const tool = getAllTools()[toolId];
    if (!tool) return;
    
    console.log(`运行在线工具: ${tool.name}`);
    // 在实际应用中，这里会打开工具运行界面或执行工具逻辑
    alert(`正在运行在线工具: ${tool.name}\n\n这个功能在实际应用中会执行工具的逻辑。`);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init); 