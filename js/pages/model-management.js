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

// 初始化函数
function init() {
    // 设置选项卡导航
    setupTabNavigation();
    
    // 设置模型子选项卡导航
    setupModelSubtabNavigation();
    
    // 设置离线模型选项卡导航
    setupOfflineModelTabNavigation();
    
    // 设置固定的模型存储路径
    const modelStoragePath = document.getElementById('model-storage-path');
    if (modelStoragePath) {
        // 在实际应用中，这可能会根据操作系统调整
        const path = '/Users/username/.grovestudio/models';
        modelStoragePath.textContent = path;
    }
    
    // 加载在线模型列表
    loadOnlineModels();
    
    // 加载离线模型列表
    loadOfflineModels();
    
    // 加载向量模型信息
    loadVectorModel();
    
    // 设置按钮事件监听
    setupButtonListeners();
    
    // 添加一个测试下载项
    setTimeout(() => {
        simulateAddDownload('测试下载模型', 'test-download-' + Date.now());
        if(downloadCountElement) {
            downloadCountElement.textContent = '1'; // 确保下载计数显示正确
        }
    }, 1000);
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
}

// 设置模型子选项卡导航
function setupModelSubtabNavigation() {
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

// 设置离线模型选项卡导航
function setupOfflineModelTabNavigation() {
    offlineModelTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 获取目标选项卡ID
            const targetTab = tab.getAttribute('data-offlinetab');
            
            // 更新活动选项卡样式
            offlineModelTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 更新活动内容
            offlineModelTabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetTab) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// 加载在线模型列表
function loadOnlineModels() {
    if (!onlineModelsContainer) return;

    const placeholder = onlineModelsContainer.querySelector('.placeholder-card');
    if (placeholder) placeholder.style.display = 'none'; // Hide placeholder if data exists
    const emptyState = onlineModelsContainer.querySelector('.empty-state');

    if (onlineModels.length === 0) {
        onlineModelsContainer.innerHTML = ''; // Clear any previous dynamic content
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    let modelsHTML = '';
    onlineModels.forEach(model => {
        modelsHTML += `
            <div class="model-card" data-model-id="${model.id}">
                 <div class="model-info">
                    <span class="model-name">${model.name}</span>
                    <span class="model-provider">提供商: ${model.provider}</span>
                    <span class="model-extra-info">模型ID: ${model.modelId || 'N/A'}</span>
                 </div>
                 <div class="model-actions">
                    <button class="edit-btn" data-id="${model.id}"><i class="ri-pencil-line"></i></button>
                    <button class="delete-btn" data-id="${model.id}"><i class="ri-delete-bin-line"></i></button>
                </div>
            </div>
        `;
    });

    onlineModelsContainer.innerHTML = modelsHTML; // Replace content
    // Re-attach or use event delegation for buttons inside
    bindModelCardButtons(onlineModelsContainer);
}

// 加载离线模型列表
function loadOfflineModels() {
    if (!offlineModelsContainer) return;

    const placeholder = offlineModelsContainer.querySelector('.placeholder-card');
    if (placeholder) placeholder.style.display = 'none';
    const emptyState = offlineModelsContainer.querySelector('.empty-state');

    if (offlineModels.length === 0) {
        offlineModelsContainer.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    let modelsHTML = '';
    offlineModels.forEach(model => {
        // Ensure required properties exist or provide defaults
        const name = model.name || '未知模型';
        const path = model.path || model.id || '未知路径'; // Use path if available, else id
        const id = model.id || 'unknown-id-' + Math.random().toString(36).substring(2, 9);

        modelsHTML += `
            <div class="model-card" data-model-id="${id}">
                <div class="model-info">
                    <span class="model-name">${name}</span>
                    <span class="model-path">路径: ${path}</span>
                </div>
                <div class="model-actions">
                    <button class="delete-btn" data-id="${id}"><i class="ri-delete-bin-line"></i></button>
                </div>
            </div>
        `;
    });

    offlineModelsContainer.innerHTML = modelsHTML;
    bindModelCardButtons(offlineModelsContainer);
}

// 加载向量模型信息
function loadVectorModel() {
    if (!vectorModelsContainer) return;

    const placeholder = vectorModelsContainer.querySelector('.placeholder-card');
    if (placeholder) placeholder.style.display = 'none';
    const emptyState = vectorModelsContainer.querySelector('.empty-state');

    if (!vectorModel || Object.keys(vectorModel).length === 0) {
        vectorModelsContainer.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

     if (emptyState) emptyState.style.display = 'none';

    const name = vectorModel.name || '未知向量模型';
    const path = vectorModel.path || '未知路径'; // Assume path exists
    const id = vectorModel.id || 'vector-model-' + Math.random().toString(36).substring(2, 9);

    const modelHTML = `
        <div class="model-card" data-model-id="${id}">
            <div class="model-info">
                <span class="model-name">${name}</span>
                 <span class="model-path">路径: ${path}</span>
             </div>
            <div class="model-actions">
                <button class="delete-btn" data-id="${id}"><i class="ri-delete-bin-line"></i></button>
            </div>
        </div>
    `;

    vectorModelsContainer.innerHTML = modelHTML;
    bindModelCardButtons(vectorModelsContainer);
}

// Helper function to bind events to model card buttons (using delegation is better)
// This is a simplified example; ideally use event delegation on the container.
function bindModelCardButtons(container) {
    if (!container) return;
    container.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            const modelId = event.currentTarget.dataset.id;
            console.log('Edit model:', modelId); // Replace with actual edit logic
            // Example: Find model data and show edit modal
            const modelData = findModelById(modelId);
            if (modelData) {
                showAddOnlineModelModal(modelData); // Assuming edit uses the same modal
            }
        });
    });

    container.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            const modelId = event.currentTarget.dataset.id;
            const card = event.currentTarget.closest('.model-card');
            if (card && confirm(`确定要删除模型 ${card.querySelector('.model-name')?.textContent || modelId} 吗？`)) {
                console.log('Delete model:', modelId);
                // Find which list the model belongs to and remove it
                const parentContainerId = container.id;
                removeModelById(modelId, parentContainerId);
                // Optionally: Send delete request to backend
            }
        });
    });
     // Bind download buttons if they exist in this container (e.g., HF search results)
     container.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            const repoId = event.currentTarget.dataset.repoId; // Assuming HF results use repo-id
            const modelName = event.currentTarget.closest('.search-result-item')?.querySelector('.result-name')?.textContent || repoId;
            console.log('Download model:', repoId);
            // Replace with actual download logic, potentially showing a variant selection or starting download
            startModelDownload(modelName, repoId); // Pass necessary info
        });
    });
}

