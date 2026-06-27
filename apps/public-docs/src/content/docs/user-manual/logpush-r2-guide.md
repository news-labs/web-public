---
title: Logpush R2 Guide
description: Guide to setting up Logpush and managing R2 secrets
sidebar:
  order: 3
translatedFromHash: 42b9de66bea8b33ba87b7fc9c1b78e557ac6ef3874652a6b6338676522eb14d4
---

Without code, just a summary of **the process for creating an R2 secret in Cloudflare** and **where to place it**.  
> **Single production setup**: Only two buckets used: `logpush-r2` , secrets `LOGPUSH_R2_ACCESS_KEY` / `LOGPUSH_R2_SECRET_KEY`.

---

## 1. Creating an R2 secret for Logpush in Cloudflare

### 1.1 Access path

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) Login
2. Select **R2** (Object Storage) from the left menu
3. Click **Manage R2 API Tokens** (or the **API Tokens** tab)  
   - Path example: **R2** → **Manage R2 API Tokens** at top/right

### 1.2 Token Creation Procedure

1. Click **Create API token** (or **Create token**)
2. **Token name**: e.g., `logpush-r2` (for single production use)
3. **Permissions**:
   - Select **Object Read & Write**  
     - Since Logpush only needs to **write** log files to R2, it's best to scope it to **only that log bucket** with minimal permissions  
   - When using **Apply to specific buckets only**: Specify **`logpush-r2`** specify
4. Execute **Create API Token**
5. Verify **two values displayed only once on screen**:
   - **Access Key ID** (e.g., 32-character hex) → Add to GitHub Secret **`LOGPUSH_R2_ACCESS_KEY`**
   - **Secret Access Key** (e.g., long string) → Add to GitHub Secret **`LOGPUSH_R2_SECRET_KEY`**  
   → **Can only be copied at this point**, so save securely before adding to GitHub Secrets

### 1.3 Note

- The R2 API token is created at the **Account level** (not per Zone).
- Logpush Jobs from the same account use this token when writing to R2 by placing it in ``destination_conf``.
- Refer to the [Cloudflare R2 – Authentication](https://developers.cloudflare.com/r2/api/tokens/) documentation.

---

## 2. Where to store secrets (GitHub)

### 2.1 Mandatory location: GitHub Actions Secrets

- **Location**: Repository → **Settings** → **Secrets and variables** → **Actions**
- **Path example**:  
  `https://github.com/<org>/newsfork-seeds/settings/secrets/actions` 
- Add **only these two** as **Repository secrets** here:

| Secret Name | Value | Notes |
|-------------|-----|------|
| `LOGPUSH_R2_ACCESS_KEY` | **Access Key ID** copied from Cloudflare | Logpush production only |
| `LOGPUSH_R2_SECRET_KEY` | **Secret Access Key** copied from Cloudflare | Logpush production only |

- **R2 Bucket**: You must pre-create only one **`logpush-r2`** in Cloudflare.
- Logpush Provision/Verify is executed **only during production deployment** (Policy B).

### 2.2 (Optional) Environment secrets

- You can also place `LOGPUSH_R2_ACCESS_KEY` and `LOGPUSH_R2_SECRET_KEY` as **Environment secrets** under **Settings** → **Environments** → `production`.
- Use the same names as above.

---

## 3. Locations where secrets must not be placed

- **wrangler.jsonc** (or wrangler configuration file): Do not include R2 credentials.
- **Source code** (e.g., `.ts`, `.sh`): Absolutely prohibited.
- **Version-controlled .env** (e.g., committing `.env`): Prohibited. Even for local use, secrets must be stored in `.env` and `.gitignore`.
- **Plain text in workflow YAML**: Prohibited.

---

## 4. Names used in this project (Uniform)

- **Bucket**: `logpush-r2` (Single)
- **Secret**: `LOGPUSH_R2_ACCESS_KEY` , `LOGPUSH_R2_SECRET_KEY` (Only 2)
- **Job Name**: `newsfork-seeds-workers` (Single, no environment suffix)

**Location Summary**: These values **must only be stored in GitHub repository (or production Environment) Actions Secrets**. For Cloudflare, create an Access Key ID / Secret Access Key via "Generate R2 API Token", then place those values respectively in `LOGPUSH_R2_ACCESS_KEY` and `LOGPUSH_R2_SECRET_KEY`.
