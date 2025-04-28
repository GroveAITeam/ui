/**
 * knowledge-base.js
 * 知识库页面的交互逻辑
 */

// 导入模块
import { getKnowledgeBases, createKnowledgeBase, updateKnowledgeBase, deleteKnowledgeBase, 
         getKnowledgeBaseDocuments, addDocumentToKnowledgeBase, removeDocumentFromKnowledgeBase,
         testKnowledgeBaseIndex } from '../knowledge-base.js';

// DOM元素
const kbListEl = document.getElementById('kb-list');
const emptyKbStateEl = document.getElementById('empty-kb-state');
const kbDetailEmptyEl = document.getElementById('kb-detail-empty');
const kbDetailEl = document.getElementById('kb-detail');
const kbDetailTitleEl = document.getElementById('kb-detail-title');
const kbDetailDescriptionEl = document.getElementById('kb-detail-description');
const documentsListEl = document.getElementById('documents-list');
const emptyDocumentsStateEl = document.getElementById('empty-documents-state');
const documentCountEl = document.getElementById('document-count');
const indexStatusEl = document.getElementById('index-status');
const lastUpdatedEl = document.getElementById('last-updated');
const documentSearchEl = document.getElementById('document-search');

// 模态框
const createKbBtn = document.getElementById('create-kb-btn');
const createKbModal = document.getElementById('create-kb-modal');
const createKbForm = document.getElementById('create-kb-form');
const createKbSubmit = document.getElementById('create-kb-submit');

const addDocumentBtn = document.getElementById('add-document-btn');
const addDocumentModal = document.getElementById('add-document-modal');
const fileUploadBtn = document.getElementById('file-upload-btn');
const fileUploadInput = document.getElementById('file-upload');
const uploadArea = document.getElementById('upload-area');
const selectedFilesEl = document.getElementById('selected-files');
const uploadSubmit = document.getElementById('upload-submit');

const kbSettingsBtn = document.getElementById('kb-settings-btn');
const kbSettingsModal = document.getElementById('kb-settings-modal');
const kbSettingsForm = document.getElementById('kb-settings-form');
const kbNameEditEl = document.getElementById('kb-name-edit');
const kbDescriptionEditEl = document.getElementById('kb-description-edit');
const kbSettingsSubmit = document.getElementById('kb-settings-submit');
const deleteKbBtn = document.getElementById('delete-kb-btn');

const deleteConfirmModal = document.getElementById('delete-confirm-modal');
const deleteKbNameEl = document.getElementById('delete-kb-name');
const deleteKbConfirm = document.getElementById('delete-kb-confirm');

// 标签页
const kbTabsEl = document.querySelectorAll('.kb-tab');
const kbTabContentsEl = document.querySelectorAll('.kb-tab-content');

// 搜索测试相关元素
const searchTestQueryEl = document.getElementById('search-test-query');
const runSearchTestBtn = document.getElementById('run-search-test-btn');
const searchTestResultsEl = document.getElementById('search-test-results');
const searchTestPaginationEl = document.getElementById('search-test-pagination');

// 全局状态
let knowledgeBases = [];
let currentKnowledgeBase = null;
let currentDocuments = [];
let selectedFiles = [];
let searchResults = [];
let currentSearchPage = 1;
let resultsPerPage = 5;

// 初始化
async function init() {
    // 加载知识库列表
    await loadKnowledgeBases();
    
    // 设置事件监听器
    setupEventListeners();
    
    // 根据当前标签页显示或隐藏文档操作按钮
    const activeTab = document.querySelector('.kb-tab.active');
    if (activeTab && activeTab.dataset.tab !== 'documents') {
        const kbDocumentsActions = document.getElementById('kb-documents-actions');
        kbDocumentsActions.style.display = 'none';
    }
}

