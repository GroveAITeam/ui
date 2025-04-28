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
const appSettingsContainer = document.getElementById('app-settings-container');
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
    
    // 设置离线模型选项卡监听
    setupOfflineModelTabs();
    
    // 更新模型存储路径显示
    updateModelStoragePath();
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
    
    // 编辑模型存储路径按钮
    if (editModelPathBtn) {
        editModelPathBtn.addEventListener('click', editModelStoragePath);
    }
}

// 设置离线模型选项卡事件监听
function setupOfflineModelTabs() {
    offlineModelTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 取消所有选项卡的激活状态
            offlineModelTabs.forEach(t => t.classList.remove('active'));
            
            // 激活当前选项卡
            this.classList.add('active');
            
            // 获取目标内容ID
            const targetId = this.getAttribute('data-offlinetab');
            
            // 隐藏所有内容
            offlineModelTabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // 显示目标内容
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
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
            description: '选择应用的显示主题',
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
            description: '当应用启动时自动检查是否有新版本',
            type: 'checkbox',
            value: appSettings.updates.autoCheck
        },
        {
            id: 'checkNow',
            name: '检查更新',
            description: '立即检查Grove AI Studio的新版本',
            type: 'button',
            buttonText: '立即检查更新',
            buttonClass: 'primary-btn',
            icon: 'ri-refresh-line',
            onClick: checkForUpdates
        }
    ]);
    
    // 创建数据管理设置组
    const dataGroup = createSettingsGroup('数据管理', [
        {
            id: 'backup',
            name: '备份数据',
            description: '将您的会话、知识库和设置备份到一个文件',
            type: 'button',
            buttonText: '备份数据',
            buttonClass: 'primary-btn',
            icon: 'ri-save-line',
            onClick: backupData
        },
        {
            id: 'restore',
            name: '恢复数据',
            description: '从以前的备份文件恢复您的数据',
            type: 'button',
            buttonText: '从备份恢复',
            buttonClass: 'secondary-btn',
            icon: 'ri-upload-2-line',
            onClick: restoreData
        },
        {
            id: 'reset',
            name: '重置应用程序数据',
            description: '清除所有数据并将应用重置为初始状态，此操作不可撤销',
            type: 'button',
            buttonText: '重置所有数据',
            buttonClass: 'danger-btn',
            icon: 'ri-restart-line',
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
            description: '了解我们如何保护您的数据隐私',
            type: 'link',
            value: 'https://example.com/privacy',
            linkText: '查看隐私政策',
            icon: 'ri-shield-line'
        },
        {
            id: 'acknowledgements',
            name: '致谢',
            description: '感谢所有为Grove AI Studio做出贡献的开源项目',
            type: 'link',
            value: 'https://example.com/acknowledgements',
            linkText: '查看致谢列表',
            icon: 'ri-heart-line'
        }
    ]);
    
    // 添加设置组到容器
    appSettingsContainer.appendChild(appearanceGroup);
    appSettingsContainer.appendChild(updatesGroup);
    appSettingsContainer.appendChild(dataGroup);
    appSettingsContainer.appendChild(aboutGroup);
}

