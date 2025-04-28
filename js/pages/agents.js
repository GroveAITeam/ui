// 导入模块
import { getAvailableAgents, getAgentTools, simulateToolCall } from '../agents.js';

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
        
        // 构建交互说明HTML
        const interactionHtml = agent.interactionDescription ? 
            `<div class="agent-interaction">
                <h4>交互能力:</h4>
                <p>${agent.interactionDescription}</p>
            </div>` : '';
        
        // 构建卡片HTML
        agentCard.innerHTML = `
            <div class="agent-icon">
                <i class="${agent.icon || 'ri-robot-line'}"></i>
            </div>
            <div class="agent-info">
                <h3>${agent.name}</h3>
                <p>${agent.description}</p>
                ${interactionHtml}
            </div>
            <div class="agent-actions">
                <button class="use-agent" data-id="${agent.id}">使用</button>
                <button class="demo-agent" data-id="${agent.id}">交互演示</button>
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
    
    // 添加演示事件
    document.querySelectorAll('.demo-agent').forEach(button => {
        button.addEventListener('click', (e) => {
            const agentId = e.target.dataset.id;
            showAgentDemo(agentId);
        });
    });
}

// 使用智能体
function useAgent(agentId) {
    const agent = getAvailableAgents().find(a => a.id === agentId);
    if (!agent) return;
    
    console.log(`使用智能体: ${agent.name}`);
    // 在实际应用中，这里会打开工作台并设置为该智能体
    window.location.href = 'index.html';
}

// 显示智能体交互演示
function showAgentDemo(agentId) {
    const agent = getAvailableAgents().find(a => a.id === agentId);
    if (!agent) return;
    
    // 移除可能已存在的演示对话框
    const existingDialogs = document.querySelectorAll('.demo-dialog');
    existingDialogs.forEach(dialog => {
        document.body.removeChild(dialog);
    });
    
    // 创建演示对话框
    const demoDialog = document.createElement('div');
    demoDialog.className = 'demo-dialog';
    
    // 示例查询和工具
    const demoQueries = [
        { query: "帮我查找关于人工智能的最新研究", tool: "web_search" },
        { query: "帮我整理Downloads文件夹中的文档", tool: "file_assistant" },
        { query: "帮我记录今天的会议内容", tool: "notes" }
    ];
    const randomDemo = demoQueries[Math.floor(Math.random() * demoQueries.length)];
    
    // 对话框内容
    demoDialog.innerHTML = `
        <div class="demo-dialog-container">
            <div class="demo-dialog-header">
                <h3>${agent.name} 交互演示</h3>
                <button class="close-demo"><i class="ri-close-line"></i></button>
            </div>
            <div class="demo-dialog-content">
                <div class="demo-chat">
                    <div class="demo-message user-message">
                        <div class="message-avatar">用户</div>
                        <div class="message-content">${randomDemo.query}</div>
                    </div>
                    <div class="demo-message ai-message ai-thinking">
                        <div class="message-avatar">AI</div>
                        <div class="message-content">
                            <div class="thinking-indicator">思考中<span class="dots"><span>.</span><span>.</span><span>.</span></span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 先添加到页面，以便后续获取元素
    document.body.appendChild(demoDialog);
    
    // 强制重绘以确保样式应用
    window.getComputedStyle(demoDialog).opacity;
    
    // 关闭按钮事件
    demoDialog.querySelector('.close-demo').addEventListener('click', () => {
        // 添加淡出效果
        demoDialog.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(demoDialog)) {
                document.body.removeChild(demoDialog);
            }
        }, 300);
    });
    
    // 模拟智能体交互过程
    setTimeout(() => {
        // 移除思考中的消息
        const thinkingMsg = demoDialog.querySelector('.ai-thinking');
        if (thinkingMsg) thinkingMsg.parentNode.removeChild(thinkingMsg);
        
        // 添加AI思考过程
        const demoChat = demoDialog.querySelector('.demo-chat');
        const thinkingMessage = document.createElement('div');
        thinkingMessage.className = 'demo-message ai-message';
        thinkingMessage.innerHTML = `
            <div class="message-avatar">AI</div>
            <div class="message-content">
                <div class="ai-thinking-process">
                    <i class="ri-brain-line"></i> 思考过程
                </div>
                <p>分析您的请求"${randomDemo.query}"，我需要获取相关信息。我可以使用工具来帮助完成这个任务。</p>
            </div>
        `;
        demoChat.appendChild(thinkingMessage);
        
        // 模拟工具调用请求
        setTimeout(() => {
            const toolRequestMessage = document.createElement('div');
            toolRequestMessage.className = 'demo-message ai-message tool-request';
            toolRequestMessage.innerHTML = `
                <div class="message-avatar">AI</div>
                <div class="message-content">
                    <div class="tool-request-header">
                        <i class="ri-tools-line"></i> 工具调用请求
                    </div>
                    <p>我需要使用<strong>${getAgentTools(agent.id).find(t => t.id === randomDemo.tool).name}</strong>来完成您的请求。</p>
                    <div class="tool-approval">
                        <button class="approve-tool">允许</button>
                        <button class="deny-tool">拒绝</button>
                    </div>
                </div>
            `;
            demoChat.appendChild(toolRequestMessage);
            
            // 添加工具批准/拒绝按钮事件
            toolRequestMessage.querySelector('.approve-tool').addEventListener('click', () => {
                // 移除批准按钮
                const approvalDiv = toolRequestMessage.querySelector('.tool-approval');
                approvalDiv.innerHTML = '<div class="tool-approved">已批准</div>';
                
                // 显示工具执行
                setTimeout(() => {
                    const toolExecutionMessage = document.createElement('div');
                    toolExecutionMessage.className = 'demo-message ai-message tool-execution';
                    toolExecutionMessage.innerHTML = `
                        <div class="message-avatar">AI</div>
                        <div class="message-content">
                            <div class="tool-execution-header">
                                <i class="ri-settings-line"></i> 工具执行中
                            </div>
                            <div class="tool-progress">
                                <div class="progress-bar"></div>
                            </div>
                        </div>
                    `;
                    demoChat.appendChild(toolExecutionMessage);
                    
                    // 模拟进度条
                    const progressBar = toolExecutionMessage.querySelector('.progress-bar');
                    let progress = 0;
                    const progressInterval = setInterval(() => {
                        progress += 10;
                        progressBar.style.width = `${progress}%`;
                        if (progress >= 100) {
                            clearInterval(progressInterval);
                            
                            // 显示最终结果
                            setTimeout(() => {
                                const finalMessage = document.createElement('div');
                                finalMessage.className = 'demo-message ai-message';
                                finalMessage.innerHTML = `
                                    <div class="message-avatar">AI</div>
                                    <div class="message-content">
                                        <p>我已经使用${getAgentTools(agent.id).find(t => t.id === randomDemo.tool).name.split(' - ')[0]}工具完成了您的请求。</p>
                                        <p>这是一个演示示例，在实际使用中，我会提供基于工具调用结果的详细回答。</p>
                                    </div>
                                `;
                                demoChat.appendChild(finalMessage);
                                
                                // 滚动到底部
                                demoDialog.querySelector('.demo-dialog-content').scrollTop = demoDialog.querySelector('.demo-dialog-content').scrollHeight;
                            }, 800);
                        }
                    }, 200);
                }, 1000);
                
                // 滚动到底部
                demoDialog.querySelector('.demo-dialog-content').scrollTop = demoDialog.querySelector('.demo-dialog-content').scrollHeight;
            });
            
            toolRequestMessage.querySelector('.deny-tool').addEventListener('click', () => {
                // 移除批准按钮
                const approvalDiv = toolRequestMessage.querySelector('.tool-approval');
                approvalDiv.innerHTML = '<div class="tool-denied">已拒绝</div>';
                
                // 显示备选回答
                setTimeout(() => {
                    const alternativeMessage = document.createElement('div');
                    alternativeMessage.className = 'demo-message ai-message';
                    alternativeMessage.innerHTML = `
                        <div class="message-avatar">AI</div>
                        <div class="message-content">
                            <p>我理解您不希望使用工具。我将尝试直接回答您的问题，但可能无法提供最完整或最新的信息。</p>
                            <p>这是一个演示示例，在实际使用中，我会尽力提供不依赖外部工具的回答。</p>
                        </div>
                    `;
                    demoChat.appendChild(alternativeMessage);
                    
                    // 滚动到底部
                    demoDialog.querySelector('.demo-dialog-content').scrollTop = demoDialog.querySelector('.demo-dialog-content').scrollHeight;
                }, 800);
            });
            
            // 滚动到底部
            demoDialog.querySelector('.demo-dialog-content').scrollTop = demoDialog.querySelector('.demo-dialog-content').scrollHeight;
        }, 1500);
        
        // 滚动到底部
        demoDialog.querySelector('.demo-dialog-content').scrollTop = demoDialog.querySelector('.demo-dialog-content').scrollHeight;
    }, 2000);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init); 