// 设置事件监听器
function setupEventListeners() {
    // 标签页切换
    kbTabsEl.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            
            // 取消当前激活标签
            kbTabsEl.forEach(t => t.classList.remove('active'));
            kbTabContentsEl.forEach(c => c.classList.remove('active'));
            
            // 激活选中标签
            tab.classList.add('active');
            document.getElementById(`tab-${tabName}`).classList.add('active');
            
            // 根据标签页显示或隐藏文档操作按钮
            const kbDocumentsActions = document.getElementById('kb-documents-actions');
            if (tabName === 'documents') {
                kbDocumentsActions.style.display = 'flex';
            } else {
                kbDocumentsActions.style.display = 'none';
            }
        });
    });
    
    // 创建知识库
    createKbBtn.addEventListener('click', () => {
        // 重置表单
        createKbForm.reset();
        // 显示模态框
        createKbModal.classList.add('active');
    });
    
    createKbSubmit.addEventListener('click', async () => {
        const name = document.getElementById('kb-name').value.trim();
        const description = document.getElementById('kb-description').value.trim();
        
        if (!name) {
            alert('请输入知识库名称');
            return;
        }
        
        // 创建知识库
        await createNewKnowledgeBase(name, description);
        
        // 关闭模态框
        createKbModal.classList.remove('active');
    });
    
    // 添加文档
    addDocumentBtn.addEventListener('click', () => {
        // 重置文件列表
        selectedFiles = [];
        selectedFilesEl.innerHTML = '';
        
        // 显示模态框
        addDocumentModal.classList.add('active');
    });
    
    // 文件上传
    fileUploadBtn.addEventListener('click', () => {
        fileUploadInput.click();
    });
    
    fileUploadInput.addEventListener('change', handleFileSelection);
    
    // 拖放上传
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        if (e.dataTransfer.files.length > 0) {
            handleFileSelection({ target: { files: e.dataTransfer.files } });
        }
    });
    
    // 上传文件
    uploadSubmit.addEventListener('click', async () => {
        if (selectedFiles.length === 0) {
            alert('请选择至少一个文件');
            return;
        }
        
        if (!currentKnowledgeBase) {
            alert('请先选择知识库');
            return;
        }
        
        await uploadDocuments();
        
        // 关闭模态框
        addDocumentModal.classList.remove('active');
    });
    
    // 知识库设置
    kbSettingsBtn.addEventListener('click', () => {
        if (!currentKnowledgeBase) return;
        
        // 填充表单
        kbNameEditEl.value = currentKnowledgeBase.name;
        kbDescriptionEditEl.value = currentKnowledgeBase.description || '';
        
        // 显示模态框
        kbSettingsModal.classList.add('active');
    });
    
    kbSettingsSubmit.addEventListener('click', async () => {
        if (!currentKnowledgeBase) return;
        
        const name = kbNameEditEl.value.trim();
        const description = kbDescriptionEditEl.value.trim();
        
        if (!name) {
            alert('请输入知识库名称');
            return;
        }
        
        // 更新知识库
        await updateKnowledgeBaseDetails(currentKnowledgeBase.id, name, description);
        
        // 关闭模态框
        kbSettingsModal.classList.remove('active');
    });
    
    // 删除知识库
    deleteKbBtn.addEventListener('click', () => {
        if (!currentKnowledgeBase) return;
        
        // 填充确认信息
        deleteKbNameEl.textContent = currentKnowledgeBase.name;
        
        // 显示确认模态框
        deleteConfirmModal.classList.add('active');
    });
    
    deleteKbConfirm.addEventListener('click', async () => {
        if (!currentKnowledgeBase) return;
        
        // 删除知识库
        await deleteKnowledgeBaseById(currentKnowledgeBase.id);
        
        // 关闭确认模态框
        deleteConfirmModal.classList.remove('active');
    });
    
    // 搜索文档
    documentSearchEl.addEventListener('input', () => {
        filterDocuments(documentSearchEl.value.trim().toLowerCase());
    });
    
    // 搜索测试
    runSearchTestBtn.addEventListener('click', async () => {
        const query = searchTestQueryEl.value.trim();
        
        if (!query) {
            alert('请输入查询内容');
            return;
        }
        
        // 显示加载状态
        searchTestResultsEl.innerHTML = `
            <div class="test-loading">
                <div class="spinner"></div>
            </div>
        `;
        
        // 进行测试
        await runSearchTest(query);
    });
    
    // Enter键触发搜索
    searchTestQueryEl.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = searchTestQueryEl.value.trim();
            
            if (!query) {
                alert('请输入查询内容');
                return;
            }
            
            // 显示加载状态
            searchTestResultsEl.innerHTML = `
                <div class="test-loading">
                    <div class="spinner"></div>
                </div>
            `;
            
            // 进行测试
            await runSearchTest(query);
        }
    });
    
    // 关闭模态框
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
        });
    });
    
    // 点击模态框外部关闭
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// 运行搜索测试
async function runSearchTest(query) {
    try {
        // 模拟加载时间
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 创建示例数据
        searchResults = generateExampleSearchResults(query);
        
        // 重置分页状态
        currentSearchPage = 1;
        
        // 渲染结果
        renderSearchResults();
    } catch (error) {
        console.error('搜索测试失败:', error);
        searchTestResultsEl.innerHTML = `
            <div class="empty-state active">
                <div class="empty-icon">
                    <i class="ri-error-warning-line"></i>
                </div>
                <h4>搜索测试失败</h4>
                <p>请稍后重试或联系管理员</p>
            </div>
        `;
    }
}