// Helper function to find model data by ID (needs implementation based on where data is stored)
function findModelById(modelId) {
    // Search in onlineModels, offlineModels, vectorModel based on ID pattern or context
    let model = onlineModels.find(m => m.id === modelId);
    if (model) return { ...model, type: 'online' };

    model = offlineModels.find(m => m.id === modelId);
    if (model) return { ...model, type: 'offline' };

    // Add check for vector model if needed
    if (vectorModel && (vectorModel.id === modelId || `vector-model-${vectorModel.hash}` === modelId)) { // Adjust ID logic if necessary
         return { ...vectorModel, type: 'vector' };
    }

    console.warn("Model not found for ID:", modelId);
    return null;
}

// Helper function to remove model by ID from the correct list
function removeModelById(modelId, containerId) {
    let modelIndex = -1;
    let modelList = null;

    if (containerId === 'online-models-container') {
        modelList = onlineModels;
    } else if (containerId === 'offline-models-container') {
        modelList = offlineModels;
    } else if (containerId === 'vector-models-container') {
        // Special handling for vector model as it's not a list
        if (vectorModel && (vectorModel.id === modelId /*|| check other identifiers*/)) {
            vectorModel = {}; // Clear the vector model object
            loadVectorModel(); // Reload the section to show empty state
            return;
        }
    }

    if (modelList) {
        modelIndex = modelList.findIndex(m => m.id === modelId);
        if (modelIndex > -1) {
            modelList.splice(modelIndex, 1);
            // Reload the specific list
            if (containerId === 'online-models-container') loadOnlineModels();
            if (containerId === 'offline-models-container') loadOfflineModels();
             // No need to reload vector here, handled above
        } else {
            console.warn(`Model with ID ${modelId} not found in list for container ${containerId}`);
        }
    }
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
}

