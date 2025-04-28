// 导入模块
import { getAllTools } from '../tools.js';

// DOM元素
const toolsContainer = document.querySelector('.tools-container');

// 初始化
function init() {
    // 加载工具列表
    loadTools();
}

// 加载工具列表
function loadTools() {
    const tools = getAllTools().filter(tool => tool.type === 'local');
    
    // 清空容器
    toolsContainer.innerHTML = '';
    
    if (tools.length === 0) {
        toolsContainer.innerHTML = '<div class="empty-state">没有可用的本地工具</div>';
        return;
    }
    
    // 添加工具卡片
    tools.forEach(tool => {
        const toolCard = document.createElement('div');
        toolCard.className = 'tool-card';
        toolCard.innerHTML = `
            <div class="tool-icon">
                <i class="${tool.icon || 'ri-tools-line'}"></i>
            </div>
            <div class="tool-info">
                <h3>${tool.name}</h3>
                <p>${tool.description}</p>
            </div>
            <div class="tool-actions">
                <button class="run-tool" data-id="${tool.id}">运行</button>
                <button class="tool-settings" data-id="${tool.id}">
                    <i class="ri-settings-line"></i>
                </button>
            </div>
        `;
        
        // 添加到容器
        toolsContainer.appendChild(toolCard);
    });
    
    // 添加运行事件
    document.querySelectorAll('.run-tool').forEach(button => {
        button.addEventListener('click', (e) => {
            const toolId = e.target.dataset.id;
            runTool(toolId);
        });
    });
    
    // 添加设置事件
    document.querySelectorAll('.tool-settings').forEach(button => {
        button.addEventListener('click', (e) => {
            const toolId = e.target.closest('.tool-settings').dataset.id;
            openToolSettings(toolId);
        });
    });
}

// 运行工具
function runTool(toolId) {
    const tool = getAllTools().find(t => t.id === toolId);
    if (!tool) return;
    
    console.log(`运行工具: ${tool.name}`);
    // 在实际应用中，这里会打开工具运行界面或执行工具逻辑
    alert(`正在运行工具: ${tool.name}\n\n这个功能在实际应用中会执行工具的逻辑。`);
}

// 打开工具设置
function openToolSettings(toolId) {
    const tool = getAllTools().find(t => t.id === toolId);
    if (!tool) return;
    
    console.log(`打开设置: ${tool.name}`);
    // 在实际应用中，这里会打开工具设置界面
    alert(`工具设置: ${tool.name}\n\n这个功能在实际应用中会打开工具的设置界面。`);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init); 