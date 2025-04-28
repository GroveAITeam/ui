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
const vectorModelsContainer = document.getElementById('vector-models-container');
const appSettingsContainer = document.getElementById('app-settings-container');
const addOnlineModelBtn = document.getElementById('add-online-model');
const downloadModelBtn = document.getElementById('download-model');
const importLocalModelBtn = document.getElementById('import-local-model');
const importVectorModelBtn = document.getElementById('import-vector-model');

// 模拟数据 - 在线模型
let onlineModels = [
    { id: 'openai-gpt4', name: 'OpenAI GPT-4', provider: 'openai', modelId: 'gpt-4', apiKey: '••••••••••••••••••••••••••••••', isDefault: true },
    { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'claude', modelId: 'claude-3-opus-20240229', apiKey: '••••••••••••••••••••••••••••••', isDefault: false },
    { id: 'minimax-abab5', name: '贤者 ABAB5.5', provider: 'minimax', modelId: 'abab5.5-chat', apiKey: '••••••••••••••••••••••••••••••', isDefault: false }
];

// 模拟数据 - 离线模型
let offlineModels = [
    { id: 'llama3-8b', name: 'LLaMA 3 8B', source: 'downloaded', size: '4.8GB', ramRequired: '8GB', isDefault: true },
    { id: 'qwen2-7b', name: 'Qwen2 7B', source: 'imported', size: '4.2GB', ramRequired: '6GB', isDefault: false }
];

// 模拟数据 - 向量模型
let vectorModel = {
    name: 'Qwen Embeddings v3',
    status: 'downloaded',
    hash: 'f813131e-a702-4131-9b7b-a882f41a7a12'
};

// 模拟数据 - 应用程序设置
let appSettings = {
    appearance: {
        theme: 'system', // 'light', 'dark', 'system'
    },
    updates: {
        autoCheck: true
    },
    dataManagement: {
        backupPath: '',
        lastBackupDate: null
    }
};

