// 导入模块
import { getAllTools } from '../tools.js';

// DOM元素
const toolsContainer = document.querySelector('.tools-container');

// 初始化
function init() {
    // 加载工具列表
    loadTools();
}

// 本地工具数据
const localTools = [
    {
        id: 'knowledge_base',
        name: '知识库',
        description: '创建和导入文档，使用AI进行本地知识问答，确保数据私密安全',
        icon: 'ri-book-open-line'
    },
    {
        id: 'web_search',
        name: '联网搜索',
        description: '通过AI助手在互联网上搜索和整理信息，高效获取最新资讯',
        icon: 'ri-search-line'
    },
    {
        id: 'file_assistant',
        name: '文件助手',
        description: '安全地授权AI访问、管理和组织您的文件和文件夹，提高工作效率',
        icon: 'ri-folder-line'
    },
    {
        id: 'database',
        name: '数据库',
        description: '创建本地数据库存储和检索结构化数据，AI帮您轻松管理日常信息',
        icon: 'ri-database-2-line'
    },
    {
        id: 'notes',
        name: '笔记',
        description: '使用AI辅助创建和管理本地笔记，整理思路，提升写作效率',
        icon: 'ri-file-text-line'
    }
];

// 加载工具列表
function loadTools() {
    // 清空容器
    toolsContainer.innerHTML = '';
    
    // 添加工具卡片
    localTools.forEach(tool => {
        const toolCard = document.createElement('div');
        toolCard.className = 'tool-card';
        toolCard.dataset.id = tool.id;
        toolCard.innerHTML = `
            <div class="tool-header">
                <div class="tool-icon">
                    <i class="${tool.icon}"></i>
                </div>
                <div class="tool-info">
                    <h3>${tool.name}</h3>
                    <p>${tool.description}</p>
                </div>
            </div>
            <div class="tool-arrow">
                <i class="ri-arrow-right-line"></i>
            </div>
        `;
        
        // 添加点击事件
        toolCard.addEventListener('click', () => {
            openTool(tool.id);
        });
        
        // 添加到容器
        toolsContainer.appendChild(toolCard);
    });
}

// 打开工具
function openTool(toolId) {
    const tool = localTools.find(t => t.id === toolId);
    if (!tool) return;
    
    console.log(`打开工具: ${tool.name}`);
    
    switch(toolId) {
        case 'knowledge_base':
            // 跳转到知识库页面
            window.location.href = 'knowledge-base.html';
            break;
        case 'web_search':
            alert(`打开联网搜索\n\n在实际应用中，这会打开搜索页面。`);
            break;
        case 'file_assistant':
            alert(`打开文件助手\n\n在实际应用中，这会打开文件助手页面。`);
            break;
        case 'database':
            alert(`打开数据库\n\n在实际应用中，这会打开数据库页面。`);
            break;
        case 'notes':
            alert(`打开笔记\n\n在实际应用中，这会打开笔记页面。`);
            break;
        default:
            alert(`打开工具: ${tool.name}\n\n在实际应用中，这会打开对应工具页面。`);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init); 