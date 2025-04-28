// 工具配置表单定义
const toolConfigForms = {
    // 示例配置表单
    'example-tool': {
        fields: [
            {
                name: 'apiKey',
                label: 'API密钥',
                type: 'text',
                placeholder: '请输入API密钥',
                required: true
            },
            {
                name: 'endpoint',
                label: '服务端点',
                type: 'text',
                placeholder: '请输入服务端点URL',
                required: true
            }
        ]
    }
    // 可以在这里添加更多工具的配置表单
};

// 加载工具配置
function loadToolConfig(toolId) {
    const configForm = document.querySelector('.config-form');
    if (!configForm) return;

    const formConfig = toolConfigForms[toolId];
    if (!formConfig) {
        console.warn(`未找到工具 ${toolId} 的配置表单定义`);
        return;
    }

    // 生成表单HTML
    const formHTML = formConfig.fields.map(field => `
        <div class="form-group">
            <label for="${field.name}">${field.label}</label>
            <input type="${field.type}" 
                   id="${field.name}" 
                   name="${field.name}" 
                   placeholder="${field.placeholder}"
                   ${field.required ? 'required' : ''}>
        </div>
    `).join('');

    // 添加提交按钮
    const submitButton = `
        <div class="form-actions">
            <button type="submit" class="btn btn-primary">保存配置</button>
        </div>
    `;

    // 设置表单内容
    configForm.innerHTML = formHTML + submitButton;

    // 尝试加载已保存的配置
    loadSavedConfig(toolId);
}

// 保存工具配置
function saveToolConfig(toolId, configData) {
    try {
        // 保存到localStorage
        localStorage.setItem(`tool_config_${toolId}`, JSON.stringify(configData));
        alert('配置已保存');
    } catch (error) {
        console.error('保存配置失败:', error);
        alert('保存配置失败');
    }
}

// 加载已保存的配置
function loadSavedConfig(toolId) {
    try {
        const savedConfig = localStorage.getItem(`tool_config_${toolId}`);
        if (savedConfig) {
            const configData = JSON.parse(savedConfig);
            const configForm = document.querySelector('.config-form');
            
            // 填充表单数据
            Object.entries(configData).forEach(([key, value]) => {
                const input = configForm.querySelector(`#${key}`);
                if (input) {
                    input.value = value;
                }
            });
        }
    } catch (error) {
        console.error('加载配置失败:', error);
    }
}

// 初始化配置表单
function initConfigForm() {
    const configForm = document.querySelector('.config-form');
    if (!configForm) return;

    // 获取当前工具ID
    const toolId = configForm.dataset.toolId || 'example-tool';
    
    // 加载工具配置
    loadToolConfig(toolId);

    // 处理表单提交
    configForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 获取表单数据
        const formData = new FormData(configForm);
        const configData = Object.fromEntries(formData.entries());
        
        // 保存配置
        saveToolConfig(toolId, configData);
    });
}

// 标签页切换功能
function initTabs() {
    const tabs = document.querySelectorAll('.tab-item');
    const tabPanes = document.querySelectorAll('.tab-pane');

    // 初始化显示第一个标签页
    if (tabs.length > 0 && tabPanes.length > 0) {
        tabs[0].classList.add('active');
        tabPanes[0].classList.add('active');

        tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                // 移除所有标签和内容区域的active类
                tabs.forEach(t => t.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));

                // 为当前点击的标签和对应的内容区域添加active类
                tab.classList.add('active');
                tabPanes[index].classList.add('active');
            });
        });
    }
}

// 初始化页面
function init() {
    initTabs();
    initConfigForm();
}

// 当DOM加载完成时初始化页面
document.addEventListener('DOMContentLoaded', init); 