// 初始化
function init() {
    // 设置选项卡事件监听
    setupTabNavigation();
    
    // 初始加载所有设置
    loadOnlineModels();
    loadOfflineModels();
    loadVectorModel();
    loadAppSettings();
    
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
    
    // 模型子选项卡
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

// 设置按钮事件监听
function setupButtonListeners() {
    // 添加在线模型按钮
    if (addOnlineModelBtn) {
        addOnlineModelBtn.addEventListener('click', () => showAddOnlineModelModal());
    }
    
    // 下载模型按钮
    if (downloadModelBtn) {
        downloadModelBtn.addEventListener('click', () => showDownloadModelModal());
    }
    
    // 导入本地模型按钮
    if (importLocalModelBtn) {
        importLocalModelBtn.addEventListener('click', () => importLocalModel());
    }
    
    // 导入向量模型按钮
    if (importVectorModelBtn) {
        importVectorModelBtn.addEventListener('click', () => importVectorModel());
    }
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

// 加载应用程序设置
function loadAppSettings() {
    if (!appSettingsContainer) return;
    
    // 清空容器
    appSettingsContainer.innerHTML = '';
    
    // 创建外观设置组
    const appearanceGroup = createSettingsGroup('外观', [
        {
            id: 'theme',
            name: '主题',
            type: 'select',
            options: [
                { value: 'light', label: '浅色' },
                { value: 'dark', label: '深色' },
                { value: 'system', label: '跟随系统' }
            ],
            value: appSettings.appearance.theme
        }
    ]);
    
    // 创建更新设置组
    const updatesGroup = createSettingsGroup('更新', [
        {
            id: 'autoCheck',
            name: '自动检查更新',
            type: 'checkbox',
            value: appSettings.updates.autoCheck
        },
        {
            id: 'checkNow',
            name: '检查更新',
            type: 'button',
            buttonText: '立即检查更新',
            onClick: checkForUpdates
        }
    ]);
    
    // 创建数据管理设置组
    const dataGroup = createSettingsGroup('数据管理', [
        {
            id: 'backup',
            name: '备份数据',
            type: 'button',
            buttonText: '备份数据',
            onClick: backupData
        },
        {
            id: 'restore',
            name: '恢复数据',
            type: 'button',
            buttonText: '从备份恢复',
            onClick: restoreData
        },
        {
            id: 'reset',
            name: '重置应用程序数据',
            type: 'button',
            buttonText: '重置所有数据',
            buttonClass: 'danger',
            onClick: resetAppData
        }
    ]);
    
    // 创建关于设置组
    const aboutGroup = createSettingsGroup('关于', [
        {
            id: 'version',
            name: '版本',
            type: 'info',
            value: 'Grove AI Studio v1.0.0'
        },
        {
            id: 'privacy',
            name: '隐私政策',
            type: 'link',
            value: 'https://example.com/privacy',
            linkText: '查看隐私政策'
        },
        {
            id: 'acknowledgements',
            name: '致谢',
            type: 'info',
            value: '感谢所有开源项目的贡献'
        }
    ]);
    
    // 添加所有设置组到容器
    appSettingsContainer.appendChild(appearanceGroup);
    appSettingsContainer.appendChild(updatesGroup);
    appSettingsContainer.appendChild(dataGroup);
    appSettingsContainer.appendChild(aboutGroup);
}

// 创建设置组
function createSettingsGroup(title, settings) {
    const group = document.createElement('div');
    group.className = 'settings-group';
    
    // 添加标题
    const titleElement = document.createElement('h3');
    titleElement.className = 'settings-category';
    titleElement.textContent = title;
    group.appendChild(titleElement);
    
    // 添加设置项
    settings.forEach(setting => {
        const settingElement = document.createElement('div');
        settingElement.className = 'setting-item';
        
        // 添加标签（除非是信息类型）
        if (setting.type !== 'info') {
            const labelElement = document.createElement('label');
            labelElement.htmlFor = setting.id;
            labelElement.textContent = setting.name;
            settingElement.appendChild(labelElement);
        } else {
            const labelElement = document.createElement('div');
            labelElement.className = 'setting-label';
            labelElement.textContent = setting.name;
            settingElement.appendChild(labelElement);
        }
        
        // 根据类型创建控件
        let controlElement;
        
        switch (setting.type) {
            case 'select':
                controlElement = document.createElement('select');
                controlElement.id = setting.id;
                
                setting.options.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.value;
                    optionElement.textContent = option.label;
                    optionElement.selected = option.value === setting.value;
                    controlElement.appendChild(optionElement);
                });
                
                // 添加变更事件
                controlElement.addEventListener('change', () => {
                    updateAppSetting(setting.id, controlElement.value);
                });
                break;
                
            case 'checkbox':
                const checkboxContainer = document.createElement('div');
                checkboxContainer.className = 'checkbox-container';
                
                controlElement = document.createElement('input');
                controlElement.type = 'checkbox';
                controlElement.id = setting.id;
                controlElement.checked = setting.value;
                
                const toggle = document.createElement('span');
                toggle.className = 'toggle';
                
                checkboxContainer.appendChild(controlElement);
                checkboxContainer.appendChild(toggle);
                controlElement = checkboxContainer;
                
                // 添加变更事件
                const checkbox = controlElement.querySelector('input');
                checkbox.addEventListener('change', () => {
                    updateAppSetting(setting.id, checkbox.checked);
                });
                break;
                
            case 'button':
                controlElement = document.createElement('button');
                controlElement.textContent = setting.buttonText;
                controlElement.className = setting.buttonClass || '';
                
                // 添加点击事件
                controlElement.addEventListener('click', setting.onClick);
                break;
                
            case 'info':
                controlElement = document.createElement('div');
                controlElement.className = 'setting-info';
                controlElement.textContent = setting.value;
                break;
                
            case 'link':
                controlElement = document.createElement('a');
                controlElement.href = setting.value;
                controlElement.textContent = setting.linkText;
                controlElement.target = '_blank';
                controlElement.rel = 'noopener noreferrer';
                break;
                
            default:
                controlElement = document.createElement('input');
                controlElement.type = setting.type;
                controlElement.id = setting.id;
                controlElement.value = setting.value;
                
                // 添加变更事件
                controlElement.addEventListener('change', () => {
                    updateAppSetting(setting.id, controlElement.value);
                });
                break;
        }
        
        settingElement.appendChild(controlElement);
        group.appendChild(settingElement);
    });
    
    return group;
}