// 生成示例搜索结果
function generateExampleSearchResults(query) {
    // 准备几个示例段落
    const exampleParagraphs = [
        {
            content: "Grove AI Studio 是一个安全、私密且用户友好的桌面应用程序，整合多种AI驱动的工具以处理日常任务。它采用本地优先的方式，确保用户数据主要存储在本地设备上，增强隐私和控制。",
            filename: "介绍文档.md",
            documentId: "doc1",
            position: "第1段, 第1页"
        },
        {
            content: "核心对话式AI界面（工作台）支持会话和组织管理（Spaces）。集成在线（通过API）和本地（设备上运行）的LLM。从文本文档创建本地知识库，用于检索增强生成（RAG）。",
            filename: "功能概述.docx",
            documentId: "doc2",
            position: "第3段, 第2页"
        },
        {
            content: "知识库功能允许用户从.txt、.docx、.md文件创建可搜索的知识库。系统会自动将文档分割成段落，并使用嵌入模型生成向量表示，支持语义搜索功能。",
            filename: "知识库指南.txt",
            documentId: "doc3",
            position: "第1段, 第1页"
        },
        {
            content: "Grove AI Studio 的数据隐私是核心设计原则。所有用户数据优先存储在本地，只有在用户明确授权的情况下，数据才会传输到云端服务。这确保了用户对自己数据的完全控制权。",
            filename: "隐私政策.md",
            documentId: "doc4",
            position: "第2段, 第4页"
        },
        {
            content: "本地模型运行使用llama-cpp-python，支持在无网络环境下进行文本生成和向量检索。Grove AI Studio 会自动检测用户设备的GPU类型，并选择合适的模型变体以优化性能。",
            filename: "技术白皮书.docx",
            documentId: "doc5",
            position: "第7段, 第12页"
        },
        {
            content: "知识库检索使用向量相似度计算，根据用户查询内容找到最相关的文档段落。系统会自动为查询内容创建向量表示，并在向量数据库中搜索最相似的段落。",
            filename: "知识库指南.txt",
            documentId: "doc3",
            position: "第3段, 第2页"
        },
        {
            content: "AI助手可以根据知识库内容回答问题，提供准确的引用来源。用户可以验证回答并查看原始文档，确保信息的准确性和可靠性。",
            filename: "用户手册.md",
            documentId: "doc6",
            position: "第5段, 第9页"
        },
        {
            content: "当导入文档到知识库时，系统会自动处理文本，分割成适当大小的段落，生成向量嵌入，并存储在本地向量数据库中。这个过程完全在本地设备上完成，确保数据隐私。",
            filename: "知识库指南.txt",
            documentId: "doc3",
            position: "第4段, 第3页"
        },
        {
            content: "工作台支持多个会话，每个会话保持独立的上下文。用户可以在不同会话间切换，处理不同主题的对话，而不会混淆上下文信息。",
            filename: "功能概述.docx",
            documentId: "doc2",
            position: "第5段, 第3页"
        },
        {
            content: "Grove AI Studio 的离线模式允许用户在没有互联网连接的情况下继续使用核心功能，包括本地LLM聊天和知识库问答。这对于需要在移动环境或网络受限区域工作的用户特别有用。",
            filename: "用户手册.md",
            documentId: "doc6",
            position: "第8段, 第15页"
        },
        {
            content: "搜索测试功能允许用户验证知识库的索引效果，输入查询内容后系统会显示最相关的段落，包括相似度分数和原始文档信息。这有助于用户了解系统如何检索信息，并优化知识库内容。",
            filename: "知识库指南.txt",
            documentId: "doc3",
            position: "第6段, 第5页"
        },
        {
            content: "使用向量数据库技术（如LanceDB）进行高效的相似度搜索。每个文档段落都转换为高维向量，查询时系统计算查询向量与所有段落向量的余弦相似度，返回最相似的结果。",
            filename: "技术白皮书.docx",
            documentId: "doc5",
            position: "第10段, 第18页"
        }
    ];
    
    // 生成所有示例段落的结果
    const results = exampleParagraphs.map(p => {
        // 计算假的相似度分数
        const similarity = (0.7 + Math.random() * 0.3).toFixed(2);
        
        // 添加高亮（如果有查询词）
        const highlightedContent = query ? highlightQueryInText(p.content, query) : p.content;
        
        return {
            ...p,
            similarity,
            highlightedContent
        };
    });
    
    // 随机排序结果以模拟相关性
    results.sort(() => Math.random() - 0.5);
    
    return results;
}

