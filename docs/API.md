# WhatsApp AI Assistant — HTTP API

Version: `1.2.3`  
Base URL (local): `http://localhost:8000`  
Content-Type: `application/json`  
App package: `@whatsapp-ai/server` (`apps/server`)

This document describes the HTTP control plane for the assistant. WhatsApp message handling itself runs over Baileys (WebSocket) and is not exposed as REST.

Run the server from the monorepo root:

```bash
pnpm dev:server
```


---

## Overview

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/health` | No | Liveness / uptime probe |
| `GET` | `/status` | Yes | Read whether AI auto-replies are enabled |
| `POST` | `/status` | Yes | Enable or disable AI auto-replies |

---

## Authentication

Protected routes require the `x-api-key` header. The value must match `ARS_API_KEY` from your `.env` file.

```http
x-api-key: your_secret_api_key
```

| Status | Body | When |
| --- | --- | --- |
| `401` | `{ "success": false, "message": "Unauthorized" }` | Missing or invalid `x-api-key` |

---

## Endpoints

### 1. Health check

Confirms the Express server is accepting HTTP requests.

```http
GET /health
```

**Auth:** none

#### Success — `200 OK`

```json
{
  "success": true,
  "message": "OK"
}
```

#### cURL

```bash
curl -s http://localhost:8000/health
```

---

### 2. Get AI status

Returns whether the WhatsApp AI auto-reply pipeline is currently enabled.

```http
GET /status
```

**Auth:** required (`x-api-key`)

#### Success — `200 OK`

```json
{
  "Message": "Welcome",
  "aiEnabled": true
}
```

| Field | Type | Description |
| --- | --- | --- |
| `Message` | `string` | Static welcome label |
| `aiEnabled` | `boolean \| undefined` | `true` / `false` if a settings document exists; may be `undefined` on a fresh database until the first `POST /status` |

#### Errors

| Status | Body | Cause |
| --- | --- | --- |
| `401` | Unauthorized payload above | Bad or missing API key |

#### cURL

```bash
curl -s http://localhost:8000/status \
  -H "x-api-key: your_secret_api_key"
```

---

### 3. Update AI status

Turns AI auto-replies on or off. Uses upsert — creates the settings document if it does not exist.

```http
POST /status
```

**Auth:** required (`x-api-key`)

#### Request body

```json
{
  "enabled": true
}
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | Yes | `true` = AI replies to private chats; `false` = messages are stored only (no AI reply) |

#### Success — `200 OK`

```json
{
  "success": true,
  "aiEnabled": true
}
```

#### Errors

| Status | Body | Cause |
| --- | --- | --- |
| `401` | Unauthorized payload above | Bad or missing API key |

#### cURL

Enable AI:

```bash
curl -s -X POST http://localhost:8000/status \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_secret_api_key" \
  -d '{"enabled":true}'
```

Disable AI:

```bash
curl -s -X POST http://localhost:8000/status \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_secret_api_key" \
  -d '{"enabled":false}'
```

---

## Behavior notes

- When `aiEnabled` is `false`, private chat messages (and images) are still saved to MongoDB history, but the bot does not generate replies.
- When no settings document exists yet, the runtime treats AI as **enabled** by default (`settings?.isEnableAi === false` is the only off switch). Prefer an explicit `POST /status` after deploy.
- Group chats (`@g.us`) are ignored by the WhatsApp layer regardless of this flag.
- WhatsApp session login (QR) is console-based; it is not part of this HTTP API.

---

## Postman

Import the collection:

[`WhatsApp-AI-Assistant.postman_collection.json`](./WhatsApp-AI-Assistant.postman_collection.json)

1. Open Postman → **Import** → select the JSON file.
2. Set collection variables:
   - `baseUrl` → e.g. `http://localhost:8000`
   - `apiKey` → your `ARS_API_KEY`
3. Run requests under **Health** and **AI Status**.

---

## Error format (auth)

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

## Changelog (HTTP surface)

| Version | Change |
| --- | --- |
| `1.2.3` | Documented surface: `/health`, `GET/POST /status`. OTP and self-ping routes removed. |