// 更新应用程序设置
function updateAppSetting(id, value) {
    console.log(`更新设置: ${id} = ${value}`);
    
    // 根据ID更新对应的设置
    switch (id) {
        case 'theme':
            appSettings.appearance.theme = value;
            applyTheme(value);
            break;
            
        case 'autoCheck':
            appSettings.updates.autoCheck = value;
            break;
            
        default:
            console.log(`未知设置ID: ${id}`);
            break;
    }
    
    // 在实际应用中，这里会保存到本地存储
    console.log('应用设置已更新:', appSettings);
}

// 应用主题
function applyTheme(theme) {
    console.log(`应用主题: ${theme}`);
    
    // 在实际应用中，这里会根据选择的主题修改CSS变量或加载不同的样式表
    // 这里只是简单的模拟
    document.documentElement.setAttribute('data-theme', theme);
}

// 检查更新
function checkForUpdates() {
    console.log('检查更新');
    
    // 模拟检查更新
    setTimeout(() => {
        alert('您正在使用最新版本 (v1.0.0)');
    }, 1000);
}

// 备份数据
function backupData() {
    console.log('备份数据');
    
    // 在实际应用中，这里会打开文件保存对话框并创建备份文件
    alert('在真实应用中，这里会打开文件保存对话框，让您选择备份文件的保存位置。');
    
    // 模拟备份成功
    setTimeout(() => {
        appSettings.dataManagement.lastBackupDate = new Date().toISOString();
        
        // 重新加载设置
        loadAppSettings();
        
        alert('数据备份成功！');
    }, 1000);
}

// 恢复数据
function restoreData() {
    console.log('恢复数据');
    
    // 在实际应用中，这里会打开文件选择对话框
    if (confirm('从备份恢复将覆盖当前所有数据。是否继续？')) {
        alert('在真实应用中，这里会打开文件选择对话框，让您选择备份文件。');
        
        // 模拟恢复成功
        setTimeout(() => {
            alert('数据恢复成功！应用程序将重新启动以应用更改。');
        }, 1000);
    }
}

// 重置应用程序数据
function resetAppData() {
    console.log('重置应用程序数据');
    
    // 确认重置
    if (confirm('这将删除所有应用程序数据，包括对话历史、知识库、模型配置等。此操作无法撤销。是否继续？')) {
        if (confirm('最后确认：您确定要重置所有数据吗？')) {
            // 模拟重置过程
            setTimeout(() => {
                alert('所有数据已重置。应用程序将重新启动。');
                
                // 重新加载页面
                // window.location.reload();
            }, 1500);
        }
    }
}