// 在文本中高亮查询词
function highlightQueryInText(text, query) {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="result-highlight">$1</span>');
}

// 渲染搜索结果
function renderSearchResults() {
    if (searchResults.length === 0) {
        searchTestResultsEl.innerHTML = `
            <div class="empty-state active">
                <div class="empty-icon">
                    <i class="ri-search-line"></i>
                </div>
                <h4>未找到匹配的内容</h4>
                <p>请尝试使用不同的查询词或添加更多文档到知识库</p>
            </div>
        `;
        searchTestPaginationEl.innerHTML = '';
        return;
    }
    
    // 计算分页
    const totalPages = Math.ceil(searchResults.length / resultsPerPage);
    const startIndex = (currentSearchPage - 1) * resultsPerPage;
    const endIndex = Math.min(startIndex + resultsPerPage, searchResults.length);
    
    // 获取当前页的结果
    const pageResults = searchResults.slice(startIndex, endIndex);
    
    // 渲染结果
    let resultsHtml = `
        <div class="search-results-header">
            <h4>找到 ${searchResults.length} 个匹配结果</h4>
        </div>
    `;
    
    for (const result of pageResults) {
        resultsHtml += `
            <div class="search-result-item">
                <div class="search-result-header">
                    <h4 class="result-title">文档段落</h4>
                    <div class="result-source">
                        <i class="ri-file-text-line"></i>
                        ${result.filename}
                    </div>
                </div>
                <div class="result-content">
                    ${result.highlightedContent}
                </div>
                <div class="result-meta">
                    <div class="result-position">
                        ${result.position}
                    </div>
                </div>
            </div>
        `;
    }
    
    // 渲染分页控件
    let paginationHtml = '';
    
    if (totalPages > 1) {
        paginationHtml += `
            <div class="pagination-arrow ${currentSearchPage === 1 ? 'disabled' : ''}" data-page="prev">
                <i class="ri-arrow-left-s-line"></i>
            </div>
        `;
        
        // 显示页码
        for (let i = 1; i <= totalPages; i++) {
            // 只显示当前页附近的几个页码
            if (
                i === 1 || // 第一页
                i === totalPages || // 最后一页
                (i >= currentSearchPage - 1 && i <= currentSearchPage + 1) // 当前页附近
            ) {
                paginationHtml += `
                    <div class="pagination-item ${i === currentSearchPage ? 'active' : ''}" data-page="${i}">
                        ${i}
                    </div>
                `;
            } else if (
                (i === currentSearchPage - 2 && currentSearchPage > 3) ||
                (i === currentSearchPage + 2 && currentSearchPage < totalPages - 2)
            ) {
                // 显示省略号
                paginationHtml += `<div class="pagination-ellipsis">...</div>`;
            }
        }
        
        paginationHtml += `
            <div class="pagination-arrow ${currentSearchPage === totalPages ? 'disabled' : ''}" data-page="next">
                <i class="ri-arrow-right-s-line"></i>
            </div>
        `;
    }
    
    // 更新DOM
    searchTestResultsEl.innerHTML = resultsHtml;
    searchTestPaginationEl.innerHTML = paginationHtml;
    
    // 添加分页事件监听
    document.querySelectorAll('.pagination-item').forEach(item => {
        item.addEventListener('click', () => {
            currentSearchPage = parseInt(item.dataset.page);
            renderSearchResults();
            
            // 滚动到结果顶部
            searchTestResultsEl.scrollTop = 0;
        });
    });
    
    // 上一页/下一页按钮
    document.querySelectorAll('.pagination-arrow').forEach(arrow => {
        arrow.addEventListener('click', () => {
            if (arrow.classList.contains('disabled')) return;
            
            if (arrow.dataset.page === 'prev') {
                currentSearchPage = Math.max(1, currentSearchPage - 1);
            } else {
                currentSearchPage = Math.min(totalPages, currentSearchPage + 1);
            }
            
            renderSearchResults();
            
            // 滚动到结果顶部
            searchTestResultsEl.scrollTop = 0;
        });
    });
}

