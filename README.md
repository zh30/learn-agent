# learn-agent 🤖

一步步学习 AI Agent 开发，从零到一构建自己的 Agent。

## 环境准备

```bash
# 安装依赖
bun install

# 设置环境变量（~/.zshrc 或 ~/.bashrc）
export ANTHROPIC_API_KEY="your-key"
export ANTHROPIC_BASE_URL="https://api.anthropic.com"  # 可选，默认即此地址
export ANTHROPIC_MODEL="claude-sonnet-4-20250514"        # 可选，默认 glm-5.1:cloud

# 运行某个学习文件
bun run first-agent.ts
```

---

## 学习路线

| # | 主题 | 文件 | 关键词 |
|---|------|------|--------|
| Day 01 | Agent 最简循环 | `first-agent.ts` | query, 流式消息，工具调用 |

> 每新增一个学习文件，在此表中添加一行即可。

---

## Day 01 — Agent 最简循环

**目标**：理解 Agent 的核心循环——接收指令 → 思考 → 调用工具 → 输出结果。

### 核心概念

```
┌─────────────┐
│   prompt     │  ← 你给 Agent 的任务
└──────┬──────┘
       ▼
┌─────────────┐
│   query()    │  ← Agent 循环入口（思考→行动→观察→再思考…）
└──────┬──────┘
       ▼  for await (message of response)
┌──────────────────────────────────────┐
│  system   → 会话初始化               │
│  assistant→ Agent 正在推理           │
│  tool_use → Agent 正在调用工具       │
│  result   → 循环结束，返回最终答案   │
└──────────────────────────────────────┘
```

### 代码逐行解读

```ts
// 1️⃣ 引入 SDK
import { query, type SDKAssistantMessage } from "@anthropic-ai/claude-agent-sdk";
```

`query()` 是 SDK 提供的**最简 Agent 入口**——它封装了完整的 Agent 循环（ReAct Loop），
让你不需要手动管理"思考→行动→观察"的迭代过程。

```ts
// 2️⃣ 配置模型
const model = process.env.ANTHROPIC_MODEL ?? "glm-5.1:cloud";
```

从环境变量读取模型名称，方便切换不同模型而不改动代码。

```ts
// 3️⃣ 发起 Agent 调用
const response = query({
  prompt: "列出当前目录下的文件",
  options: {
    model,
    allowedTools: ["Read", "Bash", "Glob"],  // 限制可用工具
  },
});
```

- `prompt`：给 Agent 的任务指令
- `allowedTools`：白名单控制 Agent 能使用哪些工具——这是**安全边界**

```ts
// 4️⃣ 流式获取每一步
for await (const message of response) {
  switch (message.type) {
    case "system":           // 会话建立
    case "assistant":         // Agent 推理文本
    case "tool_use_summary":  // Agent 调用工具的摘要
    case "result":            // 最终结果
  }
}
```

`for await...of` 流式遍历——Agent 每完成一步就产出一个消息，
你可以实时观察它的**思考过程和行动轨迹**。

### 关键收获

1. **Agent = 循环**：不是一次调用就结束，而是"思考→行动→观察→再思考"的迭代过程
2. **`query()` 即循环**：SDK 把整个循环封装好了，你只需要提供 prompt 和工具列表
3. **工具即能力边界**：`allowedTools` 决定了 Agent 能做什么、不能做什么
4. **流式 = 透明**：每一步都可见，方便调试和理解 Agent 的决策过程

### 运行

```bash
bun run first-agent.ts
```

---

## 环境变量参考

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `ANTHROPIC_API_KEY` | API 密钥 | — |
| `ANTHROPIC_BASE_URL` | API 基础地址 | `https://api.anthropic.com` |
| `ANTHROPIC_MODEL` | 模型名称 | `glm-5.1:cloud` |

---

## 参考资源

- [Claude Agent SDK](https://github.com/anthropics/claude-agent-sdk) — SDK 源码与文档