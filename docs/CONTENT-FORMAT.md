# Content format

Each file in `contents/` maps to one section of the page. Ordinary Markdown works
everywhere, but most sections also recognise a small convention — an italic date,
a bold title, a `<br />` — that lifts parts of a line into their own column.

Every file ships with a comment at the top restating its format, so you can work
without this page open. Nothing here is enforced: if a line doesn't match, it is
rendered as plain Markdown rather than dropped.

**Contents:** [publications](#publicationsmd) · [news](#newsmd) ·
[awards](#awardsmd) · [talks](#talksmd) · [funding](#fundingmd) ·
[service](#servicemd) · [activities](#activitiesmd) · [books](#booksmd) ·
[collaborators](#collaboratorsmd) · [home](#homemd) · [math](#mathematics)

---

## `publications.md`

The most structured file, and the only one not rendered as ordinary Markdown.

### Groups

```markdown
#### JOURNAL ARTICLES  <!--SHOW-->
#### MANUSCRIPTS UNDER REVIEW  <!--HIDDEN-->
```

A `<!--HIDDEN-->` group is parsed but never displayed, and is excluded from every
counter — useful for keeping work in the file before you're ready to announce it.
Flip it to `<!--SHOW-->` to publish.

The group name also decides which filter chip the group belongs to:

| Group name contains | Filter |
|---|---|
| `JOURNAL` | Journal |
| `CONFERENCE PAPER` or `PROCEEDING` | Conference |
| `ABSTRACT` | Abstracts |
| `REVIEW` or `MANUSCRIPT` | none — excluded from all counts |
| anything else | none |

Matching is case-insensitive. A group whose name matches nothing still displays;
it just doesn't get a chip.

### Entries

One publication per line, seven fields separated by `|||`:

```
- TITLE ||| AUTHORS ||| VENUE ||| YEAR ||| HONORS ||| LINKS ||| BIBKEY
```

| # | Field | Notes |
|---|---|---|
| 1 | `TITLE` | Plain text. |
| 2 | `AUTHORS` | Plain text. Your own name is bolded via `profile.name_aliases`. Use `#` for co-first, `*` for corresponding. |
| 3 | `VENUE` | Journal or conference name. |
| 4 | `YEAR` | Shown in the left column and after the venue. |
| 5 | `HONORS` | Short phrase — `Spotlight`, `Best Paper`, `Oral`. Empty for most entries. |
| 6 | `LINKS` | Markdown links: `[Paper](url) [Code](url)`. Any labels you like. |
| 7 | `BIBKEY` | Id of a BibTeX entry in the store at the bottom of the file. |

**Every field may be empty, but all six separators must be present.** A line with
five `|||` silently loses its last field.

```markdown
- Calibrated Surrogate Models ||| A. Rivera, P. Nakamura, and D. Whitfield* ||| Journal of ML Applications ||| 2026 ||| Editor's Pick ||| [Paper](https://example.com/p1) [Code](https://github.com/x/y) ||| bib_jmla2026
- A Survey of Data-Efficient Learning ||| A. Rivera and D. Whitfield* ||| Computing Surveys ||| 2025 ||| ||| [Paper](https://example.com/p3) |||
```

The second line has no honors and no BibTeX — the empty fields are still there.

### First-author detection

An entry counts as first-authored when one of your `name_aliases`:

- opens the author list — `A. Rivera, P. Nakamura, ...`, or
- is followed by `#` anywhere in it — `S. Aydin#, A. Rivera#, ...`

This drives both the First-author filter chip and the `first_author` counter.

### BibTeX store

At the **end** of the file, in one hidden `<div>`:

```html
<div style="display:none" id="bib-store"><div id="bib_jmla2026">@article{rivera2026calibrated,
  title   = {Calibrated Surrogate Models for Small-Sample Scientific Prediction},
  author  = {Rivera, Alex and Whitfield, Dana},
  journal = {Journal of Machine Learning Applications},
  year    = {2026}
}</div><div id="bib_icml2026">@inproceedings{rivera2026sample,
  ...
}</div></div>
```

Rules that matter:

- The wrapper must be exactly `<div style="display:none" id="bib-store">` and must
  be the **last** thing in the file.
- Each id must start with `bib_` and match a `BIBKEY` in field 7.
- Put the opening `<div id="bib_x">` on the same line as the `@article{` — a
  newline between them becomes leading whitespace in the displayed entry.
- Don't leave blank lines between the entry `<div>`s.

An entry whose `BIBKEY` has no matching id simply renders no BibTeX button.

---

## `news.md`

Paragraphs — **not** a list. Each item opens with a bold date:

```markdown
**2026.06.02:** Presented a poster at [SLS 2026](https://example.com). [Photo](https://example.com/p)

**2026.05.14:** Our paper was accepted to NeurIPS 2026.
```

The date is lifted into its own column; the rest is the body and takes any inline
Markdown. The date must contain a `YYYY.MM` pattern or the paragraph is skipped.

Items appear in the order written — newest first. Items mentioning an award,
prize, winner, or acceptance are highlighted automatically.

---

## `awards.md`

```markdown
- [[Certificate]](url) *2026* **Award title**<br />*Optional second line*
- *2026* **An award with no certificate link**
```

The `[Certificate]` link and the italic year become their own columns; both are
optional. Text after `<br />` becomes a smaller sub-line — the awarding body, a
qualifier, a note on selectivity.

The certificate is found by its link text containing `certificate`
(case-insensitive), wherever it sits on the line. Other links — a linked award
name, for instance — stay inline where you wrote them.

---

## `talks.md`

```markdown
- *2026* Symposium on Learning for Science, Lisbon [Slides](url)
- *2025* A talk with no slides
```

Year and `[Slides]` link become their own columns; both optional. The slides link
is found by its text containing `slides` (case-insensitive), wherever it sits on
the line — linking the event name too is fine.

Event names are plain text rather than bold: with every row bold the emphasis
says nothing, and the year, title and Slides link already differ by size and
colour. `**Bold**` still renders (in `--or-slate`, weight 700) if you want to
stress one particular row.

---

## `funding.md`

```markdown
- *2026* Eastwood Graduate Research Fellowship
```

Year plus title. The simplest format in the template. Same plain-text default and
same optional `**bold**` as `talks.md`.

---

## `service.md`

Each **bold paragraph** opens a card; the list under it fills that card.

```markdown
**Journal Reviewer**
- Journal of Machine Learning Applications
- Transactions on Scientific Computing

**Teaching**
- Teaching Assistant, *Introduction to Machine Learning* (2026)
```

Add as many cards as you like; they flow into a responsive grid. A bold paragraph
with no list under it produces an empty card, so keep them paired.

---

## `activities.md`

A **list**, unlike `news.md`:

```markdown
- *2026.06*, Attended the Symposium on Learning for Science, Lisbon.
- *2025.09 – 2025.12*, Research intern at Meridian Labs.
```

The leading italic date becomes its own column. Any date text works — a month, a
range, a single day.

---

## `books.md`

An optional reading log.

```markdown
- *2026.05.02 – 2026.06.01*, [**Title**](https://example.com) by Author. [Book](cover-url)
- *2026.03.10 – 2026.04.28*, [**Another Title**](https://example.com) by Author.
```

The date range becomes its own column. A link whose text is exactly `Book`
becomes the small "cover" link on the right; the title link stays inline.

To remove the section: delete this file *and* the `<section id="books">` block in
`index.html`, and drop `books` from `nav` in `config.yml`.

---

## `collaborators.md`

Rendered as a grid of cards.

```markdown
- [**Dana Whitfield**](https://example.edu/whitfield)<br />Department of Computer Science, Eastwood University
- **Someone Without A Homepage**<br />Institute of Fine Arts
```

Name on the first line, affiliation after `<br />`. The link is optional.

---

## `home.md`

Ordinary Markdown, no conventions. Two or three short paragraphs work best; the
text wraps around your portrait.

Do **not** put your social links here — they come from `links` in `config.yml`.

---

## Mathematics

MathJax runs on the whole page after rendering, so LaTeX works in any file:

- Inline: `$E = mc^2$` or `\(E = mc^2\)`
- Display: `$$...$$` or `\[...\]`
- `\ref{}`, `\eqref{}`, and `\begin{equation}...\end{equation}` are supported.

Inside `publications.md`, avoid `|||` in math — it is the field separator.

---

## Troubleshooting

| Symptom | Cause |
|---|---|
| Publication renders as one long line of raw text | Wrong number of `\|\|\|` separators — there must be exactly six. |
| Your name isn't bolded | The spelling in the author list isn't in `profile.name_aliases`. |
| First-author count is zero | Same cause: `name_aliases` is empty or doesn't match. |
| BibTeX button missing | `BIBKEY` doesn't match any `<div id="...">` in the store. |
| BibTeX shows odd indentation | A newline between `<div id="bib_x">` and `@article{`. |
| A news item is missing | Its bold date doesn't contain a `YYYY.MM` pattern. |
| Award certificate link appears inline | The link text doesn't contain `certificate`. |
| Nothing loads at all | You opened `index.html` over `file://`. Use a local server. |
