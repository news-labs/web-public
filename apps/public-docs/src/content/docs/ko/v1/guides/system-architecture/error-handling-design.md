---
title: Error Handling Design
description: 에러 처리 및 디버깅 설계
sidebar:
  order: 3
---

## 문제 상황

### 실제 발생한 케이스

사용자가 `wrangler d1 create` 명령을 실행했을 때:

```
--- 2026-01-28T06:19:24.460Z error
✘ [ERROR] A database with that name already exists
```

**중요한 점**:
- Exit code: **0이 아님** (에러로 처리됨)
- HTTP 응답: **400 Bad Request**
- 하지만 실제 상황: **리소스가 이미 존재함** (정상적인 상황)

---

## 왜 Exit Code와 관계없이 "Already Exists"를 먼저 확인하는가?

### 1. Exit Code의 한계

#### 일반적인 Exit Code 의미
- `0`: 성공
- `!= 0`: 실패

#### 하지만 Cloudflare API의 경우

**케이스 A: 리소스 생성 성공**
```
Exit code: 0
Output: "✅ Successfully created DB..."
```

**케이스 B: 리소스가 이미 존재**
```
Exit code: 1 (또는 다른 non-zero 값)
Output: "✘ [ERROR] A database with that name already exists"
HTTP: 400 Bad Request
```

**케이스 C: 실제 에러 (권한 부족, 네트워크 오류 등)**
```
Exit code: 1
Output: "✘ [ERROR] Authentication failed"
HTTP: 401 Unauthorized
```

### 2. "Already Exists"는 에러가 아님

#### Idempotent Operation (멱등성 연산)

리소스 생성 스크립트는 **idempotent**해야 합니다:
- 한 번 실행해도 안전
- 여러 번 실행해도 같은 결과
- 이미 존재하는 리소스는 에러가 아니라 **정상 상태**

#### 예시

```bash
# 첫 번째 실행
./setup-cloudflare-resources.sh
# → D1 Database 생성됨 (exit code: 0)

# 두 번째 실행 (같은 리소스)
./setup-cloudflare-resources.sh
# → "already exists" (exit code: 1)
# → 하지만 이것은 에러가 아님! 정상적인 상황
```

---

## 설계 원칙: "의미 기반 처리" vs "Exit Code 기반 처리"

### ❌ Exit Code 기반 처리 (문제가 있는 방식)

```bash
D1_OUTPUT=$(npx wrangler d1 create "newsfork-metadata-dev" 2>&1)
D1_EXIT_CODE=$?

if [[ $D1_EXIT_CODE -eq 0 ]]; then
  echo "✅ Created"
else
  echo "❌ Error"  # ← "already exists"도 에러로 처리됨!
fi
```

**문제점**:
- "already exists"도 에러로 표시됨
- 실제로는 정상적인 상황인데 에러처럼 보임
- 사용자가 혼란스러워함

### ✅ 의미 기반 처리 (올바른 방식)

```bash
D1_OUTPUT=$(npx wrangler d1 create "newsfork-metadata-dev" 2>&1)
D1_EXIT_CODE=$?

# 1. 먼저 출력 내용을 확인 (의미 파악)
if echo "$D1_OUTPUT" | grep -qiE "already exists"; then
  echo "ℹ️  Already exists"  # 정상 상황
elif [[ $D1_EXIT_CODE -eq 0 ]]; then
  echo "✅ Created"  # 성공
else
  echo "❌ Error"  # 실제 에러
fi
```

**장점**:
- "already exists"는 정상 상황으로 처리
- 실제 에러만 에러로 표시
- 사용자에게 명확한 정보 제공

---

## 실제 동작 비교

### 시나리오 1: 리소스가 이미 존재하는 경우

#### Exit Code 기반 처리
```bash
# Exit code: 1
# Output: "✘ [ERROR] A database with that name already exists"

if [[ $EXIT_CODE -eq 0 ]]; then
  echo "✅ Created"  # 실행 안 됨
else
  echo "❌ Error"  # ← 잘못된 메시지!
fi
```

**결과**: "❌ Error" 표시 (사용자 혼란)

