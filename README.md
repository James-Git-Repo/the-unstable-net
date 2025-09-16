# The (un)Stable Net — full-stack website

Production-ready Next.js (TypeScript) project with **Viewer** and **Editor** modes, wired to **Supabase** for persistence.

- **Viewer** (default) – public, read-only, fast.
- **Editor** – gated authoring UI. Save/publish writes to Supabase; Viewer sees changes instantly.

Keyboard shortcuts:
- Enter Editor: **Ctrl+Shift+E** (opens passcode gate)
- Exit to Viewer: **Ctrl+Shift+L**

A small indicator shows the current mode in the bottom-right corner.

---

## Tech

- Next.js 14 (App Router) + React 18 + TypeScript
- TailwindCSS for styling
- Supabase (Postgres + Storage) for data/persistence
- Server-only service role used **only inside API routes** (never exposed to the browser)
- Sanitization with `sanitize-html`

## Getting started

1. **Clone & install**

```bash
pnpm i    # or npm i / yarn
```

2. **Create `.env` from `.env.example`**

```
NEXT_PUBLIC_SUPABASE_URL=...       # Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=...  # anon key
SUPABASE_SERVICE_ROLE_KEY=...      # service role (server only)
EDITOR_PASSCODE_BCRYPT=...         # bcrypt hash of your passcode
```

Generate the bcrypt passcode hash:

```bash
npm run hash-passcode
# Enter your passcode when prompted; paste the resulting hash into .env
```

3. **Create database schema**

- Open Supabase SQL editor and run: `supabase/schema.sql` (also creates storage buckets).
- (Optional) Run `supabase/seed.sql` to insert example content.

4. **Run local dev**

```bash
npm run dev
# open http://localhost:3000
```

5. **Deployment**

- Deploy to Vercel or your infra.
- Add the same env vars.
- Ensure the following **storage buckets** exist and are **public**: `covers`, `uploads`, `policies`.

## Editor gate (security)

- Press **Ctrl+Shift+E** → passcode modal appears.
- Passcode is verified server-side (`/api/editor/login`) against `EDITOR_PASSCODE_BCRYPT` (bcrypt compare).
- On success a secure, HttpOnly cookie `tsn_editor=1` is set for 8 hours.
- Editor-only routes/components check this cookie server-side; Viewer never sees credentials.

> You should rotate the passcode regularly and treat the service key as a secret. API routes are the only place where it is used.

## Pages & routes

- `/` — **Home** (project grid; “Coming soon” card)
- `/newsletter` — **Newsletter** index; in Editor shows the article builder
- `/newsletter/[slug]` — Article page with comments (Viewer shows approved only; Editor moderation tools)
- `/projects/[slug]` — Project detail page template
- `/billboard` — The One Million Billboard (placeholder landing as per screenshots)
- `/about` — About with photo/contacts on the left; text uploader on the right (Editor only)
- `/admin/new-project` — New Project Builder (Editor-only guard)
- `/admin/policies` — Upload/replace Terms & Privacy PDFs (Editor-only)

## Header variants

- **Home:** Projects · Newsletter · About
- **Newsletter:** Home · Contribute (opens modal form → Supabase `contributions`)
- **About:** Home · Ask me a question (modal → Supabase `questions`)
- **Billboard:** Home only

## Footer

- Always shows © + links to the latest **Privacy** and **Terms** PDFs (from `policies` table).
- Home page uses the layout with contact icons and About text (as in the screenshots).
- A dark variant is used on `/billboard` to match the design.

## Data model (SQL)

See `supabase/schema.sql`. Core tables:

- `projects` — cards on Home
- `articles` — newsletter posts
- `comments` — per-article comments, default `is_approved=false`
- `contributions` — newsletter contributions form
- `questions` — “Ask me a question” form
- `policies` — stores PDF `type` and `file_url`
- `about` — stores HTML body (latest row is rendered)

Also includes updated_at triggers and 3 public storage buckets: `covers`, `uploads`, `policies`.

## Seeding

- Run the SQL in `supabase/seed.sql` or `npm run seed` (Node script) after setting env vars.
- The seed adds one project (“European Market Movers”), one project (“Million Slots Billboard”), the “coming soon” note, and one sample published article plus a blank About body.

## Replacing visuals & links

- **Logo:** `components/Logo.tsx` – replace the `TSN` badge with your SVG.
- **Home hero text:** edit `app/page.tsx`.
- **Social links:** the footer uses placeholders – replace icons/anchors with your real links.
- **Billboard page:** replace content in `app/billboard/page.tsx` or add a CMS row later.

## Accessibility & performance

- Semantic HTML, headings, form labels.
- High-contrast defaults using Tailwind.
- Keyboard navigable (links/buttons get focus rings).
- Minimal JS on most pages; static rendering where possible.

## Testing the mode toggle

- Load the site → Viewer mode (indicator bottom-right)
- Press **Ctrl+Shift+E** → enter your passcode → Editor indicator turns green, Editor UI appears.
- Create an article/project → save/publish → open in Viewer; changes are visible immediately.
- Press **Ctrl+Shift+L** to return to Viewer (cookie cleared).

---

MIT © 2025 The (un)Stable Net