// 加载在线模型列表
function loadOnlineModels() {
    if (!onlineModelsContainer) return;
    
    // 清空容器
    onlineModelsContainer.innerHTML = '';
    
    if (onlineModels.length === 0) {
        // 显示空状态
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <div class="empty-icon"><i class="ri-cloud-line"></i></div>
            <h3>尚未添加在线模型</h3>
            <p>点击下方按钮添加您的第一个在线模型</p>
        `;
        onlineModelsContainer.appendChild(emptyState);
        return;
    }
    
    // 创建模型列表
    const modelList = document.createElement('div');
    modelList.className = 'model-list';
    
    // 添加每个模型项
    onlineModels.forEach(model => {
        const modelItem = document.createElement('div');
        modelItem.className = 'model-item' + (model.isDefault ? ' default' : '');
        modelItem.innerHTML = `
            <div class="model-info">
                <div class="model-name">${model.name}</div>
                <div class="model-details">
                    <span class="model-provider">${getProviderDisplayName(model.provider)}</span>
                    <span class="model-id">${model.modelId}</span>
                </div>
            </div>
            <div class="model-actions">
                <button class="set-default-btn" data-id="${model.id}" title="设为默认">
                    <i class="ri-star-${model.isDefault ? 'fill' : 'line'}"></i>
                </button>
                <button class="edit-model-btn" data-id="${model.id}" title="编辑">
                    <i class="ri-pencil-line"></i>
                </button>
                <button class="delete-model-btn" data-id="${model.id}" title="删除">
                    <i class="ri-delete-bin-line"></i>
                </button>
            </div>
        `;
        
        // 设置默认按钮事件
        const setDefaultBtn = modelItem.querySelector('.set-default-btn');
        setDefaultBtn.addEventListener('click', () => setDefaultOnlineModel(model.id));
        
        // 编辑按钮事件
        const editBtn = modelItem.querySelector('.edit-model-btn');
        editBtn.addEventListener('click', () => editOnlineModel(model.id));
        
        // 删除按钮事件
        const deleteBtn = modelItem.querySelector('.delete-model-btn');
        deleteBtn.addEventListener('click', () => deleteOnlineModel(model.id));
        
        modelList.appendChild(modelItem);
    });
    
    onlineModelsContainer.appendChild(modelList);
}

// 获取提供商显示名称
function getProviderDisplayName(provider) {
    const providers = {
        'openai': 'OpenAI',
        'claude': 'Anthropic Claude',
        'minimax': 'MiniMax',
        'baidu': '百度文心',
        'custom': '自定义'
    };
    
    return providers[provider] || provider;
}

// 设置默认在线模型
function setDefaultOnlineModel(modelId) {
    // 更新模型数据
    onlineModels = onlineModels.map(model => ({
        ...model,
        isDefault: model.id === modelId
    }));
    
    // 重新加载模型列表
    loadOnlineModels();
    
    // 在实际应用中，这里会保存到本地存储或发送到服务器
    console.log(`设置默认在线模型: ${modelId}`);
}

// 编辑在线模型
function editOnlineModel(modelId) {
    // 获取要编辑的模型
    const model = onlineModels.find(m => m.id === modelId);
    if (!model) return;
    
    // 显示添加模型模态窗口
    const modal = showAddOnlineModelModal(model);
}

// 删除在线模型
function deleteOnlineModel(modelId) {
    // 确认删除
    if (!confirm('确定要删除此模型吗？')) return;
    
    // 获取模型信息
    const model = onlineModels.find(m => m.id === modelId);
    
    // 检查是否为默认模型
    if (model && model.isDefault && onlineModels.length > 1) {
        alert('无法删除默认模型。请先设置另一个模型为默认。');
        return;
    }
    
    // 从列表中移除
    onlineModels = onlineModels.filter(model => model.id !== modelId);
    
    // 如果删除后还有模型且没有默认模型，设置第一个为默认
    if (onlineModels.length > 0 && !onlineModels.some(m => m.isDefault)) {
        onlineModels[0].isDefault = true;
    }
    
    // 重新加载模型列表
    loadOnlineModels();
    
    // 在实际应用中，这里会更新本地存储或发送到服务器
    console.log(`删除在线模型: ${modelId}`);
}

// 显示添加在线模型模态窗口
function showAddOnlineModelModal(modelToEdit = null) {
    const modal = showModal('add-online-model-template');
    if (!modal) return null;
    
    // 获取表单元素
    const form = modal.querySelector('#add-online-model-form');
    const nameInput = modal.querySelector('#model-name');
    const providerSelect = modal.querySelector('#model-provider');
    const modelIdInput = modal.querySelector('#model-id');
    const apiKeyInput = modal.querySelector('#api-key');
    const baseUrlInput = modal.querySelector('#base-url');
    const baseUrlGroup = modal.querySelector('#base-url-group');
    
    // 设置标题
    const title = modal.querySelector('h3');
    if (title) {
        title.textContent = modelToEdit ? '编辑在线模型' : '添加在线模型';
    }
    
    // 如果是编辑模式，填充表单
    if (modelToEdit) {
        nameInput.value = modelToEdit.name;
        providerSelect.value = modelToEdit.provider;
        modelIdInput.value = modelToEdit.modelId;
        apiKeyInput.value = modelToEdit.apiKey;
        baseUrlInput.value = modelToEdit.baseUrl || '';
        
        // 显示或隐藏基础URL字段
        toggleBaseUrlVisibility(modelToEdit.provider);
    }
    
    // 提供商选择变更事件
    providerSelect.addEventListener('change', () => {
        toggleBaseUrlVisibility(providerSelect.value);
    });
    
    // 表单提交事件
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 收集表单数据
        const modelData = {
            name: nameInput.value.trim(),
            provider: providerSelect.value,
            modelId: modelIdInput.value.trim(),
            apiKey: apiKeyInput.value.trim(),
            baseUrl: baseUrlInput.value.trim() || undefined
        };
        
        // 验证输入
        if (!modelData.name || !modelData.provider || !modelData.modelId || !modelData.apiKey) {
            alert('请填写所有必填字段');
            return;
        }
        
        // 保存模型
        if (modelToEdit) {
            // 更新现有模型
            const updatedModel = {
                ...modelToEdit,
                name: modelData.name,
                provider: modelData.provider,
                modelId: modelData.modelId,
                apiKey: modelData.apiKey,
                baseUrl: modelData.baseUrl
            };
            
            onlineModels = onlineModels.map(model => 
                model.id === modelToEdit.id ? updatedModel : model
            );
            
            console.log('更新在线模型:', updatedModel);
        } else {
            // 创建新模型
            const newModel = {
                id: 'model_' + Date.now(),
                name: modelData.name,
                provider: modelData.provider,
                modelId: modelData.modelId,
                apiKey: modelData.apiKey,
                baseUrl: modelData.baseUrl,
                isDefault: onlineModels.length === 0 // 如果是第一个模型，设为默认
            };
            
            onlineModels.push(newModel);
            console.log('添加新的在线模型:', newModel);
        }
        
        // 重新加载模型列表
        loadOnlineModels();
        
        // 关闭模态窗口
        document.body.removeChild(modal);
    });
    
    return modal;
}

// 切换基础URL字段可见性
function toggleBaseUrlVisibility(provider) {
    const baseUrlGroup = document.getElementById('base-url-group');
    if (!baseUrlGroup) return;
    
    // 仅对自定义提供商显示基础URL字段
    if (provider === 'custom') {
        baseUrlGroup.style.display = 'block';
    } else {
        baseUrlGroup.style.display = 'none';
    }
}

// 加载离线模型列表
function loadOfflineModels() {
    if (!offlineModelsContainer) return;
    
    // 清空容器
    offlineModelsContainer.innerHTML = '';
    
    if (offlineModels.length === 0) {
        // 显示空状态
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <div class="empty-icon"><i class="ri-hard-drive-line"></i></div>
            <h3>尚未添加离线模型</h3>
            <p>下载或导入本地模型以开始使用离线功能</p>
        `;
        offlineModelsContainer.appendChild(emptyState);
        
        // 更新模型存储路径显示
        updateModelStoragePath();
        return;
    }
    
    // 创建模型列表
    const modelList = document.createElement('div');
    modelList.className = 'model-list';
    
    // 添加每个模型项
    offlineModels.forEach(model => {
        const modelItem = document.createElement('div');
        modelItem.className = 'model-item' + (model.isDefault ? ' default' : '');
        modelItem.innerHTML = `
            <div class="model-info">
                <div class="model-name">${model.name}</div>
                <div class="model-details">
                    <span class="model-source">${getSourceDisplayName(model.source)}</span>
                    <span class="model-size">${model.size}</span>
                    <span class="model-ram">建议内存: ${model.ramRequired}</span>
                </div>
            </div>
            <div class="model-actions">
                <button class="set-default-btn" data-id="${model.id}" title="设为默认">
                    <i class="ri-star-${model.isDefault ? 'fill' : 'line'}"></i>
                </button>
                <button class="delete-model-btn" data-id="${model.id}" title="删除">
                    <i class="ri-delete-bin-line"></i>
                </button>
            </div>
        `;
        
        // 设置默认按钮事件
        const setDefaultBtn = modelItem.querySelector('.set-default-btn');
        setDefaultBtn.addEventListener('click', () => setDefaultOfflineModel(model.id));
        
        // 删除按钮事件
        const deleteBtn = modelItem.querySelector('.delete-model-btn');
        deleteBtn.addEventListener('click', () => deleteOfflineModel(model.id));
        
        modelList.appendChild(modelItem);
    });
    
    offlineModelsContainer.appendChild(modelList);
    
    // 更新模型存储路径显示
    updateModelStoragePath();
}