#### 의미 기반 처리
```bash
# Exit code: 1
# Output: "✘ [ERROR] A database with that name already exists"

if echo "$OUTPUT" | grep -qi "already exists"; then
  echo "ℹ️  Already exists"  # ← 올바른 메시지!
elif [[ $EXIT_CODE -eq 0 ]]; then
  echo "✅ Created"
else
  echo "❌ Error"
fi
```

**결과**: "ℹ️  Already exists" 표시 (명확함)

---

### 시나리오 2: 실제 에러가 발생한 경우

#### Exit Code 기반 처리
```bash
# Exit code: 1
# Output: "✘ [ERROR] Authentication failed"

if [[ $EXIT_CODE -eq 0 ]]; then
  echo "✅ Created"
else
  echo "❌ Error"  # ← 올바른 메시지
fi
```

**결과**: "❌ Error" 표시 (올바름)

#### 의미 기반 처리
```bash
# Exit code: 1
# Output: "✘ [ERROR] Authentication failed"

if echo "$OUTPUT" | grep -qi "already exists"; then
  echo "ℹ️  Already exists"  # 실행 안 됨
elif [[ $EXIT_CODE -eq 0 ]]; then
  echo "✅ Created"  # 실행 안 됨
else
  echo "❌ Error"  # ← 올바른 메시지
fi
```

**결과**: "❌ Error" 표시 (올바름)

---

## Cloudflare API의 동작 방식

### HTTP 상태 코드 vs Exit Code

Cloudflare API는 HTTP 상태 코드를 사용합니다:

| 상황 | HTTP 상태 | Exit Code | 의미 |
|------|-----------|-----------|------|
| 생성 성공 | 200 OK | 0 | ✅ 성공 |
| 이미 존재 | 400 Bad Request | 1 | ℹ️ 정상 (idempotent) |
| 권한 없음 | 401 Unauthorized | 1 | ❌ 실제 에러 |
| 네트워크 오류 | - | 1 | ❌ 실제 에러 |

**문제**: "이미 존재"와 "실제 에러"가 모두 같은 Exit Code (1)를 반환합니다.

### Wrangler CLI의 동작

Wrangler는 HTTP 상태 코드를 Exit Code로 변환합니다:

```javascript
// Wrangler 내부 로직 (의사 코드)
if (httpStatus === 200) {
  exitCode = 0;  // 성공
} else {
  exitCode = 1;  // 모든 에러 (400, 401, 500 등 모두)
}
```

**결과**: 
- 400 (already exists) → exit code 1
- 401 (unauthorized) → exit code 1
- 500 (server error) → exit code 1

**모두 같은 exit code이므로 구분 불가능!**

---

## 해결 방법: 출력 내용 분석

### Exit Code만으로는 불충분

Exit Code는 **"성공/실패"**만 알려줍니다.
- 성공: exit code 0
- 실패: exit code != 0

하지만 **"실패의 종류"**는 알 수 없습니다:
- 이미 존재 (정상)
- 권한 없음 (에러)
- 네트워크 오류 (에러)

### 출력 내용 분석이 필수

출력 내용을 분석해야 **"실패의 의미"**를 알 수 있습니다:

```bash
# 출력 내용 분석
if echo "$OUTPUT" | grep -qi "already exists"; then
  # 의미: 리소스가 이미 존재함 (정상)
elif echo "$OUTPUT" | grep -qi "authentication"; then
  # 의미: 인증 실패 (에러)
elif echo "$OUTPUT" | grep -qi "network"; then
  # 의미: 네트워크 오류 (에러)
else
  # 의미: 알 수 없는 에러
fi
```

---

## 실제 코드에서의 처리 순서

### 올바른 순서

```bash
# 1. 명령 실행
OUTPUT=$(command 2>&1)
EXIT_CODE=$?

# 2. 출력 내용 분석 (의미 파악) - 우선순위 1
if echo "$OUTPUT" | grep -qi "already exists"; then
  # 정상 상황: 이미 존재
  echo "ℹ️  Already exists"
  
# 3. Exit Code 확인 (의미 파악 실패 시) - 우선순위 2
elif [[ $EXIT_CODE -eq 0 ]]; then
  # 성공
  echo "✅ Created"
  
# 4. 실제 에러 처리 - 우선순위 3
else
  # 실제 에러
  echo "❌ Error: $OUTPUT"
fi
```

