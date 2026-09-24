# Configuration

Everything personal on the site comes from `contents/config.yml`. This page
documents every field. Nothing here is mandatory — omit a field and the site
falls back to a sensible default or hides the element.

---

## `site`

Browser tab, `<meta>` tags, and the footer copyright.

```yaml
site:
  title: "Alex Rivera — Academic Homepage"
  description: "Alex Rivera — PhD student in Computer Science at Eastwood University."
  author: "Alex Rivera"
  copyright: "&copy; Alex Rivera 2024-2026. All rights reserved."
```

| Field | Purpose |
|---|---|
| `title` | Browser tab title. Falls back to `profile.name`. |
| `description` | `<meta name="description">`. This is the text search engines show under your link — write it for a human. |
| `author` | `<meta name="author">`. Falls back to `profile.name`. |
| `copyright` | Footer text. HTML entities such as `&copy;` are allowed. |

---

## `profile`

The header block at the top of the page.

```yaml
profile:
  name: "Alex Rivera"
  name_secondary: "亚历克斯"
  tagline: "PhD student, Department of Computer Science, Eastwood University."
  photo: "static/assets/img/photo.svg"
  name_aliases:
    - "Alex Rivera"
    - "A. Rivera"
```

| Field | Purpose |
|---|---|
| `name` | Your name. Appears in the masthead and the page heading. |
| `name_secondary` | An optional second name shown beside the first — your name in another script, or a nickname. Leave empty or delete the line to hide it. |
| `tagline` | The one-line position statement under your name. Inline HTML is allowed. |
| `photo` | Path to your portrait, relative to the repository root. Remove the field entirely to drop the photo and let the biography use the full width. |
| `name_aliases` | **The field to get right.** See below. |

### `name_aliases`

List every spelling of your own name that appears in the author lists in
`contents/publications.md`. Two things depend on it:

1. Matching names are **bolded** in author lists.
2. A publication counts as **first-authored** when one of these aliases opens the
   author list, or is immediately followed by `#` (co-first authorship).

```yaml
name_aliases:
  - "Alex Rivera"      # full form
  - "A. Rivera"        # abbreviated form used in most citations
```

Notes:

- Order does not matter; longer aliases are tried first, so `"Alex Rivera"` wins
  over a shorter overlapping alias.
- Whitespace inside an alias matches any run of spaces — `"A. Rivera"` also
  matches `A.  Rivera`.
- Regex characters are escaped, so a name like `"A. Rivera (Jr.)"` is safe.
- Matching is case-sensitive: add `"RIVERA"` separately if you use it.
- If the list is empty or missing, no name is bolded and the first-author counter
  reads zero. The rest of the site is unaffected.

---

## `links`

The buttons under your biography, in the order listed.

```yaml
links:
  - label: "Curriculum Vitae"
    url: "https://example.com/cv.pdf"
    icon: cv
  - label: "Email"
    url: "mailto:alex.rivera@example.edu"
    icon: mail
```

Available `icon` values:

`cv` · `scholar` · `github` · `mail` · `orcid` · `linkedin` · `x` · `wechat` · `link`

An unrecognised name falls back to a generic link glyph. `http(s)` URLs open in a
new tab; `mailto:` and relative paths stay in the same tab.

To add an icon of your own, add an SVG path to `LINK_ICONS` near the top of the
hero-links section in `static/js/scripts.js`.

---

## `nav`

The navigation bar. Each `id` must match a `<section id="...">` in `index.html`.

```yaml
nav:
  - { id: news, label: "News" }
  - { id: publications, label: "Publications" }
```

Removing an entry hides the link but leaves the section on the page. To remove a
section entirely, delete its `<section>` block from `index.html` too. An entry
pointing at a section that doesn't exist is skipped, so a half-finished deletion
never leaves a dead link.

---

## `stats`

The counters under the biography. The labels are yours; the numbers are always
counted from your Markdown, so they cannot go stale.

```yaml
stats:
  enabled: true
  items:
    - { source: publications, label: "publications", plus: true }
    - { source: first_author, label: "first-author", plus: true }
    - { source: awards,       label: "honors",       plus: true }
    - { source: talks,        label: "invited talks", plus: false }
```

| `source` | Counts |
|---|---|
| `publications` | Visible publication entries (hidden groups excluded) |
| `first_author` | Entries matching `name_aliases` as first or co-first author |
| `awards` | Items in `awards.md` |
| `talks` | Items in `talks.md` |

`plus: true` appends a `+` to the number. Set `enabled: false` to remove the
strip; drop or reorder `items` freely.

---

## `publications`

```yaml
publications:
  filters: true
  note: "<strong>#</strong> denotes equal contribution; <strong>*</strong> denotes corresponding author."
```

| Field | Purpose |
|---|---|
| `filters` | Show the All / Journal / Conference / Abstracts / First-author chips. `false` hides them. |
| `note` | Small print under the heading. HTML allowed; `""` hides it. |

---

## `footer_links`

```yaml
footer_links:
  - { label: "Scholar", url: "https://scholar.google.com/citations?user=EXAMPLE" }
  - { label: "Email",   url: "mailto:alex.rivera@example.edu" }
```

Plain text links in the footer, no icons.

---

## `visitors`

An optional visitor map, **off by default**.

```yaml
visitors:
  enabled: false
  script_src: ""
```

To enable it, register with a visitor-map provider, paste the script URL they
give you into `script_src`, and set `enabled: true`. The section stays hidden
until both are set.

> **Do not copy someone else's `script_src`.** These URLs contain a key tied to
> one account — using another person's would record your visitors on their
> dashboard, and theirs on yours.