// 显示添加在线模型弹窗
function showAddOnlineModelModal() {
    const modalOverlay = showModal('add-online-model-template');
    if (!modalOverlay) return;
    
    const form = modalOverlay.querySelector('#add-online-model-form');
    const providerSelect = modalOverlay.querySelector('#model-provider');
    const modelIdGroup = modalOverlay.querySelector('#model-id-group');
    const modelIdInput = modalOverlay.querySelector('#model-id');
    const baseUrlGroup = modalOverlay.querySelector('#base-url-group');
    
    // 监听提供商选择变化
    providerSelect.addEventListener('change', () => {
        const provider = providerSelect.value;
        const isCustom = provider === 'custom';
        
        // 根据提供商类型显示/隐藏模型ID组
        modelIdGroup.style.display = isCustom ? 'block' : 'none';
        if (isCustom) {
            modelIdInput.value = ''; // 自定义时清空
        } else {
             // 非自定义时隐藏，值将在提交时获取默认值
             modelIdInput.value = ''; // 清空输入框以避免混淆
        }
        
        // 显示/隐藏基础URL输入
        baseUrlGroup.style.display = isCustom ? 'block' : 'none';
    });
    
    // 表单提交
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const provider = providerSelect.value;
        const isCustom = provider === 'custom';
        // 如果是自定义提供商，则从输入框获取模型ID，否则获取默认ID
        const modelId = isCustom ? modelIdInput.value : getDefaultModelIdForProvider(provider);

        // 获取表单数据
        const formData = {
            name: form.querySelector('#model-name').value,
            provider: provider,
            modelId: modelId, // 使用确定后的模型ID
            apiKey: form.querySelector('#api-key').value,
            baseUrl: isCustom ? form.querySelector('#base-url').value : '' // 仅当自定义时获取Base URL
        };
        
        // 添加模型
        addOnlineModel(formData);
        
        // 关闭弹窗
        document.body.removeChild(modalOverlay);
    });
}

// 显示下载模型弹窗
function showDownloadModelModal() {
    const modalOverlay = showModal('download-model-template');
    if (!modalOverlay) return;
    
    // 可以添加更多下载模型相关的逻辑
}

// 显示下载中模型弹窗
function showDownloadingModelsModal() {
    const modalOverlay = showModal('downloading-models-template');
    if (!modalOverlay) return;
    
    // 更新下载中模型列表
    updateDownloadingModelsList();
}

// 导入本地模型
function importLocalModel() {
    // 在实际应用中，这里会打开系统文件选择器
    console.log('打开文件选择器以导入本地模型');
    alert('在真实应用中，这里会打开系统文件选择器，让您选择GGUF格式的模型文件。');
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

// 搜索Hugging Face模型
async function searchHuggingFaceModels() {
    const searchTerm = hfSearchInput.value.trim();
    if (!searchTerm) return;

    console.log(`Searching Hugging Face for: ${searchTerm}`);
    hfSearchBtn.disabled = true;
    hfSearchBtn.innerHTML = '<i class="ri-loader-4-line rotating"></i>'; // Loading indicator
    const searchHint = hfModelsContainer.querySelector('.search-hint');
    if (searchHint) searchHint.style.display = 'none'; // Hide hint during search

    try {
        // Replace with actual API call to backend/HF
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
        const results = [
            { repoId: 'stabilityai/stablelm-2-zephyr-1_6b-GGUF', name: 'stablelm-2-zephyr-1_6b', author: 'stabilityai', size: '1.1 GB' },
            { repoId: 'Qwen/Qwen1.5-7B-Chat-GGUF', name: 'Qwen1.5-7B-Chat', author: 'Qwen', size: '4.2 GB' },
            { repoId: 'google/gemma-7b-it-gguf', name: 'gemma-7b-it', author: 'google', size: '4.9 GB' },
        ].filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase())); // Simple client-side filter for demo

        displaySearchResults(results);
    } catch (error) {
        console.error('Error searching Hugging Face models:', error);
        hfModelsContainer.innerHTML = '<p class="error-message">搜索模型时出错，请稍后重试。</p>';
    } finally {
        hfSearchBtn.disabled = false;
        hfSearchBtn.innerHTML = '<i class="ri-search-line"></i>'; // Restore button icon
    }
}

function displaySearchResults(results) {
    if (!hfModelsContainer) return;

    const placeholder = hfModelsContainer.querySelector('.placeholder-card');
    if (placeholder) placeholder.style.display = 'none'; // Hide placeholder
    const searchHint = hfModelsContainer.querySelector('.search-hint');

    if (!results || results.length === 0) {
        hfModelsContainer.innerHTML = '<p class="empty-state">未找到相关模型。</p>';
         if (searchHint) searchHint.style.display = 'none'; // Keep hint hidden if no results
        return;
    }

    if (searchHint) searchHint.style.display = 'none'; // Hide hint if results found

    let resultsHTML = '';
    results.forEach(model => {
        resultsHTML += `
             <div class="model-card search-result-item" data-repo-id="${model.repoId}">
                 <div class="model-info">
                     <span class="model-name">${model.name} (${model.author})</span>
                     <span class="model-file-size">大小: ${model.size || '未知'}</span>
                 </div>
                 <div class="model-actions">
                     <button class="download-btn" data-repo-id="${model.repoId}"><i class="ri-download-2-line"></i> 下载</button>
                 </div>
            </div>
        `;
    });

    hfModelsContainer.innerHTML = resultsHTML;
    bindModelCardButtons(hfModelsContainer); // Bind download buttons for results
}

