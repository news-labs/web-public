---
title: Cursor Usage
description: How to use Cursor AI and ultra-fast development practice flow
sidebar:
  order: 6
translatedFromHash: 6e0070c8df71a9ca26d1b772bc789f43363014dabcb9ae9bbfdfa37b6e6eaae3
---

## Key Features

As an advanced developer and Cursor power user, I'll highlight **three core features exclusive to Cursor that create a significant gap** compared to other IDEs (like VS Code + Copilot). Mastering these features will accelerate your development speed by over five times.

### 1. Composer & Agent Mode (Cmd + I)

This goes beyond simply suggesting code; it enables **system-wide design across multiple files**.

- **Key Difference**: While regular chat might say "Fix this file," Composer can handle "Create and connect the API, DB schema, and frontend components needed for a new feature."
- **Advanced Tip**: Use ``Agent Mode``. The AI executes terminal commands itself to install libraries, fixes errors autonomously, and loops through tasks until completion.

### 2. Codebase Indexing & @Symbol

Cursor indexes your entire project by vectorizing it. Even with hundreds of files, the AI knows all the connections.

- **Key Difference**: Using `@Codebase` enables the AI to understand "where this data flows from and to across the entire project."
- **Advanced Tip**: When asking questions, narrow the scope using `@Files` or `@Folders` to maximize inference speed and accuracy.

### 3. AI Review (Beta)

After writing code, **AI proactively suggests bugs or improvements**.

- **Key Difference**: Before you ask, AI will proactively say things like "A memory leak may occur here" or "This logic differs from the design defined in `@docs`."
- **Advanced Tip**: Always check the **Review tab** in the sidebar.

## Development Flow

Here's how to maximize Cursor's AI performance while applying it directly to the server.

### Step 1: Generate code locally and validate immediately

- **Cursor Chat**: "Write a POST router in Hono to handle this `Articles` schema."
- **Action**: Apply the code and test locally at `localhost:8787` while keeping `pnpm wrangler dev` open in the terminal.

### Step 2: Instruct AI to Deploy

- After local testing, command Cursor.
- **Prompt**: "Logic verification complete. Now run ``wrangler deploy`` to deploy it to the server, then test using the deployed URL."

### Step 3: Remote Log Monitoring (Tail)

- After deploying to the server, if errors occur, enter the following in the Cursor terminal:

```bash
pnpm wrangler tail
```

- **Debug**: After enabling Cursor to read the remote error logs displayed in the terminal, instruct it: **"Analyze these error logs, identify the cause, and fix it."**

## .cursorrules configuration

To prevent AI errors during direct server deployment development, add the following rule to ``.cursorrules``.

 ```
1. Cloudflare Workers AI 기능을 테스트할 때는 반드시 'wrangler deploy' 후 실제 환경에서 검증할 것.
2. 배포 전 반드시 'wrangler types'를 실행하여 D1이나 AI 바인딩의 타입을 최신화할 것.
3. 에러 발생 시 'wrangler tail' 로그를 분석하여 원격 환경의 제약 사항을 파악할 것.
``` 

## Context Optimization (Advanced)

Focus on **quality over quantity** for the 85.9K / 128K token context.

### Plan First, Code Second

- **Use Planning Mode:** Describe tasks in detail after `Plan:`
- **Document Plans in `.md`:** For complex tasks, document separately in Markdown then reference `@파일`

### Surgical Context Injection

- **`@파일이름`:** Tag only core files directly relevant to the task
- **`@파일이름:줄번호`:** Specify only specific functions/code blocks
- **Remove Unrelated Files:** Immediately remove automatically included irrelevant files

### Chat Session Lifecycle

- **`Cmd + L`:** New chat tab for new tasks
- **`/summarize`:** Summarize and start new session when conversation gets long
- **Single Task:** One chat = one clear task

## Best Practice

**"Using `wrangler dev` as the default, but frequently pushing critical features to the server"** is the most robust approach. Especially with **Modal.com** integration, accurate testing locally can be difficult due to varying network environments, so deploying to the server in parallel is good for your mental health.