// 获取来源显示名称
function getSourceDisplayName(source) {
    const sources = {
        'downloaded': '已下载',
        'imported': '已导入'
    };
    
    return sources[source] || source;
}

// 更新模型存储路径显示
function updateModelStoragePath() {
    const pathElement = document.getElementById('model-storage-path');
    if (pathElement) {
        // 模拟路径，实际应用中会从配置或API获取
        pathElement.textContent = '/Users/username/Library/Application Support/com.grove.ai/models';
    }
}

// 设置默认离线模型
function setDefaultOfflineModel(modelId) {
    // 更新模型数据
    offlineModels = offlineModels.map(model => ({
        ...model,
        isDefault: model.id === modelId
    }));
    
    // 重新加载模型列表
    loadOfflineModels();
    
    // 在实际应用中，这里会保存到本地存储或发送到服务器
    console.log(`设置默认离线模型: ${modelId}`);
}

// 删除离线模型
function deleteOfflineModel(modelId) {
    // 确认删除
    if (!confirm('确定要删除此模型吗？这将从您的磁盘中删除模型文件。')) return;
    
    // 获取模型信息
    const model = offlineModels.find(m => m.id === modelId);
    
    // 检查是否为默认模型
    if (model && model.isDefault && offlineModels.length > 1) {
        alert('无法删除默认模型。请先设置另一个模型为默认。');
        return;
    }
    
    // 从列表中移除
    offlineModels = offlineModels.filter(model => model.id !== modelId);
    
    // 如果删除后还有模型且没有默认模型，设置第一个为默认
    if (offlineModels.length > 0 && !offlineModels.some(m => m.isDefault)) {
        offlineModels[0].isDefault = true;
    }
    
    // 重新加载模型列表
    loadOfflineModels();
    
    // 在实际应用中，这里会删除文件并更新本地存储
    console.log(`删除离线模型: ${modelId}`);
}

