# Grove AI Studio 原型

这是Grove AI Studio桌面应用的原型，基于HTML/CSS/JavaScript实现。

## 项目结构

```
grove-ai-studio/
├── index.html          // 主HTML文件
├── css/
│   ├── style.css       // 主样式表
│   └── themes.css      // 主题样式
├── js/
│   ├── app.js          // 主应用逻辑
│   ├── router.js       // 页面路由
│   ├── theme.js        // 主题管理
│   ├── workspace.js    // 工作台功能
│   └── chat.js         // 聊天功能
└── pages/
    ├── workspace.html  // 工作台页面
    ├── chat.html       // 聊天页面
    └── under-construction.html // 建设中页面
```

## 功能

- **工作台**：管理空间和会话
  - 空间管理：查看和切换不同空间
  - 会话管理：查看、创建和切换会话
- **聊天界面**：与AI进行对话
  - 模型选择：选择使用的AI模型
  - 智能体选择：选择使用的智能体
  - 消息发送和接收

## 运行方式

由于使用了ES模块和fetch API，需要通过本地服务器运行该原型。可以使用以下方法之一：

### 使用Python的HTTP服务器

```bash
# 如果安装了Python 3
python -m http.server

# 如果使用Python 2
python -m SimpleHTTPServer
```

然后在浏览器中访问 `http://localhost:8000`

### 使用Node.js的http-server

```bash
# 安装http-server
npm install -g http-server

# 运行服务器
http-server
```

然后在浏览器中访问 `http://localhost:8080`

## 待开发功能

- 知识库
- 网页搜索助手
- 文件助手
- 数据库
- 笔记
- 在线工具箱（天气、地图等）
- 智能体配置
- 设置页面

## 技术栈

- 纯HTML/CSS/JavaScript原型
- 无框架依赖
- 使用ES模块进行代码组织 