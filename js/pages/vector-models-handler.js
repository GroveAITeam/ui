/* 模拟下载和更新向量模型的表单处理函数 */

// 在页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有下载表单
    const downloadForms = document.querySelectorAll('.download-form');
    
    // 获取所有删除表单
    const deleteForms = document.querySelectorAll('.delete-form');
    
    // 处理下载表单提交
    downloadForms.forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // 阻止表单默认提交
            
            // 获取表单数据
            const modelId = form.querySelector('input[name="modelId"]').value;
            const modelName = form.querySelector('input[name="modelName"]').value;
            
            // 显示下载确认
            if (confirm(`确定要下载向量模型 ${modelName} 吗？`)) {
                // 显示下载中状态
                alert(`开始下载向量模型: ${modelName}`);
                
                // 模拟下载过程（实际应用中会向API发送请求）
                // 这里只做一个简单的状态更新演示
                setTimeout(() => {
                    // 模拟下载完成
                    updateModelStatus(modelId, '已下载');
                    alert(`向量模型 ${modelName} 下载完成！`);
                }, 2000);
            }
        });
    });
    
    // 处理删除表单提交
    deleteForms.forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // 阻止表单默认提交
            
            // 获取表单数据
            const modelId = form.querySelector('input[name="modelId"]').value;
            
            // 获取模型名称（从页面元素中）
            const modelCard = form.closest('.model-card');
            const modelName = modelCard.querySelector('.model-name').textContent;
            
            // 显示删除确认
            if (confirm(`确定要删除向量模型 ${modelName} 吗？这将从磁盘上移除模型文件。`)) {
                // 模拟删除过程（实际应用中会向API发送请求）
                setTimeout(() => {
                    // 模拟删除完成
                    updateModelStatus(modelId, '未下载');
                    alert(`向量模型 ${modelName} 已删除！`);
                }, 1000);
            }
        });
    });
    
    /**
     * 更新模型状态（下载/删除后）
     * @param {string} modelId - 模型ID
     * @param {string} status - 新状态（'已下载'或'未下载'）
     */
    function updateModelStatus(modelId, status) {
        // 查找模型卡片
        const modelCard = document.querySelector(`.model-card[data-model-id="${modelId}"]`);
        if (!modelCard) return;
        
        // 更新状态文本
        const statusElement = modelCard.querySelector('.model-status');
        if (statusElement) {
            statusElement.textContent = `状态: ${status}`;
        }
        
        // 查找下载和删除表单
        const downloadForm = modelCard.querySelector('.download-form');
        const deleteForm = modelCard.querySelector('.delete-form');
        
        if (status === '已下载') {
            // 已下载：隐藏下载表单，显示删除表单
            if (downloadForm) downloadForm.style.display = 'none';
            if (deleteForm) deleteForm.style.display = 'block';
        } else {
            // 未下载：显示下载表单，隐藏删除表单
            if (downloadForm) downloadForm.style.display = 'block';
            if (deleteForm) deleteForm.style.display = 'none';
        }
    }
});
