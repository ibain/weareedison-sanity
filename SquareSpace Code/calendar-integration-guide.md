# Calendar Subscribe – Quick Guide

This is a short, editor‑friendly guide for the global Subscribe lightbox.

## What it does
- Intercepts shared `.ics` links and opens a themed lightbox.
- Offers three options: Google Calendar (Add by URL), Apple/Outlook (webcal), and Download.
- Uses Edison theme colors and Squarespace typography.

## How editors add a Subscribe button
1. Create a normal Squarespace Button.
2. EITHER set the URL to the shared `.ics` feed (recommended).
3. OR add a custom attribute `data-calendar-subscribe` to the button (for custom feeds),
   and optionally `data-ics="https://.../calendar.ics"`.

That’s it—the global script handles the rest.

## Defaults
- Default ICS feed is set inside `global-header-injection.html`.
- Webcal fallback is automatic.

## Troubleshooting (super quick)
- Lightbox doesn’t open: confirm `global-header-injection.html` is in Site Header Code Injection.
- Google step blocked: check pop‑up blockers; try again or open in a new tab.
- Wrong feed: if you used `data-ics`, verify the URL is correct and public.

## Where to change behavior
- Edit `SquareSpace Code/global-header-injection.html`.

Last updated: August 2025
