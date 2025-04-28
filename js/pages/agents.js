// 导入模块
import { getAvailableAgents, getAgentTools } from '../agents.js';

// DOM元素
const agentsContainer = document.querySelector('.agents-container');

// 初始化
function init() {
    // 加载智能体列表
    loadAgents();
}

// 加载智能体列表
function loadAgents() {
    const agents = getAvailableAgents();
    
    // 清空容器
    agentsContainer.innerHTML = '';
    
    if (agents.length === 0) {
        agentsContainer.innerHTML = '<div class="empty-state">没有可用的智能体</div>';
        return;
    }
    
    // 添加智能体卡片
    agents.forEach(agent => {
        const agentCard = document.createElement('div');
        agentCard.className = 'agent-card';
        
        // 获取智能体可用的工具
        const agentTools = getAgentTools(agent.id);
        const toolsHtml = agentTools.length > 0 
            ? `<div class="agent-tools">
                <h4>可用工具:</h4>
                <ul>
                    ${agentTools.map(tool => `<li>${tool.name}</li>`).join('')}
                </ul>
               </div>`
            : '';
        
        agentCard.innerHTML = `
            <div class="agent-icon">
                <i class="${agent.icon || 'ri-robot-line'}"></i>
            </div>
            <div class="agent-info">
                <h3>${agent.name}</h3>
                <p>${agent.description}</p>
                ${toolsHtml}
            </div>
            <div class="agent-actions">
                <button class="use-agent" data-id="${agent.id}">使用</button>
                <button class="customize-agent" data-id="${agent.id}">自定义</button>
            </div>
        `;
        
        // 添加到容器
        agentsContainer.appendChild(agentCard);
    });
    
    // 添加使用事件
    document.querySelectorAll('.use-agent').forEach(button => {
        button.addEventListener('click', (e) => {
            const agentId = e.target.dataset.id;
            useAgent(agentId);
        });
    });
    
    // 添加自定义事件
    document.querySelectorAll('.customize-agent').forEach(button => {
        button.addEventListener('click', (e) => {
            const agentId = e.target.dataset.id;
            customizeAgent(agentId);
        });
    });
}

// 使用智能体
function useAgent(agentId) {
    const agent = getAvailableAgents().find(a => a.id === agentId);
    if (!agent) return;
    
    console.log(`使用智能体: ${agent.name}`);
    // 在实际应用中，这里会打开工作台并设置为该智能体
    alert(`正在切换到智能体: ${agent.name}\n\n这个功能在实际应用中会切换到工作台并设置为该智能体。`);
    window.location.href = 'index.html';
}

// 自定义智能体
function customizeAgent(agentId) {
    const agent = getAvailableAgents().find(a => a.id === agentId);
    if (!agent) return;
    
    console.log(`自定义智能体: ${agent.name}`);
    // 在实际应用中，这里会打开智能体自定义界面
    alert(`自定义智能体: ${agent.name}\n\n这个功能在实际应用中会打开智能体的自定义界面。`);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init); 