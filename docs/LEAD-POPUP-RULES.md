# Lead popup – when it appears and how to test

## When the popup appears

The popup shows **once per browser session** when **any** of these happens first:

| Trigger | Rule |
|--------|------|
| **Time on page** | After **18 seconds** on the page. |
| **Scroll** | When the user has scrolled **40%** down the page. |
| **Exit intent** | When the mouse moves into the **top 80px** of the window (e.g. toward the address bar or tab). |

After the user closes it or submits the form, it will **not** show again until they open a new session (new tab or new browser session). This is stored in `sessionStorage` under the key `vista_lead_popup_seen`.

## How to test the popup

- **Force show (any page):** Add `?vista_popup=1` to the URL, e.g.  
  `http://localhost:3000/?vista_popup=1`  
  The popup will open shortly after the page loads and will show again on reload while the query param is present.
- **Normal behaviour:** Clear the query param, do a hard refresh, then either wait 18 seconds, scroll 40% down, or move the cursor to the top of the window.

## Design (handshake / lead-focused)

- **Header:** “Let’s connect” with a short line like “Quick response · No commitment”.
- **Headline:** “Start a conversation”.
- **CTA:** “Yes, let’s talk” (primary) and “Maybe later” (secondary).
- **z-index:** `z-[100]` so it appears above header and sticky CTA.

## Changing the rules

Edit `components/lead/LeadCapturePopup.tsx`:

- `TRIGGERS.DELAY_SEC` – seconds before time-on-page trigger (default `18`).
- `TRIGGERS.SCROLL_THRESHOLD` – scroll depth 0–1 (default `0.4` = 40%).
- `TRIGGERS.EXIT_INTENT_TOP_PX` – top edge height in pixels for exit intent (default `80`).
