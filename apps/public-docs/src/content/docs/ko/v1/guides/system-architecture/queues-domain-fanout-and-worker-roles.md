---
title: Queues 도메인 분산 및 Worker 역할
description: Seed/Domain Queue 파이프라인, 파일 1개→N 도메인 분산, Producer/Consumer 역할 구분. 확정 설계.
sidebar:
  order: 13
---

# Queues 도메인 분산 및 Input/Output Worker 역할

**문서 버전**: 1.0  
**목적**: Seed Queue Consumer가 추출한 도메인을 Edge에서 어떻게 처리하는지, **"도메인 1개 = 1 Worker"** 분산 구조와 Input(Producer) / Output(Consumer) Worker 구분을 정리한 **확정 설계** 문서.

---

## 1. 개요

- **파일 1개** → SEED_QUEUE 메시지 1건 → **Seed Consumer 1회** 실행.
- Seed Consumer는 그 파일에서 **도메인 N개(예: 200개)를 추출**한 뒤, **DOMAIN_QUEUE에 메시지 N건(200건)을 전송**.
- **도메인 1개** → DOMAIN_QUEUE 메시지 1건 → **Domain Consumer 1회** 실행.

따라서 **"200개 도메인"은 이미 200개의 Queue 메시지로 나뉘어 있고, 각 메시지는 별도 Domain Consumer Worker에서 처리**된다.  
즉, **"한 파일에 200개 도메인 → 200개 Worker가 도메인 1개씩 처리"**하는 구조로 기획·구현되어 있다.

---

## 2. 현재 파이프라인 요약

### 2.1 단계별 흐름

| 단계 | 트리거 | 큐 | 역할 | 메시지 단위 |
|------|--------|-----|------|-------------|
| 1. 오케스트레이션 | HTTP `POST /seeds/orchestrate` | SEED_QUEUE (Producer) | R2 raw 파일 목록 조회 → **파일 1개당 메시지 1건** 전송 | **1 file** |
| 2. 파일 처리 | SEED_QUEUE (Consumer) | DOMAIN_QUEUE (Producer) | raw 파일 1개 읽기·파싱·도메인 추출 → **도메인 1개당 메시지 1건** 전송 | **1 file → N domains** |
| 3. 도메인 처리 | DOMAIN_QUEUE (Consumer) | — | 도메인 1개당 robots.txt·sitemap 수집·R2 저장 | **1 domain** |

---

## 3. Seed Queue Consumer가 실제로 하는 일

### 3.1 "200개 도메인을 한 Worker에서 처리"가 아님

Seed Consumer(파일 1개 = Worker 1회)가 하는 일:

1. **R2에서 raw 파일 1개 읽기** (get 1회)
2. **JSON 파싱·스키마 검증** (메모리 내 처리)
3. **도메인 목록 추출** (루프, 메모리 내)
4. **도메인마다 `DOMAIN_QUEUE.send(...)` 호출** (N회, 예: 200회)
5. **성공 시 `{file_path}.success` 기록** (put 1회)

**도메인당 외부 HTTP 요청(robots.txt, sitemap 등)은 하지 않는다.**  
그런 작업은 **Domain Queue Consumer**에서만 수행한다.

### 3.2 부담이 큰 쪽

- **Seed Consumer**: R2 1회 읽기 + JSON 파싱 + 도메인 추출 + **N회 queue.send** (예: 200회).
- **Domain Consumer**: 도메인 1개당 **HTTP 2회(robots, sitemap)** + R2 쓰기. **이미 도메인 1개 = Worker 1회**로 분산되어 있음.

---

## 4. Input / Output Worker 구분

### 4.1 Cloudflare Queues 용어

- **Producer(입력 측)**: 큐에 메시지를 **보내는** 쪽.
- **Consumer(출력 측)**: 큐에서 메시지를 **받아 처리하는** 쪽. 동일 Worker 스크립트가 여러 큐에 대해 Producer이자 Consumer일 수 있음.

### 4.2 현재 프로젝트에서의 구분

| 구분 | 큐 | Input(Producer) | Output(Consumer) |
|------|-----|------------------|-------------------|
| **파일 단위 작업** | SEED_QUEUE | **Orchestrator** (HTTP `POST /seeds/orchestrate`) | **Seed Consumer** |
| **도메인 단위 작업** | DOMAIN_QUEUE | **Seed Consumer** (파일 처리 중 `DOMAIN_QUEUE.send` N회) | **Domain Consumer** |

- **wrangler 설정**: `max_batch_size: 1` → 파일 1개당/도메인 1개당 Consumer 1회.

---

## 5. 요약 및 결론

| 질문 | 결론 |
|------|------|
| Seed Consumer가 200개 도메인을 **한 Worker에서 전부 처리**하는가? | **아니오.** 200개는 DOMAIN_QUEUE로 200건 메시지가 되고, **Domain Consumer가 도메인 1개씩** 처리한다. |
| 200개를 **여러 Worker로 나누어** 실행하는가? | **예.** DOMAIN_QUEUE + `max_batch_size: 1` + Consumer concurrency로 **이미 "한 도메인씩 여러 Worker"**로 분산된다. |
| **Input / Output Worker**가 구분되는가? | **예.** SEED_QUEUE·DOMAIN_QUEUE 각각 Producer(Input)와 Consumer(Output)가 역할별로 구분되어 있다. |

- **Seed Consumer**: 파일 1개에 대해 R2 읽기 + 파싱 + 도메인 추출 + **N회 DOMAIN_QUEUE.send** (HTTP 200회가 아님).
- **Domain Consumer**: 도메인 1개에 대해 HTTP(robots/sitemap) + R2 저장 → **이미 N개 Worker로 분산**됨.