### 왜 이 순서인가?

1. **출력 내용이 가장 정확한 정보**
   - Exit Code는 모호함 (여러 상황이 같은 코드)
   - 출력 내용은 구체적 (각 상황마다 다른 메시지)

2. **"Already exists"는 특별한 케이스**
   - Exit Code는 에러지만 의미는 정상
   - 먼저 체크해야 올바르게 처리

3. **실제 에러는 마지막에 처리**
   - "already exists"가 아닌 모든 에러
   - Exit Code != 0이고 출력 내용도 에러 메시지

---

## 설계 원칙 요약

### 1. 의미 기반 처리 (Semantic-based Handling)

**원칙**: Exit Code보다 출력 내용의 의미를 우선시

**이유**: 
- Exit Code는 모호함
- 출력 내용은 구체적
- 사용자에게 더 유용한 정보

### 2. Idempotent Operation

**원칙**: 같은 작업을 여러 번 실행해도 안전

**이유**:
- 스크립트 재실행 시 안전
- CI/CD에서 중복 실행 방지
- 사용자 실수 방지

### 3. Fail-Safe Default

**원칙**: 모호한 경우 안전하게 처리

**이유**:
- "already exists"를 에러로 처리하면 사용자 혼란
- 정상 상황으로 처리하면 안전
- 실제 에러는 명확하게 표시

---

## 실제 예시

### 케이스 1: 리소스가 이미 존재

```bash
$ npx wrangler d1 create newsfork-metadata-dev
✘ [ERROR] A database with that name already exists
Exit code: 1
```

**처리**:
```bash
# 출력 내용 확인
if echo "$OUTPUT" | grep -qi "already exists"; then
  echo "ℹ️  Already exists"  # ✅ 정상 처리
fi
```

**결과**: "ℹ️  Already exists" (사용자에게 명확함)

---

### 케이스 2: 실제 에러 (권한 없음)

```bash
$ npx wrangler d1 create newsfork-metadata-dev
✘ [ERROR] Authentication failed
Exit code: 1
```

**처리**:
```bash
# 출력 내용 확인
if echo "$OUTPUT" | grep -qi "already exists"; then
  # 실행 안 됨
elif [[ $EXIT_CODE -eq 0 ]]; then
  # 실행 안 됨
else
  echo "❌ Error: $OUTPUT"  # ✅ 에러 처리
fi
```

**결과**: "❌ Error: Authentication failed" (명확한 에러)

---

### 케이스 3: 성공

```bash
$ npx wrangler d1 create newsfork-metadata-dev
✅ Successfully created DB 'newsfork-metadata-dev'
Exit code: 0
```

**처리**:
```bash
# 출력 내용 확인
if echo "$OUTPUT" | grep -qi "already exists"; then
  # 실행 안 됨
elif [[ $EXIT_CODE -eq 0 ]]; then
  echo "✅ Created"  # ✅ 성공 처리
fi
```

**결과**: "✅ Created" (명확한 성공)

---

## 결론

### 왜 Exit Code와 관계없이 "Already Exists"를 먼저 확인하는가?

1. **Exit Code는 모호함**
   - "already exists"와 "실제 에러"가 같은 Exit Code
   - 구분 불가능

2. **출력 내용이 정확함**
   - 각 상황마다 다른 메시지
   - 의미를 명확히 파악 가능

3. **"Already Exists"는 정상 상황**
   - Idempotent operation의 일부
   - 에러가 아니라 정보 메시지

4. **사용자 경험 개선**
   - 명확한 메시지 제공
   - 혼란 방지

### 핵심 원칙

> **"Exit Code는 참고용, 출력 내용이 진실"**

Exit Code는 성공/실패만 알려주지만, 출력 내용은 **왜 실패했는지** 알려줍니다.

---

**작성 일시**: 2026-01-28  
**설계 원칙**: Semantic-based Error Handling
