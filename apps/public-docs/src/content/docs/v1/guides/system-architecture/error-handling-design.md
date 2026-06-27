---
title: Error Handling Design
description: designing for error handling and debugging
sidebar:
  order: 3
translatedFromHash: e01f9aa0b0f680e53cccd926e5e94aad5794c7cc93e5e7d61992efd0c4f7fcbe
---

Problem Situation

### Actual Occurrence

When the user executed the command ``wrangler d1 create``:

```
--- 2026-01-28T06:19:24.460Z error
✘ [ERROR] A database with that name already exists
```

**Key Points**:
- Exit code: **Not 0** (treated as an error)
- HTTP Response: **400 Bad Request**
- But actual situation: **Resource already exists** (normal situation)

---

## Why check "Already Exists" first, regardless of the Exit Code?

### 1. Limitations of Exit Codes

#### General Exit Code Meanings
- `0`: Success
- `!= 0`: Failure

#### However, for the Cloudflare API

**Case A: Resource creation successful**
 ```
Exit code: 0
Output: "✅ Successfully created DB..."
``` 

**Case B: Resource already exists**
 ```
Exit code: 1 (또는 다른 non-zero 값)
Output: "✘ [ERROR] A database with that name already exists"
HTTP: 400 Bad Request
``` 

**Case C: Actual error (insufficient permissions, network error, etc.)**
 ```
Exit code: 1
Output: "✘ [ERROR] Authentication failed"
HTTP: 401 Unauthorized
``` 

### 2. "Already Exists" is not an error

#### Idempotent Operation

Resource creation scripts must be **idempotent**:
- Safe to execute once
- Produces the same result when executed multiple times
- An already existing resource is a **normal state**, not an error

#### Example

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

## Design Principle: "Meaning-Based Handling" vs "Exit Code-Based Handling"

### ❌ Exit Code-based processing (problematic approach)

 ```bash
D1_OUTPUT=$(npx wrangler d1 create "newsfork-metadata-dev" 2>&1)
D1_EXIT_CODE=$?

if [[ $D1_EXIT_CODE -eq 0 ]]; then
  echo "✅ Created"
else
  echo "❌ Error"  # ← "already exists"도 에러로 처리됨!
fi
``` 

**Issues**:
- "already exists" is also marked as an error
- Appears as an error when it's actually a normal situation
- Confuses users

### ✅ Meaning-Based Handling (Correct Approach)

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

**Advantages**:
- "already exists" is treated as a normal situation
- Only actual errors are displayed as errors
- Provides clear information to users

---

## Actual Behavior Comparison

### Scenario 1: Resource Already Exists

#### Exit Code-Based Handling
 ```bash
# Exit code: 1
# Output: "✘ [ERROR] A database with that name already exists"

if [[ $EXIT_CODE -eq 0 ]]; then
  echo "✅ Created"  # 실행 안 됨
else
  echo "❌ Error"  # ← 잘못된 메시지!
fi
``` 

**Result**: "❌ Error" displayed (user confusion)

#### Meaning-based handling
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

**Result**: "ℹ️ Already exists" displayed (clarity)

---

### Scenario 2: When an actual error occurs

#### Exit Code-based processing
 ```bash
# Exit code: 1
# Output: "✘ [ERROR] Authentication failed"

if [[ $EXIT_CODE -eq 0 ]]; then
  echo "✅ Created"
else
  echo "❌ Error"  # ← 올바른 메시지
fi
``` 

**Result**: "❌ Error" displayed (correct)

#### Meaning-based processing
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

**Result**: "❌ Error" displayed (correct)

---

## How the Cloudflare API Works

### HTTP Status Code vs Exit Code

The Cloudflare API uses HTTP status codes:

| Situation | HTTP Status | Exit Code | Meaning |
|------|-----------|-----------|------|
| Creation Successful | 200 OK | 0 | ✅ Success |
| Already Exists | 400 Bad Request | 1 | ℹ️ Normal (idempotent) |
| No Permission | 401 Unauthorized | 1 | ❌ Actual Error |
| Network Error | - | 1 | ❌ Actual Error |