// 显示下载模型模态窗口
function showDownloadModelModal() {
    const modal = showModal('download-model-template');
    if (!modal) return;
    
    // 获取元素
    const searchInput = modal.querySelector('#model-search');
    const searchButton = modal.querySelector('#search-model-btn');
    const resultsContainer = modal.querySelector('#model-search-results');
    const downloadInfo = modal.querySelector('#download-info');
    const downloadingModelName = modal.querySelector('#downloading-model-name');
    const downloadProgress = modal.querySelector('#download-progress');
    const downloadStatus = modal.querySelector('#download-status');
    
    // 自动检测系统信息（模拟）
    const gpuInfo = detectGPU();
    
    // 添加搜索功能
    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        if (!searchTerm) return;
        
        // 显示加载中
        resultsContainer.innerHTML = '<div class="loading">搜索中...</div>';
        
        // 模拟搜索延迟
        setTimeout(() => {
            // 模拟搜索结果
            searchModels(searchTerm, gpuInfo).then(models => {
                displaySearchResults(models, resultsContainer, downloadInfo, downloadingModelName, downloadProgress, downloadStatus);
            });
        }, 800);
    });
    
    // 回车键触发搜索
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });
    
    // 显示初始信息
    resultsContainer.innerHTML = `
        <div class="gpu-info">
            <h4>检测到的硬件:</h4>
            <p>${gpuInfo.description}</p>
            <p>推荐下载: ${gpuInfo.recommendedVariant} 变体的模型</p>
        </div>
        <div class="search-hint">
            <p>输入关键词搜索Hugging Face上的GGUF格式模型</p>
            <p>推荐: llama3, qwen2, yi, mistral, phi3</p>
        </div>
    `;
}

