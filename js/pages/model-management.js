// 导入模块
import { getAvailableModels, getDefaultModel } from '../models.js';

// DOM元素
const settingsContent = document.querySelector('.settings-content');
const settingsTabs = document.querySelectorAll('.settings-tab');
const settingsTabContents = document.querySelectorAll('.settings-tab-content');
const modelSubtabs = document.querySelectorAll('.model-subtab');
const modelSubtabContents = document.querySelectorAll('.model-subtab-content');
const onlineModelsContainer = document.getElementById('online-models-container');
const offlineModelsContainer = document.getElementById('offline-models-container');
const hfModelsContainer = document.getElementById('hf-models-container');
const vectorModelsContainer = document.getElementById('vector-models-container');
const addOnlineModelBtn = document.getElementById('add-online-model');
const downloadModelBtn = document.getElementById('download-model');
const importLocalModelBtn = document.getElementById('import-local-model');
const importVectorModelBtn = document.getElementById('import-vector-model');
const hfSearchInput = document.getElementById('hf-model-search');
const hfSearchBtn = document.getElementById('hf-search-model-btn');
const showDownloadsBtn = document.getElementById('show-downloads');
const downloadCountElement = document.getElementById('download-count');
const editModelPathBtn = document.getElementById('edit-model-path');
const offlineModelTabs = document.querySelectorAll('.offline-model-tab');
const offlineModelTabContents = document.querySelectorAll('.offline-model-tab-content');

// 模拟数据 - 在线模型
let onlineModels = [
    { id: 'openai-gpt4', name: 'OpenAI GPT-4', provider: 'openai', modelId: 'gpt-4', apiKey: '••••••••••••••••••••••••••••••' },
    { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'claude', modelId: 'claude-3-opus-20240229', apiKey: '••••••••••••••••••••••••••••••' },
    { id: 'minimax-abab5', name: '贤者 ABAB5.5', provider: 'minimax', modelId: 'abab5.5-chat', apiKey: '••••••••••••••••••••••••••••••' }
];

// 模拟数据 - 离线模型
let offlineModels = [
    { id: 'llama3-8b', name: 'LLaMA 3 8B', source: 'downloaded', size: '4.8GB', ramRequired: '8GB' },
    { id: 'qwen2-7b', name: 'Qwen2 7B', source: 'imported', size: '4.2GB', ramRequired: '6GB' }
];

// 模拟数据 - 向量模型
let vectorModel = {
    name: 'Qwen Embeddings v3',
    status: 'downloaded',
    hash: 'f813131e-a702-4131-9b7b-a882f41a7a12'
};

// 初始化函数
function init() {
    // 设置选项卡导航
    setupTabNavigation();
    
    // 设置模型子选项卡导航
    setupModelSubtabNavigation();
    
    // 设置离线模型选项卡导航
    setupOfflineModelTabNavigation();
    
    // 加载在线模型列表
    loadOnlineModels();
    
    // 加载离线模型列表
    loadOfflineModels();
    
    // 加载向量模型信息
    loadVectorModel();
    
    // 设置按钮事件监听
    setupButtonListeners();
}

// 设置选项卡导航
function setupTabNavigation() {
    // 主选项卡
    settingsTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 获取目标选项卡ID
            const targetTab = tab.getAttribute('data-tab');
            
            // 更新活动选项卡样式
            settingsTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 更新活动内容
            settingsTabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetTab) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// 设置模型子选项卡导航
function setupModelSubtabNavigation() {
    modelSubtabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 获取目标子选项卡ID
            const targetSubtab = tab.getAttribute('data-subtab');
            
            // 更新活动子选项卡样式
            modelSubtabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 更新活动子内容
            modelSubtabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetSubtab) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// 设置离线模型选项卡导航
function setupOfflineModelTabNavigation() {
    offlineModelTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 获取目标选项卡ID
            const targetTab = tab.getAttribute('data-offlinetab');
            
            // 更新活动选项卡样式
            offlineModelTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 更新活动内容
            offlineModelTabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetTab) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// 加载在线模型列表
