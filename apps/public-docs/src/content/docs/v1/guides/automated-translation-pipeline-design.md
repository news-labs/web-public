---
title: automated Multilingual Documentation Pipeline Planning (EN → EN)
description: Automatic translation of Korean documents based on GitHub Actions - steps
  in designing and implementing a synchronization pipeline. DeepL/OpenAI, Glossary,
  Human-in-the-loop policy.
version: 1.0.0
lastUpdated: 2026-01-29
status: draft
sidebar:
  order: 2
translatedFromHash: 7d35313317ab647cb097384ba9850e4f86db2cf0dcc2c7e950bf7096a85f6164
---

This document outlines the planning and design of a pipeline that **automatically translates documents written in Korean into English and synchronizes them to the `en/` folder**. It does not include code implementation, defining only the architecture, triggers, tools, implementation steps, and Best Practices.

---

## 1. Objectives and Scope

### 1.1 Objectives

- **Principle**: The primary writing language is Korean (`ko/`). All source document are written under `docs/src/content/docs/ko/`.
- **Automation**: Whenever a Korean document is pushed, **English translation is automatically generated** and saved in the same relative path at `docs/src/content/docs/`.
- **Synchronization**: **Only content is synchronized** while maintaining Astro Starlight's multilingual structure (`ko/` , `en/`). This involves **translation**, not simple file copying.

### 1.2 Scope

| Include | Exclude |
|------|------|
| EN auto-translation when `docs/src/content/docs/ko/**/*.md` changes | `ko/` manual translation of original |
| Frontmatter `title` , `description` translation | Website build·deployment (maintain existing process) |
| Preserve Markdown body, code blocks·Mermaid syntax | Real-time translation API integration (batch only) |

---

## 2. Pipeline Architecture (GitHub Actions-based)

### 2.1 Overall Flow

1. **Trigger**: Developer pushes (or PRs) Korean documentation (`.md`) to `docs/src/content/docs/ko/`.
2. **Detection**: GitHub Actions detects changes to `on.push.paths` (or `pull_request.paths`) via `docs/src/content/docs/ko/**`.
3. **Translation**: Based on the list of modified/added files, translate **only the body and frontmatter text** into English using the **DeepL API** or **OpenAI (GPT-4o) API** while preserving the Markdown format (code blocks, frontmatter, Mermaid).
4. **Sync**: Save the translation results to the **same relative path** as `docs/src/content/docs/`. (e.g., `ko/v1/guides/foo.md` → `en/v1/guides/foo.md`)
5. **Commit / PR**: Commit the generated/modified English files to the repository, or commit to a dedicated branch and **create a PR**. Include ``[skip ci]`` in the commit message to prevent the translation commit from triggering the workflow again.

### 2.2 Diagram (Concept)

 ```
[개발자: ko/**/*.md Push]
         ↓
[GitHub Actions: paths = docs/src/content/docs/ko/**]
         ↓
[변경된 .md 파일 목록 추출]
         ↓
[번역 스크립트: DeepL or OpenAI]
  - Frontmatter title, description 번역
  - 본문 번역 (코드/Mermaid 블록은 스킵 또는 보존)
         ↓
[en/ 동일 경로에 저장]
         ↓
[git commit & push] or [Create PR]
``` 

---

## 3. Recommended Tools and Components

### 3.1 Translation API

- **Option A – DeepL API**  
  - Pros: Cost-quality balance, Markdown-friendly.  
  - Tool example: `deepl-transformer` Type action or direct call script (Python/Node).
- **Option B – OpenAI (GPT-4o) API**  
  - Advantages: Can explicitly specify directives like "preserve code blocks, Mermaid, frontmatter structure".  
  - Implementation: Use GitHub Actions secrets (`OPENAI_API_KEY`), request/parse via Python/Node script.

### 3.2 Workflow Components

- **Checkout**: `actions/checkout@v4` (Full directory or modified files only).
- **Translation Script**:  
  - Input: `--src docs/src/content/docs/ko` (or list of changed files),  
  - Output: `--dest docs/src/content/docs/en`  
  - Script location example: `scripts/translate_docs.py` or `scripts/translate_docs.mjs`.
- **Auto-commit**:  
  - Commit only changes to `en/` using `stefanzweifel/git-auto-commit-action@v5`,  
  - `commit_message`: e.g., `docs: automatic translation KO → EN [skip ci]`.

---

## 4. Specific Implementation Steps