// 检测GPU信息（模拟）
function detectGPU() {
    // 在实际应用中，这里会使用硬件检测API
    // 这里只是模拟结果
    
    // 随机选择一种GPU类型进行演示
    const gpuTypes = [
        { type: 'cuda', description: 'NVIDIA GPU (支持CUDA)', recommendedVariant: 'Q4_K_M-cuda' },
        { type: 'metal', description: 'Apple Silicon (支持Metal)', recommendedVariant: 'Q4_K_M-metal' },
        { type: 'none', description: '未检测到兼容的GPU', recommendedVariant: 'Q4_K_M' }
    ];
    
    // 在macOS上可能是Metal
    return gpuTypes[1];
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
        ],
        'mistral': [
            { 
                name: 'Mistral-7B-v0.1', 
                description: 'Mistral AI 的 7B 模型',
                quantVariants: ['Q4_K_M', 'Q5_K_M', 'Q8_0'],
                size: {
                    'Q4_K_M': '4.1GB',
                    'Q5_K_M': '4.6GB',
                    'Q8_0': '7.2GB'
                },
                ramRequired: {
                    'Q4_K_M': '6GB',
                    'Q5_K_M': '7GB',
                    'Q8_0': '10GB'
                }
            }
        ],
        'yi': [
            { 
                name: 'Yi-9B', 
                description: '01.AI 的 Yi 9B 模型',
                quantVariants: ['Q4_K_M', 'Q5_K_M', 'Q8_0'],
                size: {
                    'Q4_K_M': '5.1GB',
                    'Q5_K_M': '5.7GB',
                    'Q8_0': '9.2GB'
                },
                ramRequired: {
                    'Q4_K_M': '8GB',
                    'Q5_K_M': '9GB',
                    'Q8_0': '12GB'
                }
            }
        ]
    };
    
    // 搜索匹配项
    let results = [];
    const lowercaseSearch = searchTerm.toLowerCase();
    
    // 检查每个模型系列
    Object.keys(modelDatabase).forEach(key => {
        if (key.includes(lowercaseSearch)) {
            results = results.concat(modelDatabase[key]);
        } else {
            // 检查模型名称
            modelDatabase[key].forEach(model => {
                if (model.name.toLowerCase().includes(lowercaseSearch) || 
                    model.description.toLowerCase().includes(lowercaseSearch)) {
                    results.push(model);
                }
            });
        }
    });
    
    return results;
}