function loadOnlineModels() {
    if (!onlineModelsContainer) return;
    
    // 清空容器
    onlineModelsContainer.innerHTML = '';
    
    // 添加每个在线模型
    onlineModels.forEach(model => {
        const modelCard = document.createElement('div');
        modelCard.className = 'model-card';
        
        modelCard.innerHTML = `
            <div class="model-info">
                <h3>${model.name}</h3>
                <div class="model-details">
                    <div class="model-detail-item">
                        <i class="ri-cloud-line"></i>
                        <span>提供商: ${model.provider}</span>
                    </div>
                    <div class="model-detail-item">
                        <i class="ri-fingerprint-line"></i>
                        <span>模型ID: ${model.modelId}</span>
                    </div>
                    <div class="model-detail-item">
                        <i class="ri-key-line"></i>
                        <span>API密钥: ${model.apiKey}</span>
                    </div>
                </div>
            </div>
            <div class="model-actions">
                <button class="edit-model-btn" data-id="${model.id}">
                    <i class="ri-edit-line"></i>
                </button>
                <button class="delete-model-btn" data-id="${model.id}">
                    <i class="ri-delete-bin-line"></i>
                </button>
            </div>
        `;
        
        // 添加到容器
        onlineModelsContainer.appendChild(modelCard);
    });
}

// 加载离线模型列表
function loadOfflineModels() {
    if (!offlineModelsContainer) return;
    
    // 清空容器
    offlineModelsContainer.innerHTML = '';
    
    // 添加每个离线模型
    offlineModels.forEach(model => {
        const modelCard = document.createElement('div');
        modelCard.className = 'model-card';
        
        modelCard.innerHTML = `
            <div class="model-info">
                <h3>${model.name}</h3>
                <div class="model-details">
                    <div class="model-detail-item">
                        <i class="ri-hard-drive-line"></i>
                        <span>来源: ${model.source === 'downloaded' ? '下载' : '导入'}</span>
                    </div>
                    <div class="model-detail-item">
                        <i class="ri-file-line"></i>
                        <span>大小: ${model.size}</span>
                    </div>
                    <div class="model-detail-item">
                        <i class="ri-cpu-line"></i>
                        <span>所需内存: ${model.ramRequired}</span>
                    </div>
                </div>
            </div>
            <div class="model-actions">
                <button class="delete-model-btn" data-id="${model.id}">
                    <i class="ri-delete-bin-line"></i>
                </button>
            </div>
        `;
        
        // 添加到容器
        offlineModelsContainer.appendChild(modelCard);
    });
}

