/**
 * 格式化Markdown文本
 * @param {string} text - 要格式化的文本
 * @returns {string} 格式化后的HTML
 */
export function formatMarkdown(text) {
    // 代码块 (```code```)
    text = text.replace(/```([\s\S]*?)```/g, function(match, p1) {
        return `<pre><code>${p1.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
    });
    
    // 内联代码 (`code`)
    text = text.replace(/`([^`]+)`/g, function(match, p1) {
        return `<code>${p1.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>`;
    });
    
    // 加粗 (**text**)
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // 斜体 (*text*)
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // 链接 ([text](url))
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // 列表项
    text = text.replace(/^\s*-\s*(.*)/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>\n)+/g, '<ul>$&</ul>');
    
    // 标题
    text = text.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    text = text.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    text = text.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    
    // 段落和换行
    text = text.replace(/\n\s*\n/g, '</p><p>');
    text = `<p>${text}</p>`;
    text = text.replace(/<p><\/p>/g, '<br>');
    
    return text;
}

/**
 * 计算相对时间
 * @param {Date} date - 日期对象
 * @returns {string} 相对时间字符串
 */
export function getRelativeTime(date) {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // 秒差
    
    if (diff < 60) {
        return '刚刚';
    } else if (diff < 3600) {
        return Math.floor(diff / 60) + '分钟前';
    } else if (diff < 86400) {
        return Math.floor(diff / 3600) + '小时前';
    } else if (diff < 604800) {
        return Math.floor(diff / 86400) + '天前';
    } else {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}

/**
 * 自动调整文本区域高度
 * @param {HTMLElement} textarea - 文本区域元素
 */
export function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight > 120 ? 120 : textarea.scrollHeight) + 'px';
}

/**
 * 滚动到底部
 * @param {HTMLElement} element - 要滚动的元素
 */
export function scrollToBottom(element) {
    element.scrollTop = element.scrollHeight;
} 