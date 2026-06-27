---
title: Seeds
description: Seeds
version: 1
lastUpdated: 2026-01-29
status: auto-generated
translatedFromHash: 071793e4bee35cabdd54543ffb022da3af0847e50a9dbea3fb769cb8e80627bf
---

This document was automatically generated from the README in the **seeds** folder. # Seeds Seeds represent the **contract phase** of the NewsFork pipeline. ## Philosophy > "Seed Engine defines HOW to fetch content."Seeds are production-ready contracts that specify exactly how to retrieve content from a source, including: - Fetch method (HTML, RSS, API) - Content selectors - Update frequency - Validation rules ## Structure ```
seeds/
├── drafts/             # Pending review
│   └── country=sg/
│       └── domain=mom.gov.sg/
│           └── content=news/
│               └── v1.json
├── active/             # Production contracts
│   └── country=sg/
│       └── ...
├── archived/           # Historical
│   └── ...
└── README.md
``` ## Storage Seed contracts are stored in **GitHub** for version control and audit trail: - **Primary Storage**: GitHub repository - **Path Format**: `seeds/{status}/country={code}/domain={domain}/content={type}/v{version}.json` - **Backup**: R2 (via metadata sync, future) ## Lifecycle

 ```
┌─────────┐    review    ┌─────────┐    deprecate    ┌──────────┐
│  draft  │ ──────────▶  │  active │ ─────────────▶  │ archived │
└─────────┘              └─────────┘                 └──────────┘
                              │
                              │ suspend
                              ▼
                         ┌───────────┐
                         │ suspended │
                         └───────────┘
``` 

## Seed Contract Schema

 ```json
{
  "seed_id": "sg-mom-001",
  "source": {
    "domain": "mom.gov.sg",
    "type": "government",
    "name": "Ministry of Manpower",
    "country": "SG"
  },
  "discovery": {
    "alive": true,
    "checked_at": "2026-01-23T04:10:00Z"
  },
  "contents": [
    {
      "nature": "news",
      "source_url": "https://www.mom.gov.sg/newsroom",
      "fetch_type": "html",
      "medium": "web",
      "confidence": 0.92
    }
  ],
  "status": "draft",
  "version": 1
}
``` 

## Key Concepts

### Source Type vs Content Category

**Source Type** (WHO produces):
- `government` - Official government entities
- `organization` - Non-profit organizations
- `media` - News outlets
- `company` - Private companies

**Content Category** (WHAT the content is):
- `news` - Time-sensitive announcements
- `policy` - Laws, regulations
- `guide` - How-to content
- `faq` - Q&A structured info

### Versioning Seeds are versioned to track changes: - `v1.json` , `v2.json` , etc. - Version bumps on content/structure changes - Discovery updates don't bump version ### Promotion Flow 1. Research discovers URLs (R2 datasets) 2. Seed Engine creates draft (via API)
3. Human reviews draft
4. PR merged → promoted to active (via API)
5. Scraper trusts active seeds only

## API Endpoints

### Seed Operations

| Method | Endpoint | Description |
|----|----------|------------|-|
| GET | `/api/v1/seeds` | List seeds with filters |
| GET | `/api/v1/seeds/:id` | Get seed by ID |
| POST | `/api/v1/seeds` | Create draft seed |
| PATCH | `/api/v1/seeds/:id` | Update seed |
| POST | `/api/v1/seeds/:id/promote` | Promote to active |
| POST | `/api/v1/seeds/:id/archive` | Archive seed |

### Query Parameters

List seeds with filtering:

 ```bash
GET /api/v1/seeds?country=SG&status=active&source_type=government
``` 

Supported filters:
- `country`: Country code (SG, GB, US, etc.)
- `status`: draft, active, archived, suspended
- `source_type`: government, organization, media, company
- `limit`: Number of results (default: 50, max: 100)
- `offset`: Pagination offset

## Service Layer The Seed Service (`src/services/seed.service.ts`) orchestrates: - **Domain Functions**: Pure business logic (no Cloudflare dependencies) - **Infra Adapters**: GitHub storage for contracts - **Validation**: Zod schema validation ### Key Functions

 ```typescript
