# Bing Webmaster URL Submission Integration

**Goal:** Automatically notify Bing when a post is published or a page is updated.

---

## 1. Behaviour

- **Trigger:** Saving a **post** with status `published` or saving a **page** in the admin.
- **Action:** The app calls the Bing URL Submission API with the canonical URL and logs the result in `bing_submission_logs`.
- **Duplicate prevention:** If the same URL was successfully submitted in the last 24 hours, the submission is skipped (no extra API call).
- **Non-blocking:** Submission runs in the background; admin save response is not delayed by the API call.

---

## 2. API details

- **Endpoint:** `POST https://ssl.bing.com/webmasters/api.svc/json/SubmitUrlbatch?apikey={API_KEY}`
- **Body:** `{ "siteUrl": "https://vistaneotech.com", "urlList": ["https://vistaneotech.com/your-slug"] }`
- **Auth:** API key via query parameter (set in env).

---

## 3. Environment variable

Add to `.env` / `.env.local` (and to Vercel/hosting env):

```env
BING_WEBMASTER_API_KEY=your_bing_webmaster_api_key
```

- Obtain the key from [Bing Webmaster Tools](https://www.bing.com/webmasters) → Settings → API Access.
- If `BING_WEBMASTER_API_KEY` is not set, submission is skipped and no error is shown to the user (logged as error in lib).

---

## 4. Database

Table: `bing_submission_logs` (see migration `20250221100000_add_bing_submission_logs.sql`).

| Column | Purpose |
|--------|--------|
| `url` | Submitted URL |
| `status` | `pending` / `success` / `error` |
| `submitted_at` | Timestamp of submission |
| `api_response` | Raw API response (JSONB) |
| `error_message` | Error message if failed |
| `source` | `admin` (or future sources) |

Used for auditing and for 24h duplicate prevention (successful submissions).

---

## 5. Code locations

| Area | File |
|------|------|
| Bing API + logging + duplicate check | `lib/bing-submit.ts` |
| Trigger on post save (when published) | `app/api/admin/blog/[id]/route.ts` |
| Trigger on page save | `app/api/admin/pages/[id]/route.ts` |
| Migration | `supabase/migrations/20250221100000_add_bing_submission_logs.sql` |

---

## 6. Response handling

- **Success:** HTTP 200 from Bing; row in `bing_submission_logs` with `status: 'success'`.
- **Error:** Message and optional API body stored in `error_message` and `api_response`; row with `status: 'error'`.
- **Skipped (duplicate):** No Bing request; returns `status: 'skipped'`; no new log row for that submission.

---

## 7. Don’ts

- Do not over-submit: duplicate window (24h) and “publish only” for posts avoid flooding the API.
- Google Search Console is not modified by this integration.