// 加载向量模型信息
function loadVectorModel() {
    if (!vectorModelsContainer) return;
    
    // 清空容器
    vectorModelsContainer.innerHTML = '';
    
    if (!vectorModel) {
        // 显示空状态
        vectorModelsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon"><i class="ri-bubble-chart-line"></i></div>
                <h3>暂无向量模型</h3>
                <p>向量模型用于知识库文档的搜索和检索功能</p>
            </div>
        `;
        return;
    }
    
    // 创建向量模型卡片
    const vectorModelCard = document.createElement('div');
    vectorModelCard.className = 'vector-model-card';
    
    vectorModelCard.innerHTML = `
        <div class="vector-model-info">
            <h3>${vectorModel.name}</h3>
            <div class="vector-model-description">
                <div class="model-detail-item">
                    <i class="ri-checkbox-circle-line"></i>
                    <span>状态: ${getVectorModelStatusName(vectorModel.status)}</span>
                </div>
                <div class="model-detail-item">
                    <i class="ri-fingerprint-line"></i>
                    <span>模型ID: ${vectorModel.hash}</span>
                </div>
            </div>
        </div>
    `;
    
    vectorModelsContainer.appendChild(vectorModelCard);
}

// 获取向量模型状态名称
function getVectorModelStatusName(status) {
    const statusNames = {
        'downloaded': '已下载',
        'imported': '已导入',
        'downloading': '下载中',
        'failed': '下载失败'
    };
    return statusNames[status] || status;
}

// 设置按钮事件监听
function setupButtonListeners() {
    // 添加在线模型按钮
    if (addOnlineModelBtn) {
        addOnlineModelBtn.addEventListener('click', () => {
            showAddOnlineModelModal();
        });
    }
    
    // 下载模型按钮
    if (downloadModelBtn) {
        downloadModelBtn.addEventListener('click', () => showDownloadModelModal());
    }
    
    // 导入本地模型按钮
    if (importLocalModelBtn) {
        importLocalModelBtn.addEventListener('click', importLocalModel);
    }
    
    // 导入向量模型按钮
    if (importVectorModelBtn) {
        importVectorModelBtn.addEventListener('click', importVectorModel);
    }
    
    // Hugging Face模型搜索按钮
    if (hfSearchBtn && hfSearchInput) {
        hfSearchBtn.addEventListener('click', searchHuggingFaceModels);
        hfSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchHuggingFaceModels();
            }
        });
    }
    
    // 显示下载中模型按钮
    if (showDownloadsBtn) {
        showDownloadsBtn.addEventListener('click', showDownloadingModelsModal);
    }
}

// 显示添加在线模型弹窗
function showAddOnlineModelModal() {
    const modalOverlay = showModal('add-online-model-template');
    if (!modalOverlay) return;
    
    const form = modalOverlay.querySelector('#add-online-model-form');
    const providerSelect = modalOverlay.querySelector('#model-provider');
    const modelIdGroup = modalOverlay.querySelector('#model-id-group');
    const modelIdInput = modalOverlay.querySelector('#model-id');
    const baseUrlGroup = modalOverlay.querySelector('#base-url-group');
    
    // 监听提供商选择变化
    providerSelect.addEventListener('change', () => {
        const provider = providerSelect.value;
        
        // 显示/隐藏模型ID输入
        if (provider) {
            modelIdGroup.style.display = 'block';
            modelIdInput.value = getDefaultModelIdForProvider(provider);
        } else {
            modelIdGroup.style.display = 'none';
            modelIdInput.value = '';
        }
        
        // 显示/隐藏基础URL输入
        baseUrlGroup.style.display = provider === 'custom' ? 'block' : 'none';
    });
    
    // 表单提交
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 获取表单数据
        const formData = {
            name: form.querySelector('#model-name').value,
            provider: providerSelect.value,
            modelId: modelIdInput.value,
            apiKey: form.querySelector('#api-key').value,
            baseUrl: form.querySelector('#base-url').value
        };
        
        // 添加模型
        addOnlineModel(formData);
        
        // 关闭弹窗
        document.body.removeChild(modalOverlay);
    });
}

// 显示下载模型弹窗
function showDownloadModelModal() {
    const modalOverlay = showModal('download-model-template');
    if (!modalOverlay) return;
    
    // 可以添加更多下载模型相关的逻辑
}

// 显示下载中模型弹窗
function showDownloadingModelsModal() {
    const modalOverlay = showModal('downloading-models-template');
    if (!modalOverlay) return;
    
    // 可以添加更多显示下载中模型的逻辑
}

// 导入本地模型
function importLocalModel() {
    // 在实际应用中，这里会打开系统文件选择器
    console.log('打开文件选择器以导入本地模型');
    alert('在真实应用中，这里会打开系统文件选择器，让您选择GGUF格式的模型文件。');
}

// 导入向量模型
function importVectorModel() {
    // 在实际应用中，这里会打开系统文件选择器
    console.log('打开文件选择器以导入向量模型');
    alert('在真实应用中，这里会打开系统文件选择器，让您选择Qwen Embeddings v3模型文件。\n\n系统会验证文件的hash值以确保是正确的模型。');
    
    // 模拟导入成功
    setTimeout(() => {
        // 更新向量模型状态
        vectorModel.status = 'imported';
        
        // 重新加载向量模型信息
        loadVectorModel();
        
        // 在实际应用中，这里会验证hash并复制文件
        console.log('导入向量模型完成');
    }, 1000);
}

// 搜索Hugging Face模型
async function searchHuggingFaceModels() {
    const searchTerm = hfSearchInput.value.trim();
    if (!searchTerm) return;
    
    // 显示加载状态
    hfModelsContainer.innerHTML = `
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>正在搜索模型...</p>
        </div>
    `;
    
    try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟搜索结果
        const results = await searchModels(searchTerm);
        
        // 显示结果
        displaySearchResults(results);
    } catch (error) {
        console.error('搜索模型时出错:', error);
        hfModelsContainer.innerHTML = `
            <div class="error-state">
                <div class="error-icon"><i class="ri-error-warning-line"></i></div>
                <p>搜索模型时出错</p>
                <p class="error-message">${error.message}</p>
            </div>
        `;
    }
}

// 显示搜索结果
function displaySearchResults(results) {
    if (!results || results.length === 0) {
        hfModelsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon"><i class="ri-search-line"></i></div>
                <p>未找到匹配的模型</p>
            </div>
        `;
        return;
    }
    
    hfModelsContainer.innerHTML = `
        <div class="search-results">
            ${results.map(model => `
                <div class="model-result-card">
                    <div class="model-result-info">
                        <h4>${model.name}</h4>
                        <p>${model.description}</p>
                        <div class="model-variants">
                            <span class="variant-label">量化版本:</span>
                            ${model.quantVariants.map(variant => `
                                <button class="variant-btn" data-variant="${variant}">
                                    ${variant}
                                </button>
                            `).join('')}
                        </div>
                        <div class="model-specs">
                            <div class="spec-item">
                                <i class="ri-hard-drive-line"></i>
                                <span>大小: ${model.size['Q4_K_M']}</span>
                            </div>
                            <div class="spec-item">
                                <i class="ri-cpu-line"></i>
                                <span>所需内存: ${model.ramRequired['Q4_K_M']}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    // 添加变体按钮点击事件
    const variantButtons = hfModelsContainer.querySelectorAll('.variant-btn');
    variantButtons.forEach(button => {
        button.addEventListener('click', () => {
            const variant = button.getAttribute('data-variant');
            const modelCard = button.closest('.model-result-card');
            const modelName = modelCard.querySelector('h4').textContent;
            
            // 开始下载模型
            startModelDownload(modelName, variant);
        });
    });
}