// 创建设置组
function createSettingsGroup(title, settings) {
    const group = document.createElement('div');
    group.className = 'settings-group';
    
    // 创建标题
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    group.appendChild(titleElement);
    
    // 设置项容器
    const settingsContainer = document.createElement('div');
    settingsContainer.className = 'settings-items';
    
    // 添加每个设置项
    settings.forEach(setting => {
        const settingItem = document.createElement('div');
        settingItem.className = 'setting-item';
        
        switch (setting.type) {
            case 'select':
                // 下拉选择
                const selectLabel = document.createElement('label');
                selectLabel.setAttribute('for', setting.id);
                selectLabel.textContent = setting.name;
                
                const select = document.createElement('select');
                select.id = setting.id;
                
                setting.options.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.value;
                    optionElement.textContent = option.label;
                    if (setting.value === option.value) {
                        optionElement.selected = true;
                    }
                    select.appendChild(optionElement);
                });
                
                select.addEventListener('change', () => {
                    updateAppSetting(setting.id, select.value);
                });
                
                const labelContainer = document.createElement('div');
                labelContainer.className = 'setting-label-container';
                labelContainer.appendChild(selectLabel);
                
                if (setting.description) {
                    const description = document.createElement('div');
                    description.className = 'setting-info';
                    description.textContent = setting.description;
                    labelContainer.appendChild(description);
                }
                
                settingItem.appendChild(labelContainer);
                settingItem.appendChild(select);
                break;
                
            case 'checkbox':
                // 复选框
                const checkboxContainer = document.createElement('div');
                checkboxContainer.className = 'checkbox-option';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = setting.id;
                checkbox.checked = setting.value;
                
                const checkboxLabel = document.createElement('label');
                checkboxLabel.setAttribute('for', setting.id);
                checkboxLabel.textContent = setting.name;
                
                checkbox.addEventListener('change', () => {
                    updateAppSetting(setting.id, checkbox.checked);
                });
                
                const labelWrapper = document.createElement('div');
                labelWrapper.className = 'setting-label-container';
                labelWrapper.appendChild(checkboxLabel);
                
                if (setting.description) {
                    const description = document.createElement('div');
                    description.className = 'setting-info';
                    description.textContent = setting.description;
                    labelWrapper.appendChild(description);
                }
                
                settingItem.appendChild(labelWrapper);
                
                const checkboxWrapper = document.createElement('div');
                checkboxWrapper.className = 'checkbox-container';
                checkboxWrapper.appendChild(checkbox);
                
                const switchLabel = document.createElement('label');
                switchLabel.className = 'switch';
                
                const slider = document.createElement('span');
                slider.className = 'switch-slider';
                
                switchLabel.appendChild(checkbox);
                switchLabel.appendChild(slider);
                
                settingItem.appendChild(switchLabel);
                break;
                
            case 'button':
                // 按钮
                const buttonLabel = document.createElement('div');
                buttonLabel.className = 'setting-label';
                buttonLabel.textContent = setting.name;
                
                const button = document.createElement('button');
                button.className = `form-btn ${setting.buttonClass || 'secondary-btn'}`;
                button.textContent = setting.buttonText;
                
                if (setting.icon) {
                    const icon = document.createElement('i');
                    icon.className = setting.icon;
                    button.prepend(icon);
                }
                
                button.addEventListener('click', setting.onClick);
                
                const buttonLabelContainer = document.createElement('div');
                buttonLabelContainer.className = 'setting-label-container';
                buttonLabelContainer.appendChild(buttonLabel);
                
                if (setting.description) {
                    const description = document.createElement('div');
                    description.className = 'setting-info';
                    description.textContent = setting.description;
                    buttonLabelContainer.appendChild(description);
                }
                
                settingItem.appendChild(buttonLabelContainer);
                settingItem.appendChild(button);
                break;
                
            case 'info':
                // 信息显示
                const infoLabel = document.createElement('div');
                infoLabel.className = 'setting-label';
                infoLabel.textContent = setting.name;
                
                const infoValue = document.createElement('div');
                infoValue.className = 'setting-value';
                infoValue.textContent = setting.value;
                
                settingItem.appendChild(infoLabel);
                settingItem.appendChild(infoValue);
                break;
                
            case 'link':
                // 链接
                const linkLabel = document.createElement('div');
                linkLabel.className = 'setting-label';
                linkLabel.textContent = setting.name;
                
                const link = document.createElement('a');
                link.href = setting.value;
                link.target = '_blank';
                link.className = 'link-btn';
                
                if (setting.icon) {
                    const icon = document.createElement('i');
                    icon.className = setting.icon;
                    link.appendChild(icon);
                }
                
                const linkText = document.createElement('span');
                linkText.textContent = setting.linkText;
                link.appendChild(linkText);
                
                const linkLabelContainer = document.createElement('div');
                linkLabelContainer.className = 'setting-label-container';
                linkLabelContainer.appendChild(linkLabel);
                
                if (setting.description) {
                    const description = document.createElement('div');
                    description.className = 'setting-info';
                    description.textContent = setting.description;
                    linkLabelContainer.appendChild(description);
                }
                
                settingItem.appendChild(linkLabelContainer);
                settingItem.appendChild(link);
                break;
        }
        
        settingsContainer.appendChild(settingItem);
    });
    
    group.appendChild(settingsContainer);
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
        onlineModelsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon"><i class="ri-cloud-off-line"></i></div>
                <h3>暂无在线模型</h3>
                <p>点击下方的"添加在线模型"按钮来配置您的第一个在线模型</p>
            </div>
        `;
        return;
    }
    
    // 创建模型列表
    const modelList = document.createElement('div');
    modelList.className = 'model-list';
    
    // 添加模型项
    onlineModels.forEach(model => {
        const modelItem = document.createElement('div');
        modelItem.className = 'model-item';
        modelItem.setAttribute('data-id', model.id);
        
        const modelIcon = getProviderIcon(model.provider);
        
        modelItem.innerHTML = `
            <div class="model-info">
                <div class="model-name">${model.name}</div>
                <div class="model-details">
                    <div class="model-detail-item">
                        <i class="ri-building-line"></i>
                        <span>${getProviderDisplayName(model.provider)}</span>
                    </div>
                    <div class="model-detail-item">
                        <i class="ri-code-line"></i>
                        <span>${model.modelId}</span>
                    </div>
                </div>
            </div>
            <div class="model-actions">
                <button class="edit-model-btn" title="编辑"><i class="ri-edit-line"></i></button>
                <button class="delete-model-btn" title="删除"><i class="ri-delete-bin-line"></i></button>
            </div>
        `;
        
        // 添加编辑按钮点击事件
        const editBtn = modelItem.querySelector('.edit-model-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                editOnlineModel(model.id);
            });
        }
        
        // 添加删除按钮点击事件
        const deleteBtn = modelItem.querySelector('.delete-model-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                deleteOnlineModel(model.id);
            });
        }
        
        modelList.appendChild(modelItem);
    });
    
    onlineModelsContainer.appendChild(modelList);
}

// 获取提供商图标
function getProviderIcon(provider) {
    switch(provider) {
        case 'openai':
            return 'ri-openai-fill';
        case 'claude':
            return 'ri-compass-3-line';
        case 'minimax':
            return 'ri-robot-line';
        case 'baidu':
            return 'ri-baidu-line';
        case 'custom':
            return 'ri-settings-line';
        default:
            return 'ri-cloud-line';
    }
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
    
    // 从列表中移除
    onlineModels = onlineModels.filter(model => model.id !== modelId);
    
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
    const modelIdGroup = modal.querySelector('#model-id-group');
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
        
        // 显示或隐藏基础URL字段和模型ID字段
        toggleBaseUrlVisibility(modelToEdit.provider);
        toggleModelIdVisibility(modelToEdit.provider);
    } else {
        // 初始隐藏模型ID字段
        toggleModelIdVisibility(providerSelect.value);
    }
    
    // 提供商选择变更事件
    providerSelect.addEventListener('change', () => {
        toggleBaseUrlVisibility(providerSelect.value);
        toggleModelIdVisibility(providerSelect.value);
    });
    
    // 表单提交事件
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 收集表单数据
        const modelData = {
            name: nameInput.value.trim(),
            provider: providerSelect.value,
            apiKey: apiKeyInput.value.trim(),
            baseUrl: baseUrlInput.value.trim() || undefined
        };
        
        // 只有当需要模型ID时才添加
        if (modelData.provider === 'custom') {
            modelData.modelId = modelIdInput.value.trim();
            // 验证输入
            if (!modelData.modelId) {
                alert('自定义提供商需要填写模型ID');
                return;
            }
        } else {
            // 为预置提供商设置默认模型ID
            modelData.modelId = getDefaultModelIdForProvider(modelData.provider);
        }
        
        // 验证输入
        if (!modelData.name || !modelData.provider || !modelData.apiKey) {
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
                baseUrl: modelData.baseUrl
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

// 切换基础URL可见性
function toggleBaseUrlVisibility(provider) {
    const baseUrlGroup = document.querySelector('#base-url-group');
    if (baseUrlGroup) {
        baseUrlGroup.style.display = provider === 'custom' ? 'block' : 'none';
    }
}

// 切换模型ID可见性
function toggleModelIdVisibility(provider) {
    const modelIdGroup = document.querySelector('#model-id-group');
    if (modelIdGroup) {
        modelIdGroup.style.display = provider === 'custom' ? 'block' : 'none';
    }
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

// 加载离线模型列表
function loadOfflineModels() {
    if (!offlineModelsContainer) return;
    
    // 清空容器
    offlineModelsContainer.innerHTML = '';
    
    if (offlineModels.length === 0) {
        // 显示空状态
        offlineModelsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon"><i class="ri-hard-drive-2-line"></i></div>
                <h3>暂无离线模型</h3>
                <p>您可以下载新模型或导入已有模型</p>
            </div>
        `;
        return;
    }
    
    // 创建模型列表
    const modelList = document.createElement('div');
    modelList.className = 'model-list';
    
    // 添加模型项
    offlineModels.forEach(model => {
        const modelItem = document.createElement('div');
        modelItem.className = 'model-item';
        modelItem.setAttribute('data-id', model.id);
        
        // 图标基于来源
        const sourceIcon = model.source === 'downloaded' ? 'ri-download-2-line' : 'ri-folder-received-line';
        
        modelItem.innerHTML = `
            <div class="model-info">
                <div class="model-name">${model.name}</div>
                <div class="model-details">
                    <div class="model-detail-item">
                        <i class="${sourceIcon}"></i>
                        <span>${model.source === 'downloaded' ? '已下载' : '本地导入'}</span>
                    </div>
                    <div class="model-detail-item">
                        <i class="ri-hard-drive-line"></i>
                        <span>${model.size}</span>
                    </div>
                    <div class="model-detail-item">
                        <i class="ri-cpu-line"></i>
                        <span>需要 ${model.ramRequired} 内存</span>
                    </div>
                </div>
            </div>
            <div class="model-actions">
                <button class="delete-model-btn" title="删除"><i class="ri-delete-bin-line"></i></button>
            </div>
        `;
        
        // 添加删除按钮点击事件
        const deleteBtn = modelItem.querySelector('.delete-model-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                deleteOfflineModel(model.id);
            });
        }
        
        modelList.appendChild(modelItem);
    });
    
    offlineModelsContainer.appendChild(modelList);
}

