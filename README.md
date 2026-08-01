# devalkotak.github.io

Personal site for Deval Kotak. The site is a static-exported Next.js app
with a Python content pipeline for GitHub projects, Notion writeups, and
resources. It is a real multi-page site, not a single scrolling page:

| Route | Source |
| --- | --- |
| `/` | Static (home / hero, teasers link out to the pages below) |
| `/projects` | GitHub, every public repo except this site and the profile README |
| `/blog` (+ `/blog/[slug]`) | Notion, writeups database |
| `/resources` | Notion, resources database |
| `/optiverse` | Notion, single standalone page (see below) |
| `/resume` | Static PDF embed, `public/resume.pdf` |
| `/security` | Static |

`/writeups`, `/writeups/[slug]`, and `/articles/[slug]` still exist as
redirects into `/blog` for link compatibility. Do not delete them without
checking for inbound links first.

## Technical Decisions

Next.js uses `output: "export"` so the site can be deployed as static files on
GitHub Pages. The deployed site has no backend. Anything that needs network
access runs before the build in `scripts/build_content.py`.

Python owns the content layer. It fetches GitHub repositories, queries Notion,
infers useful database properties, normalizes API responses, and writes stable
JSON files under `content/generated/`. The TypeScript app reads those files and
renders them. This keeps the frontend small while preserving the automatic
portfolio and writeup goals.

