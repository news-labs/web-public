---
title: Translation Pipeline
description: 자동 다국어 문서 파이프라인 사용법 (KO → EN)
sidebar:
  order: 2
---

KO → EN 번역에 **DeepL API (Free tier)** 를 사용합니다. **전체 문서**가 번역 대상이며, 원본이 바뀌지 않은 파일은 재번역하지 않습니다.

- **번역 대상**: `docs/src/content/docs/ko/**/*.md` 전체. (수동 실행 시 `plan`, `archive` 경로는 제외 가능.)
- **기존 EN 문서**: 수정된 KO 문서가 이미 EN이 있으면 **추가 번역** 모드로, 기존 EN의 동일 섹션(## 제목 기준)은 유지하고 **새로 추가된 섹션만** 번역합니다.
- **변경 없으면 재번역 안 함**: EN frontmatter에 `translatedFromHash`(KO 원본 해시)가 있고, 현재 KO 파일 내용의 해시가 같으면 해당 파일은 스킵(API 호출·쓰기 생략).

## Setup

1. **DeepL API key (Free)**  
   - [DeepL API Free](https://www.deepl.com/pro-api#developer) 에서 가입.  
   - Free tier: 500,000 characters/month.  
   - 인증 키 생성.

2. **GitHub Secret**  
   - Repo → Settings → Secrets and variables → Actions.  
   - `DEEPL_AUTH_KEY` 시크릿 추가.

## DeepL API 키 확인

키가 정상 동작하는지 로컬에서 확인하려면:

```bash
# 의존성 설치 (한 번만)
pip install -r scripts/requirements-translate.txt

# 환경 변수에 키 설정 후 검증 스크립트 실행
export DEEPL_AUTH_KEY=your_deepl_auth_key
python scripts/check_deepl_key.py
```

- **성공**: `OK: DeepL API key is valid. Test translation: 'Hello.'` 처럼 출력되고 종료 코드 0.
- **실패**: `DEEPL_AUTH_KEY is not set` 또는 `DeepL API error: ...` 출력 후 종료 코드 1. 키가 없거나 잘못됐거나, Free 키인데 Pro 엔드포인트를 쓰는 경우 등에 나올 수 있음.
- **키 테스트는 되는데 번역 중 Forbidden**: DeepL Free tier **요청 빈도 제한**일 수 있음. `--delay 1.5`(파일 간 1.5초 대기)로 천천히 실행해 보세요.

## When it runs

- **Push** to `main` 시 `docs/src/content/docs/ko/**/*.md` 변경분만 감지 → 변경된 파일만 번역 (EN 존재 시 추가 번역, 원본 미변경 시 해시로 스킵).
- **수동 실행**: Actions → “Auto Translation (KO to EN, all docs)” → Run workflow → `ko/` 하위 전체 `.md` 번역 (`plan`, `archive` 제외). 이미 번역된 페이지는 원본이 바뀌지 않았으면 스킵.

## Glossary

Edit `docs/glossary.csv` (columns: `ko`, `en`) so terms like “개인화 엔진” → “personalization engine” are translated consistently. The script replaces those Korean phrases with placeholders before calling DeepL, then restores the chosen English.

## Local run

```bash
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
```

## 로컬에서 en 폴더 채우기 (번역된 파일이 없을 때)

GitHub 번역 워크플로가 실패했거나, `git checkout origin/main -- docs/src/content/docs/en/` 로 덮어쓴 뒤 **en에 파일이 거의 없을 때**는, 로컬에서 번역 스크립트를 한 번 돌려서 **ko 기준으로 en을 생성**하면 됩니다.

1. **DeepL API 키**가 있어야 합니다. (`DEEPL_AUTH_KEY` 환경 변수 또는 GitHub Secret에 설정된 키.)
2. **프로젝트 루트**에서 아래를 실행합니다.

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

- **결과**: `docs/src/content/docs/en/` 아래에 ko와 대응하는 영어 .md 파일이 생성·갱신됩니다 (plan, archive 제외). 이미 있고 원본이 바뀌지 않은 파일은 스킵됩니다.
- **커밋**: 로컬에서 생성된 en 파일을 그대로 커밋·푸시하면 원격에도 반영됩니다.

## What gets translated

- **Frontmatter**: only `title` and `description` are translated; `version`, `lastUpdated`, `status`, `sidebar`, etc. are kept as-is.  
- **Body**: all text; code blocks and ` ```mermaid ` blocks are preserved (not sent to DeepL).

## DeepL API 제한 (공식 레퍼런스)

[Translate Text API](https://developers.deepl.com/api-reference/translate) 기준:

- **요청 본문 크기**: 한 번에 **128 KiB (128·1024 bytes)** 초과 불가. 초과 시 여러 번 나눠 호출해야 함. (우리 스크립트는 약 80k 문자 단위로 청킹.)
- **API Free**: Free 키는 `https://api-free.deepl.com` 사용. Python SDK는 키에 따라 엔드포인트 자동 선택.
- **요청당 텍스트**: `text` 파라미터로 최대 50개까지 한 요청에 포함 가능. 응답은 요청 순서대로 반환.
- **tag_handling**: `xml` 사용 시 `<ignore>` 등으로 번역 제외 영역 지정. `ignore_tags`로 태그 이름 전달.
- **동일 언어 요청**: source와 target이 같아도 과금 대상. EN-US↔EN-GB 등 변형은 [별도 가이드](https://developers.deepl.com/docs/learning-how-tos/examples-and-guides/translating-between-variants) 참고.

## Error handling & robustness

- **Identical to source**: DeepL이 원문과 동일한 문자열을 반환하면 해당 파일은 **쓰지 않고 스킵**하며, 워크플로는 **실패하지 않음** (exit 0). 이미 영어인 문단이 섞인 문서에서 자주 발생.
- **XML tag handling**: 코드 블록·인라인 코드 내부의 `<ignore>`, `</ignore>`, `<`, `>`, `&` 는 DeepL 전송 전에 플레이스홀더로 마스킹하고, 번역 결과에서 복원. ASCII 다이어그램(`<`, `>`)이 있는 문서에서 "Tag handling parsing failed" 오류를 방지.
- **에러 시 중단 없음**: 특정 파일에서 오류(Tag handling parsing failed 등)가 나면 해당 파일만 건너뛰고 다음 파일로 계속 진행. 실패한 파일 경로는 `scripts/.translate_failed.txt` 에 저장되며, 나중에 해당 파일만 인자로 넘겨 재시도할 수 있음.