// 删除离线模型
function deleteOfflineModel(modelId) {
    // 确认删除
    if (!confirm('确定要删除此模型吗？这将从您的硬盘中删除模型文件。')) return;
    
    // 从列表中移除
    offlineModels = offlineModels.filter(model => model.id !== modelId);
    
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
            
            // 开始下载模型（旧方法）
            startModelDownloadOld(modelName, variant, modelSize, downloadInfo, downloadingModelName, downloadProgress, downloadStatus);
            
            // 隐藏搜索结果
            resultsContainer.style.display = 'none';
        });
        
        resultsContainer.appendChild(modelCard);
    });
}

// 开始模型下载（旧方法 - 用于模态框中的下载）
function startModelDownloadOld(modelName, variant, modelSize, downloadInfo, downloadingModelName, downloadProgress, downloadStatus) {
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
                    ramRequired: '8GB' // 简化，实际应该从模型数据获取
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
            ramRequired: '8GB'
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
        <button class="delete-model-btn" title="删除"><i class="ri-delete-bin-line"></i> 删除模型</button>
    `;
    
    vectorModelsContainer.appendChild(vectorModelCard);
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

// 更新模型存储路径显示
function updateModelStoragePath() {
    const pathElement = document.getElementById('model-storage-path');
    if (pathElement) {
        // 模拟路径，实际应用中会从配置或API获取
        pathElement.textContent = '/Users/username/Library/Application Support/com.grove.ai/models';
    }
}

// 编辑模型存储路径
function editModelStoragePath() {
    // 在实际应用中，这里会打开系统文件夹选择器
    console.log('打开文件夹选择器以更改模型存储路径');
    alert('在真实应用中，这里会打开系统文件夹选择器，让您选择一个存储模型的文件夹。');
    
    // 模拟选择文件夹后的操作
    setTimeout(() => {
        // 更新模型存储路径
        const pathElement = document.getElementById('model-storage-path');
        if (pathElement) {
            pathElement.textContent = '/Users/username/Documents/AI-Models';
        }
        
        // 在实际应用中，这里会更新配置并保存
        console.log('更新模型存储路径');
    }, 500);
}

// 搜索Hugging Face模型
function searchHuggingFaceModels() {
    if (!hfSearchInput || !hfModelsContainer) return;
    
    const searchTerm = hfSearchInput.value.trim();
    if (!searchTerm) return;
    
    // 显示加载中
    hfModelsContainer.innerHTML = '<div class="loading">搜索中...</div>';
    
    // 模拟搜索延迟
    setTimeout(() => {
        // 检测系统信息（模拟）
        const gpuInfo = detectGPU();
        
        // 模拟搜索结果
        searchModels(searchTerm, gpuInfo).then(models => {
            displayHuggingFaceSearchResults(models);
        });
    }, 800);
}

// 显示Hugging Face搜索结果
function displayHuggingFaceSearchResults(models) {
    if (!hfModelsContainer) return;
    
    // 清空容器
    hfModelsContainer.innerHTML = '';
    
    if (models.length === 0) {
        // 显示无结果
        hfModelsContainer.innerHTML = `
            <div class="no-results">
                <p>没有找到匹配的模型。请尝试其他关键词。</p>
            </div>
        `;
        return;
    }
    
    // 创建GPU信息提示
    const gpuInfo = detectGPU();
    const gpuInfoElement = document.createElement('div');
    gpuInfoElement.className = 'gpu-info';
    gpuInfoElement.innerHTML = `
        <h4>检测到的硬件:</h4>
        <p>${gpuInfo.description}</p>
        <p>推荐下载: ${gpuInfo.recommendedVariant} 变体的模型</p>
    `;
    hfModelsContainer.appendChild(gpuInfoElement);
    
    // 创建模型列表
    const modelList = document.createElement('div');
    modelList.className = 'hf-model-list';
    
    // 添加模型项
    models.forEach(model => {
        const modelCard = document.createElement('div');
        modelCard.className = 'hf-model-card';
        
        // 创建变体列表
        const variantsHtml = model.quantVariants.map(variant => {
            const isRecommended = variant === gpuInfo.recommendedVariant;
            return `
                <div class="model-variant${isRecommended ? ' recommended' : ''}">
                    <div class="variant-info">
                        <div class="variant-name">${variant}${isRecommended ? ' <span class="recommended-badge">推荐</span>' : ''}</div>
                        <div class="variant-details">
                            <span><i class="ri-hard-drive-line"></i> ${model.size[variant]}</span>
                            <span><i class="ri-cpu-line"></i> 需要 ${model.ramRequired[variant]}</span>
                        </div>
                    </div>
                    <button class="download-variant-btn" data-model="${model.name}" data-variant="${variant}" data-size="${model.size[variant]}">
                        <i class="ri-download-line"></i> 下载
                    </button>
                </div>
            `;
        }).join('');
        
        // 创建模型卡片内容
        modelCard.innerHTML = `
            <div class="model-card-header">
                <h4>${model.name}</h4>
                <p>${model.description}</p>
            </div>
            <div class="model-variants">
                ${variantsHtml}
            </div>
        `;
        
        // 添加下载按钮事件监听
        const downloadButtons = modelCard.querySelectorAll('.download-variant-btn');
        downloadButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modelName = e.target.getAttribute('data-model');
                const variant = e.target.getAttribute('data-variant');
                const modelSize = e.target.getAttribute('data-size');
                
                // 检查模型是否已下载
                const isAlreadyDownloaded = offlineModels.some(m => 
                    m.name === `${modelName} (${variant})`
                );
                
                if (isAlreadyDownloaded) {
                    alert(`模型 ${modelName} (${variant}) 已经下载过了。`);
                    return;
                }
                
                // 添加到下载队列
                addModelToDownloadQueue(modelName, variant, modelSize);
                
                // 提示用户
                alert(`已将 ${modelName} (${variant}) 添加到下载队列。您可以点击"下载中"按钮查看下载进度。`);
            });
        });
        
        modelList.appendChild(modelCard);
    });
    
    hfModelsContainer.appendChild(modelList);
}

// 下载队列
let downloadQueue = [];

// 添加模型到下载队列
function addModelToDownloadQueue(modelName, variant, modelSize) {
    // 创建下载项
    const downloadItem = {
        id: `download_${Date.now()}`,
        modelName,
        variant,
        modelSize,
        progress: 0,
        status: '准备下载...'
    };
    
    // 添加到队列
    downloadQueue.push(downloadItem);
    
    // 更新下载计数
    updateDownloadCount();
    
    // 开始下载
    startModelDownload(downloadItem);
    
    return downloadItem;
}

// 更新下载计数
function updateDownloadCount() {
    if (downloadCountElement) {
        // 计算未完成的下载数量
        const activeDownloads = downloadQueue.filter(item => item.progress < 100).length;
        downloadCountElement.textContent = activeDownloads;
        
        // 显示或隐藏计数
        downloadCountElement.style.display = activeDownloads > 0 ? 'inline-block' : 'none';
    }
}

// 开始模型下载（主要方法）
function startModelDownload(downloadItem) {
    console.log(`开始下载模型: ${downloadItem.modelName} (${downloadItem.variant})`);
    
    // 模拟下载过程
    let interval = setInterval(() => {
        // 更新进度
        downloadItem.progress += 1;
        
        // 更新状态文本
        if (downloadItem.progress < 10) {
            downloadItem.status = '准备下载...';
        } else if (downloadItem.progress < 90) {
            downloadItem.status = `下载中: ${downloadItem.progress}% (${downloadItem.modelSize})`;
        } else if (downloadItem.progress < 100) {
            downloadItem.status = '验证模型完整性...';
        } else {
            downloadItem.status = '下载完成！';
            clearInterval(interval);
            
            // 添加到离线模型列表
            const newModel = {
                id: `${downloadItem.modelName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`,
                name: `${downloadItem.modelName} (${downloadItem.variant})`,
                source: 'downloaded',
                size: downloadItem.modelSize,
                ramRequired: '8GB' // 简化，实际应该从模型数据获取
            };
            
            offlineModels.push(newModel);
            
            // 重新加载模型列表
            loadOfflineModels();
            
            // 更新下载计数
            updateDownloadCount();
            
            // 在实际应用中，这里会保存到本地存储
            console.log(`下载模型完成: ${downloadItem.modelName} (${downloadItem.variant})`);
        }
        
        // 如果有打开的下载中模态框，更新它
        updateDownloadingModelsModal();
        
    }, 200); // 每200毫秒更新一次，加快模拟速度
}

// 显示下载中模型模态框
function showDownloadingModelsModal() {
    const modal = showModal('downloading-models-template');
    if (!modal) return;
    
    // 更新下载列表
    updateDownloadingModelsModal(modal);
}

// 更新下载中模型模态框
function updateDownloadingModelsModal(modal) {
    // 如果没有传入modal参数，尝试获取当前打开的模态框
    if (!modal) {
        modal = document.querySelector('.modal');
        if (!modal || !modal.querySelector('#downloading-models-list')) return;
    }
    
    const downloadsList = modal.querySelector('#downloading-models-list');
    if (!downloadsList) return;
    
    // 清空列表
    downloadsList.innerHTML = '';
    
    // 过滤出活跃的下载
    const activeDownloads = downloadQueue.filter(item => item.progress < 100);
    const completedDownloads = downloadQueue.filter(item => item.progress >= 100);
    
    if (activeDownloads.length === 0 && completedDownloads.length === 0) {
        // 显示空状态
        downloadsList.innerHTML = `
            <div class="empty-downloads">
                <div class="empty-icon"><i class="ri-download-cloud-line"></i></div>
                <p>当前没有正在下载的模型</p>
            </div>
        `;
        return;
    }
    
    // 添加活跃下载
    if (activeDownloads.length > 0) {
        const activeSection = document.createElement('div');
        activeSection.className = 'download-section';
        
        const activeSectionTitle = document.createElement('h4');
        activeSectionTitle.textContent = '正在下载';
        activeSection.appendChild(activeSectionTitle);
        
        activeDownloads.forEach(item => {
            const downloadItem = document.createElement('div');
            downloadItem.className = 'download-item';
            downloadItem.innerHTML = `
                <div class="download-item-info">
                    <div class="download-item-name">${item.modelName} (${item.variant})</div>
                    <div class="download-item-status">${item.status}</div>
                </div>
                <div class="download-progress-container">
                    <div class="download-progress" style="width: ${item.progress}%"></div>
                </div>
            `;
            activeSection.appendChild(downloadItem);
        });
        
        downloadsList.appendChild(activeSection);
    }
    
    // 添加完成的下载
    if (completedDownloads.length > 0) {
        const completedSection = document.createElement('div');
        completedSection.className = 'download-section';
        
        const completedSectionTitle = document.createElement('h4');
        completedSectionTitle.textContent = '已完成下载';
        completedSection.appendChild(completedSectionTitle);
        
        // 只显示最近5个完成的下载
        const recentCompleted = completedDownloads.slice(-5);
        
        recentCompleted.forEach(item => {
            const downloadItem = document.createElement('div');
            downloadItem.className = 'download-item completed';
            downloadItem.innerHTML = `
                <div class="download-item-info">
                    <div class="download-item-name">${item.modelName} (${item.variant})</div>
                    <div class="download-item-status">${item.status}</div>
                </div>
                <div class="download-progress-container">
                    <div class="download-progress" style="width: 100%"></div>
                </div>
            `;
            completedSection.appendChild(downloadItem);
        });
        
        downloadsList.appendChild(completedSection);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init); 