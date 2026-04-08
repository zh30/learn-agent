import { query, type SDKAssistantMessage } from "@anthropic-ai/claude-agent-sdk";

function getAssistantText(message: SDKAssistantMessage): string {
  return message.message.content
    .filter((block): block is Extract<typeof block, { type: "text" }> => block.type === "text")
    .map((block) => block.text)
    .join("\n");
}

// 从环境变量读取配置（~/.zshrc 中已设置 ANTHROPIC_BASE_URL / ANTHROPIC_API_KEY / ANTHROPIC_MODEL）
const model = process.env.ANTHROPIC_MODEL ?? "glm-5.1:cloud";

// 最简单的 Agent：query() 就是 Agent 循环
const response = query({
  prompt: "列出当前目录下的文件",
  options: {
    model,
    allowedTools: ["Read", "Bash", "Glob"],
  },
});

// 流式获取消息 — 每条消息都是循环中的一步
for await (const message of response) {
  switch (message.type) {
    case "system": // 会话初始化
      console.log("会话：", message.session_id);
      break;
    case "assistant": // Agent 推理
      console.log("思考：", getAssistantText(message));
      break;
    case "tool_use_summary": // Agent 通过工具采取行动
      console.log("行动：", message.summary);
      break;
    case "result": // 循环完成
      if (message.subtype === "success") {
        console.log("完成：", message.result);
      }
      break;
  }
}
