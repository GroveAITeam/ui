/**
 * knowledge-base.js
 * 知识库页面的交互逻辑
 */

// 导入模块
import { getKnowledgeBases, createKnowledgeBase, updateKnowledgeBase, deleteKnowledgeBase, 
         getKnowledgeBaseDocuments, addDocumentToKnowledgeBase, removeDocumentFromKnowledgeBase } from '../knowledge-base.js';

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

// 全局状态
let knowledgeBases = [];
let currentKnowledgeBase = null;
let currentDocuments = [];
let selectedFiles = [];

// 初始化
async function init() {
    // 加载知识库列表
    await loadKnowledgeBases();
    
    // 设置事件监听器
    setupEventListeners();
}

// 设置事件监听器
function setupEventListeners() {
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
        
        // 关闭设置模态框
        kbSettingsModal.classList.remove('active');
        
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
document.addEventListener('DOMContentLoaded', init); 