// 显示搜索结果
function displaySearchResults(models, resultsContainer, downloadInfo, downloadingModelName, downloadProgress, downloadStatus) {
    if (models.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <p>未找到匹配的模型。请尝试不同的搜索词。</p>
            </div>
        `;
        return;
    }
    
    // 清空结果容器
    resultsContainer.innerHTML = '';
    
    // 创建结果列表
    models.forEach(model => {
        const modelCard = document.createElement('div');
        modelCard.className = 'model-search-card';
        
        // 创建变体选择
        let variantOptions = '';
        model.quantVariants.forEach(variant => {
            const variantName = `${variant} (${model.size[variant]}, 需要${model.ramRequired[variant]}内存)`;
            variantOptions += `<option value="${variant}">${variantName}</option>`;
        });
        
        modelCard.innerHTML = `
            <div class="model-search-info">
                <h4>${model.name}</h4>
                <p>${model.description}</p>
            </div>
            <div class="model-search-actions">
                <select class="variant-select">
                    ${variantOptions}
                </select>
                <button class="download-model-btn" data-model="${model.name}">
                    <i class="ri-download-line"></i> 下载
                </button>
            </div>
        `;
        
        // 下载按钮事件
        const downloadBtn = modelCard.querySelector('.download-model-btn');
        const variantSelect = modelCard.querySelector('.variant-select');
        
        downloadBtn.addEventListener('click', () => {
            const variant = variantSelect.value;
            const modelName = model.name;
            const modelSize = model.size[variant];
            
            // 开始下载模型（模拟）
            startModelDownload(modelName, variant, modelSize, downloadInfo, downloadingModelName, downloadProgress, downloadStatus);
            
            // 隐藏搜索结果
            resultsContainer.style.display = 'none';
        });
        
        resultsContainer.appendChild(modelCard);
    });
}

// 开始模型下载（模拟）
function startModelDownload(modelName, variant, modelSize, downloadInfo, downloadingModelName, downloadProgress, downloadStatus) {
    // 显示下载信息
    downloadInfo.style.display = 'block';
    downloadingModelName.textContent = `${modelName} (${variant})`;
    downloadStatus.textContent = '准备下载...';
    downloadProgress.style.width = '0%';
    
    // 模拟下载过程
    let progress = 0;
    const totalSteps = 100;
    const interval = setInterval(() => {
        progress += 1;
        downloadProgress.style.width = `${progress}%`;
        
        // 更新状态文本
        if (progress < 10) {
            downloadStatus.textContent = '准备下载...';
        } else if (progress < 90) {
            downloadStatus.textContent = `下载中: ${progress}% (${modelSize})`;
        } else if (progress < 100) {
            downloadStatus.textContent = '验证模型完整性...';
        } else {
            downloadStatus.textContent = '下载完成！模型已添加到您的离线模型列表。';
            clearInterval(interval);
            
            // 添加到离线模型列表
            setTimeout(() => {
                const newModel = {
                    id: `${modelName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`,
                    name: `${modelName} (${variant})`,
                    source: 'downloaded',
                    size: modelSize,
                    ramRequired: '8GB', // 简化，实际应该从模型数据获取
                    isDefault: offlineModels.length === 0 // 如果是第一个模型，设为默认
                };
                
                offlineModels.push(newModel);
                
                // 重新加载模型列表
                loadOfflineModels();
                
                // 在实际应用中，这里会保存到本地存储
                console.log(`下载模型完成: ${modelName} (${variant})`);
            }, 1000);
        }
    }, 100);
}

// 导入本地模型
function importLocalModel() {
    // 在实际应用中，这里会打开系统文件选择器
    console.log('打开文件选择器以导入本地模型');
    alert('在真实应用中，这里会打开系统文件选择器，让您选择一个.gguf模型文件。');
    
    // 模拟选择文件后的操作
    setTimeout(() => {
        // 模拟导入的模型
        const importedModel = {
            id: `imported-model-${Date.now()}`,
            name: '本地导入模型',
            source: 'imported',
            size: '5.2GB',
            ramRequired: '8GB',
            isDefault: offlineModels.length === 0 // A如果是第一个模型，设为默认
        };
        
        // 添加到离线模型列表
        offlineModels.push(importedModel);
        
        // 重新加载模型列表
        loadOfflineModels();
        
        // 在实际应用中，这里会复制文件并更新本地存储
        console.log('导入本地模型:', importedModel);
    }, 1000);
}

// 加载向量模型信息
function loadVectorModel() {
    if (!vectorModelsContainer) return;
    
    // 清空容器
    vectorModelsContainer.innerHTML = '';
    
    // 创建向量模型信息卡片
    const modelCard = document.createElement('div');
    modelCard.className = 'vector-model-card';
    modelCard.innerHTML = `
        <div class="vector-model-info">
            <h3>知识库向量模型</h3>
            <div class="model-details">
                <p><strong>当前模型:</strong> ${vectorModel.name}</p>
                <p><strong>状态:</strong> ${getVectorModelStatusName(vectorModel.status)}</p>
                <p><strong>模型Hash:</strong> ${vectorModel.hash}</p>
            </div>
            <div class="vector-model-description">
                <p>向量模型用于知识库的文本嵌入，为文档创建语义索引。</p>
                <p>目前使用固定的 Qwen Embeddings v3 模型，无需配置。</p>
                <p>该模型会在首次使用知识库功能时自动下载。</p>
            </div>
        </div>
    `;
    
    vectorModelsContainer.appendChild(modelCard);
}

// 获取向量模型状态显示名称
function getVectorModelStatusName(status) {
    const statuses = {
        'downloaded': '已下载',
        'pending': '等待下载',
        'downloading': '正在下载',
        'imported': '已导入'
    };
    
    return statuses[status] || status;
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

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init); 