**Issue**: Both "Already Exists" and "Actual Error" return the same Exit Code (1).

### Wrangler CLI Behavior

Wrangler converts HTTP status codes to Exit Codes:

 ```javascript
// Wrangler 내부 로직 (의사 코드)
if (httpStatus === 200) {
  exitCode = 0;  // 성공
} else {
  exitCode = 1;  // 모든 에러 (400, 401, 500 등 모두)
}
``` 

**Result**: 
- 400 (already exists) → exit code 1
- 401 (unauthorized) → exit code 1
- 500 (server error) → exit code 1

**All return the same exit code, making them indistinguishable!**

---

## Solution: Analyze output content

### Exit Code alone is insufficient

Exit Code only indicates **"success/failure"**.
- Success: exit code 0
- Failure: exit code != 0

But it cannot tell you **"the type of failure"**:
- Already exists (normal)
- No permission (error)
- Network error (error)

### Output analysis is essential

You must analyze the output to understand **"the meaning of the failure"**:

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

## Processing order in actual code

### Correct sequence

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

### Why this sequence?

1. **Output content is the most accurate information**
   - Exit Code is ambiguous (multiple situations share the same code)
   - Output content is specific (different messages for each situation)

2. **"Already exists" is a special case**
   - Exit Code is an error, but meaning is normal
   - Must check first for correct handling

3. **Actual errors are handled last**
   - All errors except "already exists"
   - Exit Code != 0 and output content is an error message

---

## Design Principle Summary

### 1. Semantic-based Handling

**Principle**: Prioritize the meaning of output content over Exit Code

**Reason**: 
- Exit Code is ambiguous
- Output content is concrete
- Provides more useful information to the user

### 2. Idempotent Operation

**Principle**: Safe to execute the same operation multiple times

**Reason**:
- Safe when re-running scripts
- Prevents duplicate executions in CI/CD
- Prevents user errors

### 3. Fail-Safe Default

**Principle**: Handle ambiguously in a safe manner

**Reason**:
- Treating "already exists" as an error confuses users
- Handling it as a normal situation is safe
- Actual errors are clearly indicated

---

## Real-world Example

### Case 1: Resource already exists

 ```bash
$ npx wrangler d1 create newsfork-metadata-dev
✘ [ERROR] A database with that name already exists
Exit code: 1
``` 

**Handling**:
 ```bash
# 출력 내용 확인
if echo "$OUTPUT" | grep -qi "already exists"; then
  echo "ℹ️  Already exists"  # ✅ 정상 처리
fi
``` 

**Result**: "ℹ️  Already exists" (clear to user)

---

### Case 2: Actual error (no permission)

 ```bash
$ npx wrangler d1 create newsfork-metadata-dev
✘ [ERROR] Authentication failed
Exit code: 1
``` 

**Handling**:
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

**Result**: "❌ Error: Authentication failed" (clear error)

---

### Case 3: Success

 ```bash
$ npx wrangler d1 create newsfork-metadata-dev
✅ Successfully created DB 'newsfork-metadata-dev'
Exit code: 0
``` 

**Processing**:
 ```bash
# 출력 내용 확인
if echo "$OUTPUT" | grep -qi "already exists"; then
  # 실행 안 됨
elif [[ $EXIT_CODE -eq 0 ]]; then
  echo "✅ Created"  # ✅ 성공 처리
fi
``` 

**Result**: "✅ Created" (Clear success)

---

## Conclusion

### Why check "Already Exists" first, regardless of the Exit Code?

1. **Exit Code ambiguity**
   - "already exists" and "actual error" share the same Exit Code
   - Indistinguishable

2. **Output Content is Precise**
   - Different messages per situation
   - Meaning can be clearly understood

3. **"Already Exists" is a Normal Situation**
   - Part of an Idempotent operation
   - Not an error, but an informational message

4. **Improved User Experience**
   - Provides clear messages
   - Prevents confusion

### Core Principle

> **"Exit Code is for reference; output content is the truth"**

Exit Code only indicates success/failure, but output content tells you **why it failed**.

---

**Date Written**: 2026-01-28  
**Design Principle**: Semantic-based Error Handling
