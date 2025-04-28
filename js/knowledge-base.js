/**
 * knowledge-base.js
 * 知识库相关的API和数据处理
 */

import { saveData, loadData, generateId } from './storage.js';

// 存储键
const KB_STORAGE_KEY = 'grove_knowledge_bases';
const KB_DOCUMENTS_KEY = 'grove_kb_documents';

// 获取所有知识库
async function getKnowledgeBases() {
    try {
        // 从本地存储加载知识库
        const knowledgeBases = await loadData(KB_STORAGE_KEY) || [];
        
        // 对每个知识库添加文档数量信息
        for (const kb of knowledgeBases) {
            const documents = await getKnowledgeBaseDocuments(kb.id);
            kb.documentCount = documents.length;
        }
        
        return knowledgeBases;
    } catch (error) {
        console.error('获取知识库列表失败:', error);
        return [];
    }
}

// 获取单个知识库
async function getKnowledgeBase(kbId) {
    const knowledgeBases = await loadData(KB_STORAGE_KEY) || [];
    return knowledgeBases.find(kb => kb.id === kbId);
}

// 创建知识库
async function createKnowledgeBase(knowledgeBaseData) {
    // 从本地存储加载知识库
    const knowledgeBases = await loadData(KB_STORAGE_KEY) || [];
    
    // 创建新知识库
    const newKnowledgeBase = {
        id: generateId(),
        name: knowledgeBaseData.name,
        description: knowledgeBaseData.description || '',
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        indexStatus: '未索引'
    };
    
    // 添加到知识库列表
    knowledgeBases.push(newKnowledgeBase);
    
    // 保存到本地存储
    await saveData(KB_STORAGE_KEY, knowledgeBases);
    
    return newKnowledgeBase;
}

// 更新知识库
async function updateKnowledgeBase(kbId, updateData) {
    // 从本地存储加载知识库
    const knowledgeBases = await loadData(KB_STORAGE_KEY) || [];
    
    // 查找知识库
    const index = knowledgeBases.findIndex(kb => kb.id === kbId);
    if (index === -1) {
        throw new Error(`找不到ID为${kbId}的知识库`);
    }
    
    // 更新知识库
    knowledgeBases[index] = {
        ...knowledgeBases[index],
        ...updateData,
        lastUpdated: new Date().toISOString()
    };
    
    // 保存到本地存储
    await saveData(KB_STORAGE_KEY, knowledgeBases);
    
    return knowledgeBases[index];
}

// 删除知识库
async function deleteKnowledgeBase(kbId) {
    // 从本地存储加载知识库
    const knowledgeBases = await loadData(KB_STORAGE_KEY) || [];
    
    // 查找知识库
    const index = knowledgeBases.findIndex(kb => kb.id === kbId);
    if (index === -1) {
        throw new Error(`找不到ID为${kbId}的知识库`);
    }
    
    // 删除知识库
    knowledgeBases.splice(index, 1);
    
    // 保存到本地存储
    await saveData(KB_STORAGE_KEY, knowledgeBases);
    
    // 删除相关文档
    await deleteKnowledgeBaseDocuments(kbId);
    
    return true;
}

// 获取知识库的文档
async function getKnowledgeBaseDocuments(kbId) {
    // 从本地存储加载文档
    const allDocuments = await loadData(KB_DOCUMENTS_KEY) || {};
    
    // 获取知识库的文档
    return allDocuments[kbId] || [];
}

// 添加文档到知识库
async function addDocumentToKnowledgeBase(kbId, file) {
    // 获取知识库
    const kb = await getKnowledgeBase(kbId);
    if (!kb) {
        throw new Error(`找不到ID为${kbId}的知识库`);
    }
    
    // 从本地存储加载文档
    const allDocuments = await loadData(KB_DOCUMENTS_KEY) || {};
    
    // 获取知识库的文档
    const documents = allDocuments[kbId] || [];
    
    // 读取文件内容（在实际应用中，这会通过后端API读取文件内容）
    const fileContent = await readFileContent(file);
    
    // 创建新文档
    const newDocument = {
        id: generateId(),
        filename: file.name,
        size: file.size,
        type: file.type || getFileType(file.name),
        content: fileContent,
        uploadedAt: new Date().toISOString()
    };
    
    // 添加到文档列表
    documents.push(newDocument);
    
    // 更新所有文档
    allDocuments[kbId] = documents;
    
    // 保存到本地存储
    await saveData(KB_DOCUMENTS_KEY, allDocuments);
    
    // 更新知识库索引状态
    await updateKnowledgeBase(kbId, {
        indexStatus: '已索引',
        lastUpdated: new Date().toISOString()
    });
    
    return newDocument;
}