// 加载知识库列表
async function loadKnowledgeBases() {
    try {
        knowledgeBases = await getKnowledgeBases();
        
        // 清空列表
        const listContent = kbListEl.querySelector('.kb-list-content');
        if (listContent) {
            listContent.remove();
        }
        
        // 显示空状态或知识库列表
        if (knowledgeBases.length === 0) {
            emptyKbStateEl.classList.add('active');
        } else {
            emptyKbStateEl.classList.remove('active');
            
            // 创建知识库列表
            const kbListContent = document.createElement('div');
            kbListContent.className = 'kb-list-content';
            
            knowledgeBases.forEach(kb => {
                const kbItem = createKnowledgeBaseItem(kb);
                kbListContent.appendChild(kbItem);
            });
            
            kbListEl.appendChild(kbListContent);
            
            // 确保只有一个实例的空状态被显示
            document.querySelectorAll('.empty-state').forEach(el => {
                if (el !== emptyKbStateEl) {
                    el.classList.remove('active');
                }
            });
        }
    } catch (error) {
        console.error('加载知识库失败:', error);
        alert('加载知识库失败，请重试');
    }
}

// 创建知识库列表项
function createKnowledgeBaseItem(kb) {
    const kbItem = document.createElement('div');
    kbItem.className = 'kb-item';
    kbItem.dataset.id = kb.id;
    
    const isActive = currentKnowledgeBase && currentKnowledgeBase.id === kb.id;
    if (isActive) {
        kbItem.classList.add('active');
    }
    
    kbItem.innerHTML = `
        <div class="kb-item-icon">
            <i class="ri-book-open-line"></i>
        </div>
        <div class="kb-item-info">
            <h4>${kb.name}</h4>
            <p>${kb.description || '无描述'}</p>
            <div class="kb-item-meta">
                <span>${kb.documentCount || 0} 个文档</span>
                <span>创建于 ${formatDate(kb.createdAt)}</span>
            </div>
        </div>
    `;
    
    // 点击知识库项
    kbItem.addEventListener('click', () => {
        // 取消当前选中
        document.querySelectorAll('.kb-item.active').forEach(item => {
            item.classList.remove('active');
        });
        
        // 选中当前项
        kbItem.classList.add('active');
        
        // 加载知识库详情
        loadKnowledgeBaseDetails(kb.id);
    });
    
    return kbItem;
}

// 加载知识库详情
async function loadKnowledgeBaseDetails(kbId) {
    try {
        // 获取知识库信息
        const kb = knowledgeBases.find(kb => kb.id === kbId);
        if (!kb) return;
        
        currentKnowledgeBase = kb;
        
        // 更新界面
        kbDetailEmptyEl.classList.remove('active');
        kbDetailEl.classList.add('active');
        
        kbDetailTitleEl.textContent = kb.name;
        kbDetailDescriptionEl.textContent = kb.description || '无描述';
        
        // 确保知识库详情区域可见
        const kbDetailSection = document.getElementById('kb-detail-section');
        if (kbDetailSection) {
            kbDetailSection.style.display = 'block';
        }
        
        // 获取知识库文档
        await loadKnowledgeBaseDocuments(kbId);
    } catch (error) {
        console.error('加载知识库详情失败:', error);
        alert('加载知识库详情失败，请重试');
    }
}

