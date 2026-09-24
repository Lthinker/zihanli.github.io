# Customizing

The design lives entirely in `static/css/main.css`. Most changes are a one-line
edit to a custom property at the top of that file.

---

## Colours

All eleven colours are declared in `:root`:

```css
:root {
    --or-red: #8c1b13;        /* masthead, section headings, stat numbers */
    --or-red-dark: #7d1803;   /* masthead hover */
    --or-teal: #3e6775;       /* links, publication titles */
    --or-teal-dark: #3f6978;  /* link hover */
    --or-slate: #2c3a4a;      /* headings */
    --or-gray: #616161;       /* secondary text */
    --or-gray-2: #757575;     /* tertiary text */
    --or-ground: #fffdfa;     /* page background */
    --or-panel: #f7f6f4;      /* zebra rows, panel fills */
    --or-line: #ddd;          /* borders */
    --or-line-lt: #eee;       /* light borders */
}
```

Change `--or-red` and `--or-teal` and the whole site rebrands. A few examples:

```css
/* Deep blue */
--or-red: #14375e;
--or-teal: #2f6690;

/* Forest */
--or-red: #14432a;
--or-teal: #3f6c51;

/* Monochrome */
--or-red: #1a1a1a;
--or-teal: #444444;
```

Keep the masthead colour dark: its links are pure white and rely on the contrast.

---

## Fonts

```css
--font-sans: "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
--font-mono: "Courier New", Courier, monospace;
```

To use a different face, update the Google Fonts `<link>` in `index.html` and
change the token:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
```

```css
--font-sans: "Inter", system-ui, sans-serif;
```

Base size is `14px`, set on `body` — OpenReview's own size. Raising it to `15px`
or `16px` is the single most effective readability change if the default feels
tight.

---

## Layout

```css
--wrap: 1010px;      /* content width */
--scroll-h: 560px;   /* height of the internally-scrolling panels */
```

`--scroll-h` controls the fixed-height boxes around News, Publications, Awards,
and Activities. Raise it to show more at once, or remove the internal scrolling
entirely:

```css
.scrollbox {
    max-height: none;
    overflow-y: visible;
    border: none;
    padding: 0;
}
.scrollbox-note { display: none; }
```

The layout has one breakpoint, at `700px`, where the navigation collapses into a
menu button and multi-column rows stack.

---

## Removing a section

Three steps, all required — skipping one leaves either a dead nav link or an
empty heading:

1. Delete the `<section id="...">` block from `index.html`.
2. Delete the matching file from `contents/`.
3. Remove the entry from `nav:` in `contents/config.yml`.

The renderer skips missing files and skips nav entries whose section isn't on the
page, so an incomplete deletion degrades quietly rather than breaking — but it
will look untidy.

---

## Adding a section

For a section using one of the built-in layouts, three steps:

1. Add the section to `index.html`, following the existing pattern:

```html
<section class="section section-line" id="patents">
    <div class="wrap">
        <div class="section-head">
            <div class="section-kicker">
                <h2 class="section-h">Patents</h2>
            </div>
        </div>
        <div class="main-body plain-list" id="patents-md"></div>
    </div>
</section>
```

2. Create `contents/patents.md`.
3. Register it in two places:

```js
// static/js/scripts.js
const SECTIONS = [..., 'patents'];

function enhance(name) {
    switch (name) {
        ...
        case 'patents': buildPlain('patents-md'); break;
    }
}
```

Then add it to `nav:` in `config.yml`.

The available layout builders are:

| Builder | Produces | Used by |
|---|---|---|
| `buildPlain(id)` | year + title rows | funding |
| `buildTalks()` | year + title + link rows | talks |
| `buildAwards()` | year + title + sub-line + certificate | awards |
| `buildFeed(id, 'para', Infinity)` | date + body, from paragraphs | news |
| `buildFeed(id, 'list', Infinity)` | date + body, from a list | activities |
| `buildService()` | cards from bold headings | service |
| `buildBooks()` | date range + title + cover link | books |
| *(none)* | plain Markdown, styled by CSS | home, collaborators |

For a section that is just prose, omit the `enhance` case entirely — the Markdown
renders as-is.

---

## Reordering sections

Move the `<section>` blocks in `index.html`. The navigation follows the order of
`nav:` in `config.yml`, which is independent — keep the two in sync yourself.

---

## Disabling the animations

Counters count up and sections fade in on scroll. Both already respect
`prefers-reduced-motion`. To remove them for everyone, delete the `safe(initReveal)`
call in `loadSections()` and replace the body of `animateNum()` with a direct
assignment.

---

## Dark mode

Not included. The OpenReview design this imitates is light-only, and a faithful
dark variant means re-deriving every colour rather than inverting them.

If you want one, the tokens make it tractable — add a `prefers-color-scheme`
block overriding `:root`:

```css
@media (prefers-color-scheme: dark) {
    :root {
        --or-ground: #16181c;
        --or-panel: #1e2126;
        --or-line: #333;
        --or-line-lt: #2a2a2a;
        --or-slate: #e6e6e6;
        --or-gray: #b0b0b0;
        --or-teal: #7fb3c8;
    }
    body { color: #ddd; }
}
```

Check the masthead and the BibTeX boxes afterwards — both set colours that don't
come from tokens.

---

## Local preview

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000>. A `file://` URL will not work: the page loads its
content with `fetch()`, which browsers block on local files.

After a CSS change, hard-reload with <kbd>Cmd/Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd>.