// --- Update Downloading Models List (Example) ---
let currentDownloads = []; // Store current downloads { id, name, progress, status }

function updateDownloadingModelsList() {
    const listContainer = document.getElementById('downloading-models-list');
    if (!listContainer) return;

    const placeholder = listContainer.querySelector('.placeholder-item');
    if (placeholder) placeholder.style.display = 'none';
    const emptyState = listContainer.querySelector('.empty-downloads');

    if (currentDownloads.length === 0) {
        listContainer.innerHTML = ''; // Clear previous items
        if (emptyState) emptyState.style.display = 'block'; // Show empty state
        downloadCountElement.textContent = '0'; // Update counter
        return;
    }

    if (emptyState) emptyState.style.display = 'none'; // Hide empty state
    downloadCountElement.textContent = currentDownloads.length; // Update counter

    let listHTML = '';
    currentDownloads.forEach(download => {
        listHTML += `
            <div class="download-item" data-download-id="${download.id}">
                <div class="download-item-content">
                    <div class="download-item-info">
                        <span class="download-model-name">${download.name}</span>
                        <span class="download-status-text">${download.status === 'error' ? '错误' : download.progress + '%'}</span>
                    </div>
                    <div class="progress-bar-container small">
                        <div class="progress-bar" style="width: ${download.progress}%;"></div>
                    </div>
                </div>
                <button class="cancel-download-btn" data-download-id="${download.id}">取消</button>
            </div>
        `;
    });

    listContainer.innerHTML = listHTML;
    // Bind cancel buttons
    listContainer.querySelectorAll('.cancel-download-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            const downloadId = event.currentTarget.dataset.downloadId;
            console.log('Cancel download:', downloadId);
            // Add logic to cancel the actual download process
            // Remove from the list and update UI
            currentDownloads = currentDownloads.filter(d => d.id !== downloadId);
            updateDownloadingModelsList();
        });
    });
}

// Example function to simulate adding a download
function simulateAddDownload(name, id) {
    currentDownloads.push({ id: id, name: name, progress: 0, status: 'downloading' });
    updateDownloadingModelsList();

    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        const download = currentDownloads.find(d => d.id === id);
        if (download) {
            download.progress = progress;
            if (progress >= 100) {
                download.progress = 100;
                download.status = 'completed'; // Or remove from list
                clearInterval(interval);
                // Simulate completion: remove after a delay or move to offline list
                setTimeout(() => {
                     currentDownloads = currentDownloads.filter(d => d.id !== id);
                     updateDownloadingModelsList();
                     // Potentially add to offline models list here
                     // offlineModels.push({ id: id, name: name, source: 'downloaded', size: '?', ramRequired: '?' });
                     // loadOfflineModels();
                 }, 1000);
            }
            updateDownloadingModelsList(); // Update UI with progress
        } else {
            clearInterval(interval); // Stop if download was cancelled
        }
    }, 500);
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

// 添加在线模型
function addOnlineModel(modelData) {
    console.log('添加在线模型:', modelData);
    
    // 创建新模型对象
    const newModel = {
        id: `${modelData.provider}-${modelData.modelId}-${Date.now()}`, // ID更具区分度
        name: modelData.name,
        provider: modelData.provider,
        modelId: modelData.modelId,
        apiKey: '••••••••••••••••••••••••••••••', // 实际应用中不应硬编码或存储掩码
        baseUrl: modelData.baseUrl || null // 存储基础URL
    };
    
    // 添加到模型列表
    onlineModels.push(newModel);
    
    // 重新加载模型列表
    loadOnlineModels();
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
        ]
    };
    
    // 根据搜索词返回匹配的模型
    const searchTermLower = searchTerm.toLowerCase();
    let results = [];
    
    for (const [key, models] of Object.entries(modelDatabase)) {
        if (key.includes(searchTermLower)) {
            results = results.concat(models);
        }
    }
    
    return results;
}

// 开始下载模型
function startModelDownload(modelName, variant) {
    console.log(`开始下载模型: ${modelName} (${variant})`);
    
    // 更新下载计数
    const currentCount = parseInt(downloadCountElement.textContent);
    downloadCountElement.textContent = currentCount + 1;
    
    // 在实际应用中，这里会启动实际的下载过程
    alert(`在真实应用中，这里会开始下载 ${modelName} 的 ${variant} 版本。\n\n下载进度将显示在"下载中"面板中。`);
}

// Initialize the page
init(); 