// 加载知识库文档
async function loadKnowledgeBaseDocuments(kbId) {
    try {
        currentDocuments = await getKnowledgeBaseDocuments(kbId);
        
        // 更新文档数量
        documentCountEl.textContent = currentDocuments.length;
        
        // 更新索引状态
        indexStatusEl.textContent = currentKnowledgeBase.indexStatus || '未索引';
        
        // 更新最后更新时间
        lastUpdatedEl.textContent = currentKnowledgeBase.lastUpdated 
            ? formatDate(currentKnowledgeBase.lastUpdated) 
            : '-';
        
        // 显示文档列表
        renderDocumentsList();
    } catch (error) {
        console.error('加载知识库文档失败:', error);
        alert('加载知识库文档失败，请重试');
    }
}

// 渲染文档列表
function renderDocumentsList() {
    // 清空列表
    const listContent = documentsListEl.querySelector('.documents-list-content');
    if (listContent) {
        listContent.remove();
    }
    
    // 显示空状态或文档列表
    if (currentDocuments.length === 0) {
        emptyDocumentsStateEl.classList.add('active');
    } else {
        emptyDocumentsStateEl.classList.remove('active');
        
        // 创建文档列表
        const documentsListContent = document.createElement('div');
        documentsListContent.className = 'documents-list-content';
        
        currentDocuments.forEach(doc => {
            const docItem = createDocumentItem(doc);
            documentsListContent.appendChild(docItem);
        });
        
        documentsListEl.appendChild(documentsListContent);
    }
}

// 创建文档列表项
function createDocumentItem(doc) {
    const docItem = document.createElement('div');
    docItem.className = 'document-item';
    docItem.dataset.id = doc.id;
    
    const fileIcon = getFileIcon(doc.filename);
    
    docItem.innerHTML = `
        <div class="document-icon">
            <i class="${fileIcon}"></i>
        </div>
        <div class="document-info">
            <h4>${doc.filename}</h4>
            <div class="document-meta">
                <span>${formatFileSize(doc.size)}</span>
                <span>上传于 ${formatDate(doc.uploadedAt)}</span>
            </div>
        </div>
        <div class="document-actions">
            <button class="icon-btn document-delete" data-id="${doc.id}">
                <i class="ri-delete-bin-line"></i>
            </button>
        </div>
    `;
    
    // 删除文档
    docItem.querySelector('.document-delete').addEventListener('click', async (e) => {
        e.stopPropagation();
        
        if (confirm(`确定要删除文档"${doc.filename}"吗？`)) {
            await removeDocument(doc.id);
        }
    });
    
    return docItem;
}

// 处理文件选择
function handleFileSelection(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // 过滤支持的文件类型
    const supportedExtensions = ['.txt', '.docx', '.md'];
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = '.' + file.name.split('.').pop().toLowerCase();
        
        if (supportedExtensions.includes(fileExt)) {
            // 检查是否已经选择
            if (!selectedFiles.some(f => f.name === file.name)) {
                selectedFiles.push(file);
            }
        }
    }
    
    // 更新已选文件列表
    renderSelectedFiles();
}

// 渲染已选文件
function renderSelectedFiles() {
    selectedFilesEl.innerHTML = '';
    
    if (selectedFiles.length === 0) {
        return;
    }
    
    selectedFiles.forEach((file, index) => {
        const fileExt = '.' + file.name.split('.').pop().toLowerCase();
        const fileIcon = getFileIcon(file.name);
        
        const fileItem = document.createElement('div');
        fileItem.className = 'selected-file-item';
        fileItem.innerHTML = `
            <div class="file-icon">
                <i class="${fileIcon}"></i>
            </div>
            <div class="file-info">
                <span class="file-name">${file.name}</span>
                <span class="file-size">${formatFileSize(file.size)}</span>
            </div>
            <button class="icon-btn file-remove" data-index="${index}">
                <i class="ri-close-line"></i>
            </button>
        `;
        
        // 移除文件
        fileItem.querySelector('.file-remove').addEventListener('click', () => {
            selectedFiles.splice(index, 1);
            renderSelectedFiles();
        });
        
        selectedFilesEl.appendChild(fileItem);
    });
}