GitHub projects are fetched from `https://api.github.com/users/devalkotak/repos`
and filtered to exclude forks, archived repos, and the two repos listed in
`HIDDEN_REPOS` (this site's own source and the profile README). `GITHUB_TOKEN` is
optional and only raises the rate limit.

Notion is used for Blog / Writeups because writing and editing long-form notes is
better there than in JSX. The UI never consumes raw Notion API responses.
`scripts/build_content.py` converts Notion pages and blocks into plain JSON
before Next.js sees them.

The visual components consume normalized data from `lib/` instead of direct API
responses. This makes the design easy to change without rewriting GitHub fetches
or Notion parsing.

Resources exists because reference links are useful when they stay practical.
External resources are generated into JSON and can later come from a separate
Notion database.

Optiverse is a student mentorship project co-founded before this site, kept
on its own page instead of folded into Projects because it isn't code. It
syncs from a **standalone Notion page**, deliberately separate from the
original OptiverseHQ org workspace (that one stays untouched; this page is
a redesigned copy meant for the site only). Its content, tone, and layout
live entirely in Notion; the site just renders whatever blocks are there
through the same `NotionRenderer` used for writeups.

Writeups and resources use browser-side search, filters, and sort controls over the
generated JSON. This keeps navigation practical as the content count grows while
preserving static hosting.

The visual style is dark, mono-heavy, and dense because the site should feel more
like a working terminal than a generic portfolio template. Framer Motion is used
only for quiet page and card motion, not for distracting animation.

Secrets are read from environment variables only. `.env.local.example` documents
the shape, and real credentials should be configured locally or as GitHub Actions
secrets.

For local files, `.env` is loaded first and `.env.local` can override values
from `.env`. Existing shell or CI environment variables are not overwritten by
either file.

GitHub Actions builds on push, twice a day on a cron (02:17 and 14:17 UTC,
so 07:47 and 19:47 IST), and on demand via `workflow_dispatch`. Run
`npm run refresh` to trigger a rebuild without pushing anything, and
`npm run refresh:status` to see how recent runs went. Each build runs the Python content generator first,
so public repos and published Notion writeups refresh even if the frontend
source code does not change.

## Local Development

```bash
npm install
npm run content
npm run dev
```

`npm run dev` also runs the content generator through `predev`. Open
`http://localhost:3000`.

## Content Refresh

Run this whenever GitHub topics, Notion writeups, or Notion resources change:

```bash
npm run content
npm run content:inspect
```

That command rewrites:

- `content/generated/projects.json`
- `content/generated/writeups.json`
- `content/generated/writeups/<slug>.json`
- `content/generated/resources.json`
- `content/generated/optiverse.json`

Production builds call the same pipeline automatically:

```bash
npm run build
```

Use `npm run content:check` when you want the generated content inspection to
fail on source errors or malformed generated rows.

### Refresh and push from anywhere

`scripts/build_content.py` resolves its paths off its own file location, not
the current working directory, so it can be run from anywhere as long as an
`.env` with the right keys sits next to the repo root:

```bash
python /path/to/devalkotak.github.io/scripts/build_content.py --push
```

`--push` commits and pushes `content/generated/` if (and only if) it
changed. It stages nothing else, so it's safe to run against a working tree
that has unrelated local changes. No-ops with a message if content didn't
change. Options: `--remote` (default `origin`), `--branch` (default: current
branch), `--message` (default: `content: refresh from github/notion`).

## Environment

```env
NOTION_API_KEY=your_notion_integration_token
NOTION_DATA_SOURCE_ID=your_notion_data_source_id
NOTION_DATABASE_ID=optional_legacy_database_id
NOTION_RESOURCES_DATA_SOURCE_ID=optional_resources_data_source_id
NOTION_RESOURCES_DATABASE_ID=optional_legacy_resources_database_id
NOTION_OPTIVERSE_PAGE_ID=optional_optiverse_page_id
NOTION_REFRESH_WRITEUP_DETAILS=false
GITHUB_TOKEN=optional_for_higher_rate_limits
```

`NOTION_DATA_SOURCE_ID` is preferred for the current Notion API. The script also
tries `NOTION_DATABASE_ID` for older database-style setups. Resources can use
their own `NOTION_RESOURCES_DATA_SOURCE_ID` or
`NOTION_RESOURCES_DATABASE_ID`. The legacy `NOTION_TOOLS_*` names still work as
fallback. Without Notion writeup credentials, the Writeups page renders an empty
state. Without a resources database, the Resources page renders an empty state.
Without a GitHub token, the Projects page still works under the public API rate
limit. `NOTION_OPTIVERSE_PAGE_ID` is a single Notion page ID (not a
database). The page must be shared with the same integration behind
`NOTION_API_KEY` ("Connections" menu in Notion) or the fetch 404s and the
Optiverse page renders an empty state.

Existing writeup detail pages reuse cached generated block JSON by default so a
slow Notion block tree does not wipe or stall local builds. Set
`NOTION_REFRESH_WRITEUP_DETAILS=true` when you intentionally want to refresh the
full rendered body for existing writeups.

## Notion Database

The generator adapts to an existing Notion database. It does not require exact
property names. It detects common names and property types:

- Title: first title property, or names like `Title`, `Name`, `Post`
- Slug: names like `Slug`, `Path`, `URL`; generated from title if missing
- Date: names like `Date`, `Published Date`, `Posted`; falls back to page creation date
- Category: select/status/rich text properties named `Category`, `Type`, `Topic`, `Area`
- Tags: multi-select/select/rich text properties named `Tags`, `Topics`, `Labels`
- Published: checkbox/select/status/rich text properties named `Published`, `Public`, `Live`, `Status`, `State`

If a publish/status property exists, only values like `Published`, `Public`,
`Live`, `Done`, `Complete`, `Posted`, `Released`, or `Ready` are included.
Draft/private/backlog-style values are skipped. If no publish property exists,
all pages with a title are included unless `NOTION_REQUIRE_PUBLISHED=true`.

If automatic detection picks the wrong field, set one of these optional
overrides in `.env.local` or GitHub Actions secrets:

```env
NOTION_TITLE_PROPERTY=Name
NOTION_SLUG_PROPERTY=Slug
NOTION_DATE_PROPERTY=Date
NOTION_CATEGORY_PROPERTY=Category
NOTION_TAGS_PROPERTY=Tags
NOTION_PUBLISHED_PROPERTY=Status
NOTION_REQUIRE_PUBLISHED=false
NOTION_REFRESH_WRITEUP_DETAILS=false
```

`app/writeups/[slug]/page.tsx` uses `generateStaticParams()`, so published
writeups become static pages during the build.

## Resources Database

The resources pipeline is separate from writeups but uses the same Notion token.
Set `NOTION_RESOURCES_DATA_SOURCE_ID` when the second database is ready. The
generator detects common names and property types:

- Title: first title property, or names like `Title`, `Name`
- Slug/ID: names like `Slug`, `Path`, `URL`; generated from title if missing
- Description: names like `Description`, `Summary`, `Excerpt`, `Notes`
- URL: names like `URL`, `Link`, `Website`, `Resource`
- Kind: select/status/rich text properties named `Kind`, `Type`, `Format`, `Resource`
- Category: select/status/rich text properties named `Category`, `Type`, `Topic`, `Area`
- Tags: multi-select/select/rich text properties named `Tags`, `Topics`, `Labels`
- Published: checkbox/select/status/rich text properties named `Published`, `Public`, `Live`, `Status`, `State`

If automatic detection picks the wrong field, set optional resources overrides:

```env
NOTION_RESOURCES_TITLE_PROPERTY=Name
NOTION_RESOURCES_SLUG_PROPERTY=Slug
NOTION_RESOURCES_DESCRIPTION_PROPERTY=Description
NOTION_RESOURCES_HREF_PROPERTY=URL
NOTION_RESOURCES_KIND_PROPERTY=Type
NOTION_RESOURCES_CATEGORY_PROPERTY=Category
NOTION_RESOURCES_TAGS_PROPERTY=Tags
NOTION_RESOURCES_PUBLISHED_PROPERTY=Status
NOTION_RESOURCES_REQUIRE_PUBLISHED=false
```

## Known Limitations

- Static export means content freshness depends on rebuilds.
- When Notion credentials are missing, the generator creates one unlinked
  placeholder writeup route because Next.js export requires at least one
  generated param for dynamic routes.
- The Notion renderer supports common blocks only: paragraphs, headings,
  heading toggles, plain toggles, lists, tables, code, quote, divider, and image.
