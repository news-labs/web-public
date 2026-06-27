---
title: Translation Pipeline
description: using the automatic multilingual documentation pipeline (EN → EN)
sidebar:
  order: 2
translatedFromHash: 22b50a0d45e5b0901494f6e5d1ea70af412343972483e5b2e73871f1c6171581
---

We use the **DeepL API (Free tier)** for Korean → English translation. The **entire document** is subject to translation, and files whose original content has not changed will not be retranslated.

- **Translation Target**: Entire `docs/src/content/docs/ko/**/*.md`. (When manually executed, paths like `plan` and `archive` can be excluded.)
- **Existing EN Documents**: If a modified KO document already has an EN version, it operates in **additional translation** mode. It preserves the existing EN's identical sections (based on ## headings) and translates **only newly added sections**.
- **No Retranslation if Unchanged**: If the EN frontmatter contains ``translatedFromHash`` (KO original hash) and the current KO file content hash matches, skip that file (omit API call/write).

## Setup

1. **DeepL API key (Free)**  
   - Sign up at [DeepL API Free](https://www.deepl.com/pro-api#developer).  
   - Free tier: 500,000 characters/month.  
   - Generate an authentication key.

2. **GitHub Secret**  
   - Repo → Settings → Secrets and variables → Actions.  
   - Add the secret: ``DEEPL_AUTH_KEY``.

## Verify DeepL API Key

To verify the key works locally:

 ```bash
# 의존성 설치 (한 번만)
pip install -r scripts/requirements-translate.txt

# 환경 변수에 키 설정 후 검증 스크립트 실행
export DEEPL_AUTH_KEY=your_deepl_auth_key
python scripts/check_deepl_key.py
``` 

- **Success**: Outputs ``OK: DeepL API key is valid. Test translation: 'Hello.'`` and exits with status code 0.

- **Failure**: Outputs ``DEEPL_AUTH_KEY is not set`` or ``DeepL API error: ...`` and exits with status code 1. Output like this and exit code 0.
- **Failure**: Output  or  and exit code 1. This can occur if the key is missing or incorrect, or if a Free key is used with a Pro endpoint.
- **Key test succeeds but Forbidden during translation**: This may be due to DeepL Free tier **request rate limits**. `--delay 1.5`(Wait 1.5 seconds between files) and run slowly.

## When it runs

- **Push** to `main`: `docs/src/content/docs/ko/**/*.md` Detects only changes → Translates only changed files (Adds translation if EN exists, skips if original unchanged via hash).
- **Manual execution**: Actions → “Auto Translation (KO to EN, all docs)” → Run workflow → `ko/` Sub-directory `.md` Translation (excluding `plan`, `archive`). Skip already translated pages if original hasn't changed.

## Glossary

Edit `docs/glossary.csv` (columns: `ko`, `en`) so terms like “personalization engine” → “personalization engine” are translated consistently. The script replaces those Korean phrases with placeholders before calling DeepL, then restores the chosen English. Local run ```bash
pip install -r scripts/requirements-translate.txt
export DEEPL_AUTH_KEY=your_key
# 전체 문서 번역 (원본 미변경 시 스킵, plan/archive 제외, --delay 1.5 로 Free tier 제한 회피)
python scripts/translate_docs.py \
  --src docs/src/content/docs/ko \
  --dest docs/src/content/docs/en \
  --glossary docs/glossary.csv \
  --incremental \
  --exclude plan,archive \
  --delay 1.5
# v1 API 폴더만:
python scripts/translate_docs.py ... --only-v1-api --incremental --delay 1.5
# 원본 미변경 스킵 비활성화(전부 재번역):
python scripts/translate_docs.py ... --no-skip-unchanged
# 특정 파일만:
python scripts/translate_docs.py --src ... --dest ... --glossary ... --incremental \
  docs/src/content/docs/ko/v1/api/seeds-api.md
``` Filling the en folder locally (when no translated files exist)

If the GitHub translation workflow failed, or if you overrode it with ``git checkout origin/main -- docs/src/content/docs/`` and **the en folder is nearly empty**, you can run the translation script locally once to **generate en files based on ko**.

1. You must have a **DeepL API key**. (Set via environment variables or GitHub Secrets: `DEEPL_AUTH_KEY`.)
2. Run the following in the **project root**.

 ```bash
# 의존성 설치 (한 번만)
pip install -r scripts/requirements-translate.txt

# API 키 설정 (본인 키로 교체)
export DEEPL_AUTH_KEY=your_deepl_auth_key

# ko → en 전체 번역 (plan, archive 제외). --delay 1.5 로 요청 간격 두어 Free tier 제한 회피.
python scripts/translate_docs.py \
  --src docs/src/content/docs/ko \
  --dest docs/src/content/docs/en \
  --glossary docs/glossary.csv \
  --exclude plan,archive \
  --delay 1.5
``` 

- **Result**: English .md files corresponding to Korean ones are created/updated under `docs/src/content/docs/` (excluding plan and archive). Existing files whose source hasn't changed are skipped.
- **Commit**: Commit and push the locally generated en files directly; they will be reflected on the remote.

## What gets translated

- **Frontmatter**: Only `title` and `description` are translated; `version` , `lastUpdated` , `status` , `sidebar` , etc. are kept as-is.  
- **Body**: all text; code blocks and ` ```mermaid ` blocks are preserved (not sent to DeepL).

## DeepL API Limits (Official Reference)

[Translate Text API](https://developers.deepl.com/api-reference/translate) Basis:

- **Request Body Size**: Cannot exceed **128 KiB (128·1024 bytes)** per request. Exceeding this requires splitting into multiple calls. (Our script chunks around 80k characters.)
- **API Free**: Free key uses `https://api-free.deepl.com`. The Python SDK automatically selects endpoints based on the key.
- **Text per Request**: Up to 50 texts can be included in a single request using the `text` parameter. Responses are returned in the order of requests.
- **tag_handling**: When using `xml`, specify translation exclusion areas like `<ignore>`. `ignore_tags` Pass tag names as .
- **Same Language Requests**: Charged even if source and target are identical. Variants like EN-US↔EN-GB refer to [separate guide](https://developers.deepl.com/docs/learning-how-tos/examples-and-guides/translating-between-variants).

## Error handling & robustness 

 - **Identical to source**: If DeepL returns a string identical to the source text, the file is **skipped without writing**, and the workflow **does not fail** (exit 0). This frequently occurs in documents containing paragraphs already in English.
- **XML tag handling**: Tags within code blocks or inline code (`<ignore>`, `</ignore>`, `<`, `>`, `&`) are masked as placeholders before DeepL transmission and restored in the translation result. Prevent "Tag handling parsing failed" errors in documents containing ASCII diagrams (`<`, `>`).
- **No interruption on error**: If an error occurs in a specific file (e.g., "Tag handling parsing failed"), only that file is skipped and processing continues to the next file. The path of the failed file is saved in ``scripts/.translate_failed.txt``, allowing it to be retried later by passing only that file as an argument.