// Domain functions (pure, testable)
createSeedContract(input: SeedCreateRequest): SeedContract
validateSeedContract(contract: SeedContract): ValidationResult
promoteSeedToActive(contract: SeedContract): SeedContract
createSeedPath(...): string

// Service layer (orchestrates domain + infra)
SeedService.list(params): Promise<SeedListResult>
SeedService.get(seedId): Promise<SeedContract>
SeedService.create(request): Promise<SeedContract>
SeedService.update(seedId, request): Promise<SeedContract>
SeedService.promote(seedId): Promise<SeedContract>
``` 

## Contract Creation Flow

 ```
1. Research Dataset (R2)
   ↓
2. Seed Candidate Analysis
   ↓
3. Draft Seed Creation
   POST /api/v1/seeds
   {
     "source": { ... },
     "contents": [ ... ]
   }
   ↓
4. Human Review (GitHub PR)
   ↓
5. Promotion
   POST /api/v1/seeds/:id/promote
   ↓
6. Active Seed (GitHub)
   seeds/active/country=sg/domain=.../v1.json
``` 

## Duplicate Detection

The system automatically checks for duplicate seeds:

- **Domain-based**: Same domain + country combination
- **Content-based**: Same source URL + content type
- **KV Cache**: Fast lookup via Cloudflare KV

Duplicate seeds are rejected with appropriate error messages.

## Path Format Seeds use Hive-style partitioning: ```
seeds/drafts/country=sg/domain=mom.gov.sg/content=news/v1.json
seeds/active/country=sg/domain=mom.gov.sg/content=news/v1.json
seeds/archived/country=sg/domain=mom.gov.sg/content=news/v1.json
``` This format: - Enables efficient querying by country/domain - Supports versioning (v1, v2, etc.) - Compatible with data lake tools ## Status Management ### Draft - Initial state for all new seeds - Stored in `seeds/drafts/` - Requires human review before promotion ### Active Active

- Production-ready contracts
- Stored in `seeds/active/` 
- Trusted by scrapers
- Can be suspended or archived

### Suspended

- Temporarily disabled
- Still in `seeds/active/` but marked as suspended
- Can be reactivated

### Archived

- Deprecated or replaced
- Stored in `seeds/archived/` 
- Historical record only

## Versioning Strategy Seeds are versioned when: - Content structure changes - Fetch method changes - Selectors are updated - Validation rules change Versioning does NOT occur for: - Discovery updates (liveness checks)
- Metadata updates
- Status changes

## Integration with Research

Seeds are created from Research datasets:

1. **Research Discovery**: URLs discovered and stored in R2
2. **Seed Analysis**: Analyze research datasets for seed candidates
3. **Contract Generation**: Create seed contracts from candidates
4. **Review Process**: Human review via GitHub PRs
5. **Promotion**: Promote approved seeds to active

## Data Access

### Via API

 ```bash
# List active seeds
curl https://api.example.com/api/v1/seeds?status=active&country=SG

# Get specific seed
curl https://api.example.com/api/v1/seeds/sg-mom-001

# Create draft seed
curl -X POST https://api.example.com/api/v1/seeds \
  -H "Content-Type: application/json" \
  -d '{
    "source": {
      "domain": "mom.gov.sg",
      "type": "government",
      "country": "SG"
    },
    "contents": [{
      "nature": "news",
      "source_url": "https://www.mom.gov.sg/newsroom",
      "fetch_type": "html"
    }]
  }'

# Promote to active
curl -X POST https://api.example.com/api/v1/seeds/sg-mom-001/promote
``` 

### Via GitHub Direct Access

Seed contracts can be accessed directly from GitHub:

 ```typescript
// Using GitHub Storage Service
const github = createStorageService({
  owner: "owner",
  repo: "repo",
  token: "token"
});
const seed = await github.readSeedContract(status, country, domain, content, version);
``` 

## Environment-Specific Storage

Seed contracts are stored in GitHub, which is shared across environments. However, the API can filter by environment-specific metadata if needed.

## Related Documentation

- [Project README](../README.md)
- ](/ko/v1/guides/research/)
- [Environment Guide](../docs/ENVIRONMENT_GUIDE.md)
- [Architecture Guidelines](../.cursorrules)
