---
title: Personalization Engine Design
description: news personalization engine Design (weights-pipeline)
sidebar:
  order: 1
translatedFromHash: ecbd6962363745ec790c747a73a9556064e75b65bca9476a68bf251eacda3455
---

This document defines the design principles, data flow, and Redis-based caching strategy for the Newsfork news personalization engine.

## 1. Overview

personalization enginecollects **user clicks** and **dwell time(dwell time)** signals to estimate interest vector, and adjusts news feed rankings based on this.

## 2. Interest Extraction Logic

### 2.1 Signal Definitions

| Signal | Description | Weight Reflection |
|------|------|-------------|
| **Click** | Whether article was clicked | Increases weight for relevant topic/entity upon click |
| **dwell time** | Article page dwell time(seconds) | Reflects weight as positive signal if exceeds threshold |

### 2.2 Weight Update Rules

- **Click**: Increases the weight for the article's category/tag/entity by a fixed percentage.
- **dwell time**: If above the set threshold (e.g., 30 seconds), updates the weight in the same direction as a click. Ignore or apply decay to short dwells.
- **Decay**: Periodically reduces interest weights over time, allowing recent actions to have greater influence.

## 3. Redis Cache Strategy

### 3.1 Storage Structure

- **Key Pattern**: `user:{userId}:interests` — Per-user interest vector(hash or sorted set).
- **TTL**: Set TTL for inactive user keys to limit memory usage.
- **Write**: Perform incremental updates to Redis upon receiving events (clicks/dwells); periodically synchronize with persistent storage after batch aggregation.

### 3.2 Read Strategy

- Queries interest vector from Redis upon personalized feed requests.
- Falls back to default profile or empty vector on cache misses, with asynchronous recovery from event history.

## 4. Overall Data Flow

The Mermaid diagram below illustrates the data flow of personalization engine.

 ```mermaid
graph TD
  subgraph 클라이언트
    A[사용자 클릭] --> B[이벤트 수집]
    C[dwell time] --> B
  end

  subgraph 수집 계층
    B --> D[이벤트 큐]
    D --> E[이벤트 검증]
    E --> F[가중치 계산]
  end

  subgraph 캐시 및 저장
    F --> G[(Redis interest vector)]
    G --> H[개인화 피드 조회]
    H --> I[ranking service]
    I --> J[클라이언트 피드 응답]
  end

  subgraph 선택적 동기화
    G -.-> K[(영구 저장소)]
  end
``` 

## 5. Summary

- **Input**: Click events, dwell time.
- **Processing**: Weight-based interest extraction, decay application.
- **Cache**: Redis per-user interest vector, TTL, and fallback policy.
- **Output**: Personalized news feed ranking.

This design is a draft and will maintain change history based on version 1.0.0 during implementation.