// 从知识库移除文档
async function removeDocumentFromKnowledgeBase(kbId, documentId) {
    // 从本地存储加载文档
    const allDocuments = await loadData(KB_DOCUMENTS_KEY) || {};
    
    // 获取知识库的文档
    const documents = allDocuments[kbId] || [];
    
    // 查找文档
    const index = documents.findIndex(doc => doc.id === documentId);
    if (index === -1) {
        throw new Error(`找不到ID为${documentId}的文档`);
    }
    
    // 删除文档
    documents.splice(index, 1);
    
    // 更新所有文档
    allDocuments[kbId] = documents;
    
    // 保存到本地存储
    await saveData(KB_DOCUMENTS_KEY, allDocuments);
    
    // 更新知识库索引状态（如果还有文档，则保持索引状态；否则设为未索引）
    const indexStatus = documents.length > 0 ? '已索引' : '未索引';
    await updateKnowledgeBase(kbId, {
        indexStatus,
        lastUpdated: new Date().toISOString()
    });
    
    return true;
}

// 删除知识库的所有文档
async function deleteKnowledgeBaseDocuments(kbId) {
    // 从本地存储加载文档
    const allDocuments = await loadData(KB_DOCUMENTS_KEY) || {};
    
    // 删除知识库的文档
    delete allDocuments[kbId];
    
    // 保存到本地存储
    await saveData(KB_DOCUMENTS_KEY, allDocuments);
    
    return true;
}

// 测试知识库索引
async function testKnowledgeBaseIndex(kbId, query) {
    // 获取知识库文档
    const documents = await getKnowledgeBaseDocuments(kbId);
    
    if (documents.length === 0) {
        return {
            success: false,
            message: '知识库中没有文档，无法进行测试'
        };
    }
    
    // 模拟加载时间
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 在实际应用中，这里会使用嵌入模型进行向量搜索
    // 现在我们只进行简单的文本匹配来模拟效果
    const results = [];
    
    for (const doc of documents) {
        // 将文档内容分成段落
        const paragraphs = doc.content.split('\n\n').filter(p => p.trim());
        
        for (const paragraph of paragraphs) {
            // 简单评分：计算查询词在段落中出现的次数
            // 在实际应用中，这会使用向量相似度计算
            const queryTerms = query.toLowerCase().split(/\s+/);
            let score = 0;
            
            for (const term of queryTerms) {
                if (term.length < 2) continue;
                const regex = new RegExp(term, 'gi');
                const matches = paragraph.match(regex);
                if (matches) {
                    score += matches.length;
                }
            }
            
            // 只保留包含查询词的段落
            if (score > 0) {
                results.push({
                    content: paragraph,
                    score: score,
                    filename: doc.filename,
                    documentId: doc.id
                });
            }
        }
    }
    
    // 按分数排序
    results.sort((a, b) => b.score - a.score);
    
    // 限制返回的结果数量
    const topResults = results.slice(0, 5);
    
    return {
        success: true,
        results: topResults
    };
}

// 辅助函数

// 读取文件内容
async function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = () => {
            resolve(reader.result);
        };
        
        reader.onerror = () => {
            reject(new Error('读取文件失败'));
        };
        
        reader.readAsText(file);
    });
}

// 获取文件类型
function getFileType(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    
    switch (extension) {
        case 'txt':
            return 'text/plain';
        case 'docx':
            return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        case 'md':
            return 'text/markdown';
        default:
            return 'application/octet-stream';
    }
}

// 导出模块
export {
    getKnowledgeBases,
    getKnowledgeBase,
    createKnowledgeBase,
    updateKnowledgeBase,
    deleteKnowledgeBase,
    getKnowledgeBaseDocuments,
    addDocumentToKnowledgeBase,
    removeDocumentFromKnowledgeBase,
    testKnowledgeBaseIndex
}; 