### 4.1 Incorporating Rules and Policies

- **`.cursor/rules/docs.md`**  
  - Add/maintain the Multilingual·Translation Policy section.  
  - Key points:  
    - Original content is written only in `ko/`.  
    - `en/` is automatically generated via GitHub Actions, so **avoid manual editing**.  
    - When translating, ensure the Frontmatter fields `title` and `description` are included in the translation target.

### 4.2 GitHub Actions Workflow 

 - **File Location**: `.github/workflows/translate.yml` (or `translate-docs.yml`). 
 - **Trigger**:   
   -`on.push.paths`: `docs/src/content/docs/ko/**`   
   - (Optional) `on.pull_request.paths`: Preview translation results when PRing to the same path. 
 - **Job**:  
  - 1) Checkout, 2) Runtime (Python/Node) setup, 3) Execute translation script (inject API key into environment variables), 4) Auto-commit or create PR.

### 4.3 Translation Script Requirements (Planning Level)

- **Input**:  
  - Source directory: `docs/src/content/docs/ko`  
  - (Optional) Support argument to process only files modified in this Push.
- **Processing**:  
  - Markdown parsing: Distinguish Frontmatter / Body / Code blocks / Mermaid blocks.  
  - Translation targets: Text within Frontmatter (`title`, `description`) and body text excluding code/Mermaid.  
  - Recommended to pass **Glossary** when calling API (see 5.2 below).
- **Output**:  
  - Generate files under `en/` in the same relative path.  
  - Overwrite existing `en/` files (or explicitly state "overwrite only when changed").

### 4.4 Starlight Integration

- If `ko` and `en` are already configured in `astro.config.mjs`'s `locales`, English will appear in the **Language Selection** at the top of the site immediately upon file creation in `en/`. Minimize separate build configuration changes.

---

## 5. Architect Recommendations (Best Practices)

### 5.1 Human-in-the-loop

- Machine translation alone does not guarantee quality.  
- **Critical documents** (whitepapers, user manuals, etc.) should undergo a **review phase** after automatic translation.  
- Utilize the Frontmatter field ``status: review`` to distinguish the "Translation Complete·Pending Review" status, and implement a policy to switch to ``published`` after review completion.

### 5.2 Glossary Management

- Ensure **proper nouns and domain-specific terms** like ‘personalization engine’, ‘weight logic’, ‘seed contract’, etc., ensure **proper nouns and domain-specific terms** are consistently translated by designing a script that passes the **Glossary** along with translation API calls.  
- Manage the Glossary as a project file (e.g., `docs/glossary.csv`, `docs/glossary.json`) and read it via CI to pass as API parameters.

### 5.3 Eliminating Toil

- Manually translating and copying to `en/` constitutes **Toil (waste)** and causes version mismatches and duplicate edits.  
- **Automation via GitHub Actions is the default**; manual handling is recommended only for exceptions (e.g., urgent fixes).

---

## 6. Deliverables and Checklist (for implementation reference)

| Step | Deliverable | Notes |
|------|--------|------|
| 1 | Reflect multilingual/translation policy in `.cursor/rules/docs.md` | Update only if partially implemented |
| 2 | `.github/workflows/translate.yml` (or equivalent workflow) | Trigger, job, script invocation |
| 3 | Translation script (e.g., `scripts/translate_docs.py` or `.mjs`) | API selection (DeepL/OpenAI), Frontmatter/body/code separation |
| 4 | Glossary file and script integration | Optional but recommended |
| 5 | Secret configuration (e.g., `OPENAI_API_KEY` , `DEEPL_API_KEY`) | Repo Secrets |
| 6 | Automated commit actions or PR creation logic | Includes `[skip ci]` |

---

## 7. Summary

- **Trigger**: Execute GitHub Actions when `docs/src/content/docs/ko/**` changes.  
- **Translation**: Translate text only from KO → EN using DeepL or OpenAI (GPT-4o), preserving Markdown structure.  
- **Sync**: Save translation results to the same path: `docs/src/content/docs/`.  
- **Commit**: Auto-commit or create PR, prevent re-execution via `[skip ci]`.  
- **Policy**: Original source: `ko/`. Avoid automatic generation or manual editing of `en/`. For critical documents, use `status: review` for human-in-the-loop review and maintain term consistency via Glossary.

Based on this planning document, the next steps can specify the **detailed translation script design** and **workflow YAML·prompt configuration**.