// 开始下载模型
function startModelDownload(modelName, variant) {
    console.log(`开始下载模型: ${modelName} (${variant})`);
    
    // 更新下载计数
    const currentCount = parseInt(downloadCountElement.textContent);
    downloadCountElement.textContent = currentCount + 1;
    
    // 在实际应用中，这里会启动实际的下载过程
    alert(`在真实应用中，这里会开始下载 ${modelName} 的 ${variant} 版本。\n\n下载进度将显示在"下载中"面板中。`);
}

// 显示模态窗口
function showModal(templateId) {
    // 创建模态窗口容器
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    // 从模板克隆内容
    const template = document.getElementById(templateId);
    if (!template) return;
    
    const modalContent = template.content.cloneNode(true);
    modalOverlay.appendChild(modalContent.firstElementChild);
    
    // 添加到文档中
    document.body.appendChild(modalOverlay);
    
    // 设置关闭按钮事件
    const closeButtons = modalOverlay.querySelectorAll('[data-action="close"]');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.body.removeChild(modalOverlay);
        });
    });
    
    // 点击遮罩层关闭
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            document.body.removeChild(modalOverlay);
        }
    });
    
    return modalOverlay;
}

// 获取提供商默认模型ID
function getDefaultModelIdForProvider(provider) {
    const defaultIds = {
        'openai': 'gpt-4-turbo',
        'claude': 'claude-3-opus-20240229',
        'minimax': 'abab5.5-chat',
        'baidu': 'ernie-bot-4',
        'custom': '' // 自定义提供商需要手动输入
    };
    
    return defaultIds[provider] || '';
}

// 添加在线模型
function addOnlineModel(modelData) {
    console.log('添加在线模型:', modelData);
    
    // 创建新模型对象
    const newModel = {
        id: `${modelData.provider}-${Date.now()}`,
        name: modelData.name,
        provider: modelData.provider,
        modelId: modelData.modelId,
        apiKey: '••••••••••••••••••••••••••••••'
    };
    
    // 添加到模型列表
    onlineModels.push(newModel);
    
    // 重新加载模型列表
    loadOnlineModels();
}

// 搜索模型（模拟）
async function searchModels(searchTerm, gpuInfo) {
    // 在实际应用中，这里会调用API查询Hugging Face
    // 这里只是模拟结果
    
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 一些预定义的模型
    const modelDatabase = {
        'llama': [
            { 
                name: 'Meta-Llama-3-8B', 
                description: 'Meta AI 的 LLaMA 3 8B 模型',
                quantVariants: ['Q4_K_M', 'Q5_K_M', 'Q8_0'],
                size: {
                    'Q4_K_M': '4.8GB',
                    'Q5_K_M': '5.4GB',
                    'Q8_0': '8.2GB'
                },
                ramRequired: {
                    'Q4_K_M': '8GB',
                    'Q5_K_M': '9GB',
                    'Q8_0': '12GB'
                }
            },
            { 
                name: 'Meta-Llama-3-70B', 
                description: 'Meta AI 的 LLaMA 3 70B 模型（大型）',
                quantVariants: ['Q4_K_M', 'Q5_K_M'],
                size: {
                    'Q4_K_M': '38GB',
                    'Q5_K_M': '42GB'
                },
                ramRequired: {
                    'Q4_K_M': '46GB',
                    'Q5_K_M': '50GB'
                }
            }
        ],
        'qwen': [
            { 
                name: 'Qwen2-7B', 
                description: '阿里巴巴的通义千问2代 7B 模型',
                quantVariants: ['Q4_K_M', 'Q5_K_M', 'Q8_0'],
                size: {
                    'Q4_K_M': '4.2GB',
                    'Q5_K_M': '4.8GB',
                    'Q8_0': '7.5GB'
                },
                ramRequired: {
                    'Q4_K_M': '6GB',
                    'Q5_K_M': '7GB',
                    'Q8_0': '10GB'
                }
            }
        ]
    };
    
    // 根据搜索词返回匹配的模型
    const searchTermLower = searchTerm.toLowerCase();
    let results = [];
    
    for (const [key, models] of Object.entries(modelDatabase)) {
        if (key.includes(searchTermLower)) {
            results = results.concat(models);
        }
    }
    
    return results;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init); 