// 上传文档
async function uploadDocuments() {
    if (!currentKnowledgeBase || selectedFiles.length === 0) return;
    
    try {
        // 显示加载状态
        uploadSubmit.disabled = true;
        uploadSubmit.innerHTML = '<i class="ri-loader-line rotating"></i> 上传中...';
        
        // 上传文件
        for (const file of selectedFiles) {
            await addDocumentToKnowledgeBase(currentKnowledgeBase.id, file);
        }
        
        // 重新加载文档列表
        await loadKnowledgeBaseDocuments(currentKnowledgeBase.id);
        
        // 刷新知识库列表
        await loadKnowledgeBases();
    } catch (error) {
        console.error('上传文档失败:', error);
        alert('上传文档失败，请重试');
    } finally {
        // 恢复按钮状态
        uploadSubmit.disabled = false;
        uploadSubmit.innerHTML = '上传';
    }
}

// 移除文档
async function removeDocument(docId) {
    if (!currentKnowledgeBase) return;
    
    try {
        await removeDocumentFromKnowledgeBase(currentKnowledgeBase.id, docId);
        
        // 重新加载文档列表
        await loadKnowledgeBaseDocuments(currentKnowledgeBase.id);
        
        // 刷新知识库列表
        await loadKnowledgeBases();
    } catch (error) {
        console.error('删除文档失败:', error);
        alert('删除文档失败，请重试');
    }
}

// 过滤文档
function filterDocuments(query) {
    if (!query) {
        // 显示所有文档
        document.querySelectorAll('.document-item').forEach(item => {
            item.style.display = 'flex';
        });
        return;
    }
    
    // 过滤文档
    document.querySelectorAll('.document-item').forEach(item => {
        const filename = item.querySelector('h4').textContent.toLowerCase();
        
        if (filename.includes(query)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// 创建新知识库
async function createNewKnowledgeBase(name, description) {
    try {
        await createKnowledgeBase({ name, description });
        
        // 重新加载知识库列表
        await loadKnowledgeBases();
    } catch (error) {
        console.error('创建知识库失败:', error);
        alert('创建知识库失败，请重试');
    }
}

// 更新知识库详情
async function updateKnowledgeBaseDetails(kbId, name, description) {
    try {
        await updateKnowledgeBase(kbId, { name, description });
        
        // 更新当前知识库
        currentKnowledgeBase.name = name;
        currentKnowledgeBase.description = description;
        
        // 更新界面
        kbDetailTitleEl.textContent = name;
        kbDetailDescriptionEl.textContent = description || '无描述';
        
        // 重新加载知识库列表
        await loadKnowledgeBases();
    } catch (error) {
        console.error('更新知识库失败:', error);
        alert('更新知识库失败，请重试');
    }
}

// 删除知识库
async function deleteKnowledgeBaseById(kbId) {
    try {
        await deleteKnowledgeBase(kbId);
        
        // 清空当前知识库
        currentKnowledgeBase = null;
        currentDocuments = [];
        
        // 更新界面
        kbDetailEl.classList.remove('active');
        kbDetailEmptyEl.classList.add('active');
        
        // 重新加载知识库列表
        await loadKnowledgeBases();
    } catch (error) {
        console.error('删除知识库失败:', error);
        alert('删除知识库失败，请重试');
    }
}

// 辅助函数

// 获取文件图标
function getFileIcon(filename) {
    const fileExt = filename.split('.').pop().toLowerCase();
    
    switch (fileExt) {
        case 'txt':
            return 'ri-file-text-line';
        case 'docx':
            return 'ri-file-word-line';
        case 'md':
            return 'ri-markdown-line';
        default:
            return 'ri-file-line';
    }
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + units[i];
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 确保Remix Icon加载完成
    if (document.querySelector('link[href*="remixicon"]')) {
        init();
    } else {
        // 如果Remix Icon尚未加载，添加加载监听器
        const iconLink = document.createElement('link');
        iconLink.rel = 'stylesheet';
        iconLink.href = 'https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css';
        iconLink.onload = init;
        document.head.appendChild(iconLink);
    }
}); 