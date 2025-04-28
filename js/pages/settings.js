// 导入模块
import { getAvailableModels, getDefaultModel } from '../models.js';

// DOM元素
const settingsContainer = document.querySelector('.settings-container');

// 初始化
function init() {
    // 加载设置界面
    renderSettings();
}

// 渲染设置界面
function renderSettings() {
    const settings = {
        general: [
            { id: 'theme', name: '主题', type: 'select', options: ['浅色', '深色', '跟随系统'], defaultValue: '跟随系统' },
            { id: 'language', name: '语言', type: 'select', options: ['简体中文', 'English'], defaultValue: '简体中文' }
        ],
        models: [
            { id: 'default_model', name: '默认AI模型', type: 'model-select', defaultValue: getDefaultModel().id },
            { id: 'default_creativity', name: '默认创意度', type: 'range', min: 0, max: 100, defaultValue: 50 }
        ],
        api: [
            { id: 'api_key', name: 'API密钥', type: 'password', defaultValue: '' },
            { id: 'api_url', name: 'API地址', type: 'text', defaultValue: 'https://api.example.com' }
        ],
        advanced: [
            { id: 'system_prompt', name: '系统提示词', type: 'textarea', defaultValue: '' },
            { id: 'max_tokens', name: '最大生成长度', type: 'number', defaultValue: 4096 },
            { id: 'debug_mode', name: '调试模式', type: 'checkbox', defaultValue: false }
        ]
    };
    
    // 清空容器
    settingsContainer.innerHTML = '';
    
    // 为每个分类创建设置组
    Object.entries(settings).forEach(([category, items]) => {
        const groupElement = document.createElement('div');
        groupElement.className = 'settings-group';
        
        // 创建分类标题
        const titleElement = document.createElement('h3');
        titleElement.className = 'settings-category';
        titleElement.textContent = getCategoryName(category);
        groupElement.appendChild(titleElement);
        
        // 创建设置项
        items.forEach(item => {
            const settingElement = document.createElement('div');
            settingElement.className = 'setting-item';
            
            // 创建设置标签
            const labelElement = document.createElement('label');
            labelElement.htmlFor = item.id;
            labelElement.textContent = item.name;
            settingElement.appendChild(labelElement);
            
            // 根据类型创建不同的输入控件
            let inputElement;
            
            switch (item.type) {
                case 'select':
                    inputElement = document.createElement('select');
                    inputElement.id = item.id;
                    item.options.forEach(option => {
                        const optionElement = document.createElement('option');
                        optionElement.value = option;
                        optionElement.textContent = option;
                        optionElement.selected = option === item.defaultValue;
                        inputElement.appendChild(optionElement);
                    });
                    break;
                    
                case 'model-select':
                    inputElement = document.createElement('select');
                    inputElement.id = item.id;
                    getAvailableModels().forEach(model => {
                        const optionElement = document.createElement('option');
                        optionElement.value = model.id;
                        optionElement.textContent = model.name;
                        optionElement.selected = model.id === item.defaultValue;
                        inputElement.appendChild(optionElement);
                    });
                    break;
                    
                case 'range':
                    const rangeContainer = document.createElement('div');
                    rangeContainer.className = 'range-container';
                    
                    inputElement = document.createElement('input');
                    inputElement.type = 'range';
                    inputElement.id = item.id;
                    inputElement.min = item.min;
                    inputElement.max = item.max;
                    inputElement.value = item.defaultValue;
                    
                    const valueDisplay = document.createElement('span');
                    valueDisplay.className = 'range-value';
                    valueDisplay.textContent = item.defaultValue;
                    
                    inputElement.addEventListener('input', () => {
                        valueDisplay.textContent = inputElement.value;
                    });
                    
                    rangeContainer.appendChild(inputElement);
                    rangeContainer.appendChild(valueDisplay);
                    inputElement = rangeContainer;
                    break;
                    
                case 'textarea':
                    inputElement = document.createElement('textarea');
                    inputElement.id = item.id;
                    inputElement.value = item.defaultValue;
                    inputElement.rows = 4;
                    break;
                    
                case 'checkbox':
                    const checkboxContainer = document.createElement('div');
                    checkboxContainer.className = 'checkbox-container';
                    
                    inputElement = document.createElement('input');
                    inputElement.type = 'checkbox';
                    inputElement.id = item.id;
                    inputElement.checked = item.defaultValue;
                    
                    const toggle = document.createElement('span');
                    toggle.className = 'toggle';
                    
                    checkboxContainer.appendChild(inputElement);
                    checkboxContainer.appendChild(toggle);
                    inputElement = checkboxContainer;
                    break;
                    
                default:
                    inputElement = document.createElement('input');
                    inputElement.type = item.type;
                    inputElement.id = item.id;
                    inputElement.value = item.defaultValue;
                    break;
            }
            
            settingElement.appendChild(inputElement);
            groupElement.appendChild(settingElement);
        });
        
        // 添加到设置容器
        settingsContainer.appendChild(groupElement);
    });
    
    // 添加保存和重置按钮
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'settings-buttons';
    
    const saveButton = document.createElement('button');
    saveButton.className = 'save-settings';
    saveButton.textContent = '保存设置';
    saveButton.addEventListener('click', saveSettings);
    
    const resetButton = document.createElement('button');
    resetButton.className = 'reset-settings';
    resetButton.textContent = '重置默认';
    resetButton.addEventListener('click', resetSettings);
    
    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(resetButton);
    settingsContainer.appendChild(buttonContainer);
}

// 获取分类名称
function getCategoryName(category) {
    const names = {
        general: '常规设置',
        models: '模型设置',
        api: 'API设置',
        advanced: '高级设置'
    };
    
    return names[category] || category;
}

// 保存设置
function saveSettings() {
    console.log('保存设置');
    // 在实际应用中，这里会收集所有设置值并保存
    alert('设置已保存！\n\n在实际应用中，这里会收集所有设置值并保存到本地存储或发送到服务器。');
}

// 重置设置
function resetSettings() {
    console.log('重置设置');
    // 在实际应用中，这里会重置所有设置为默认值
    if (confirm('确定要重置所有设置为默认值吗？')) {
        alert('设置已重置为默认值！\n\n在实际应用中，这里会重置所有设置为默认值。');
        renderSettings();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init); 