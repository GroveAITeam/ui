/**
 * models.js
 * 管理AI模型相关的功能
 */

// 可用模型列表
const availableModels = [
    {
        id: 'gpt-4',
        name: 'GPT-4',
        provider: 'OpenAI',
        type: 'online',
        default: true
    },
    {
        id: 'claude-3',
        name: 'Claude 3',
        provider: 'Anthropic',
        type: 'online',
        default: false
    },
    {
        id: 'local-llama',
        name: '本地Llama 2',
        provider: 'Local',
        type: 'offline',
        default: false
    }
];

// 获取可用模型列表
function getAvailableModels() {
    return availableModels;
}

// 获取默认模型
function getDefaultModel() {
    return availableModels.find(model => model.default) || availableModels[0];
}

// 设置默认模型
function setDefaultModel(modelId) {
    availableModels.forEach(model => {
        model.default = (model.id === modelId);
    });
}

// 模型参数设置
const modelParams = {
    temperature: 0.7,  // 创意度
    maxLength: 2000,   // 最大生成长度
    topP: 0.9,         // 采样范围
};

// 获取模型参数
function getModelParams() {
    return {...modelParams};
}

// 更新模型参数
function updateModelParams(params) {
    Object.assign(modelParams, params);
}

// 将创意度滑块值转换为temperature参数
function creativityToTemperature(creativity) {
    // 将0-100的创意度范围映射到0.1-1.0的temperature范围
    return 0.1 + (creativity / 100) * 0.9;
}

// 导出模块
export {
    getAvailableModels,
    getDefaultModel,
    setDefaultModel,
    getModelParams,
    updateModelParams,
    creativityToTemperature
}; 