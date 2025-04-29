// DOM元素
const settingsContent = document.querySelector('.settings-content');
const appSettingsContainer = document.getElementById('app-settings-container');

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

// 初始化函数
function init() {
    // 加载应用程序设置
    loadAppSettings();

    // 尝试移除可能存在的模态遮罩层
    const existingOverlay = document.querySelector('.modal-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
        console.log('Removed existing modal overlay.');
    }
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
        },
        {
            id: 'version',
            name: '当前版本',
            type: 'info',
            value: 'Grove AI Studio v1.0.0' // TODO: Consider making this dynamic
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
    
    // 添加设置组到容器
    appSettingsContainer.appendChild(appearanceGroup);
    appSettingsContainer.appendChild(updatesGroup);
    appSettingsContainer.appendChild(dataGroup);
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
    alert('正在检查更新...\n\n在真实应用中，这里会连接到更新服务器检查新版本。');
}

// 备份数据
function backupData() {
    console.log('备份数据');
    alert('正在准备备份数据...\n\n在真实应用中，这里会将所有数据导出到一个加密的备份文件。');
}

// 恢复数据
function restoreData() {
    console.log('恢复数据');
    alert('准备从备份恢复...\n\n在真实应用中，这里会打开文件选择器让您选择备份文件。');
}

// 重置应用程序数据
function resetAppData() {
    console.log('重置应用程序数据');
    if (confirm('您确定要重置所有数据吗？此操作不可撤销。')) {
        alert('正在重置应用程序数据...\n\n在真实应用中，这里会清除所有本地数据并重启应用。');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init); 