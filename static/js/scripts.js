/* ==========================================================================
   Academic homepage — OpenReview skin
   https://github.com/Arktis2022/academic-homepage-openreview

   Zero-build, markdown-driven: contents/config.yml supplies every piece of
   personal information, contents/*.md supplies the content. Both are fetched
   at page load, rendered with marked.js, progressively enhanced here, and
   finally typeset by MathJax.

   You should not need to edit this file to use the template. Every transform
   below is defensive: if it fails, the raw markdown is left on the page.
   ========================================================================== */

const CONTENT_DIR = 'contents/';
const SECTIONS = ['home', 'news', 'publications', 'education', 'awards', 'service', 'patents'];

/* Populated from config.yml before any content renders. */
let CONFIG = {};

window.addEventListener('DOMContentLoaded', () => {
    marked.use({ mangle: false, headerIds: false });

    // The config must land before the sections render: the publication renderer
    // needs profile.name_aliases to know which author is you.
    fetch(CONTENT_DIR + 'config.yml')
        .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
        .then(txt => { CONFIG = jsyaml.load(txt) || {}; })
        .catch(e => console.log('config.yml could not be loaded:', e))
        .then(() => {
            safe(applyConfig);
            safe(initChrome);
            loadSections();
        });
});

function loadSections() {
    const jobs = SECTIONS.map(name =>
        fetch(CONTENT_DIR + name + '.md')
            .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
            .then(md => {
                const el = document.getElementById(name + '-md');
                // Publications use a custom delimited format whose * and #
                // author markers marked.js would mangle — keep the raw text
                // and render it ourselves in buildPublications().
                if (name === 'publications') {
                    window.__pubsRaw = md;
                    if (el) el.innerHTML = '';
                } else if (el) {
                    el.innerHTML = marked.parse(md);
                }
            })
            .then(() => safe(() => enhance(name)))
            .catch(e => {
                console.log(name, e);
                const el = document.getElementById(name + '-md');
                if (el) el.innerHTML = '<p>Content could not be loaded. Please refresh the page or <a href="cv.html">read the CV</a>.</p>';
            })
    );

    Promise.allSettled(jobs).then(() => {
        // External links open in a new tab (buttons we built ourselves already do).
        document.querySelectorAll('.main-body a[href^="http"]').forEach(a => {
            a.setAttribute('target', '_blank');
            a.setAttribute('rel', 'noopener noreferrer');
        });
        safe(buildStats);
        safe(initReveal);
        if (window.MathJax && MathJax.typeset) { try { MathJax.typeset(); } catch (e) { } }
    });
}

/* ---------------- Config → DOM ----------------
   Everything personal on the page is written here, from contents/config.yml.
   ------------------------------------------------------------------------- */
function applyConfig() {
    const site = CONFIG.site || {};
    const profile = CONFIG.profile || {};

    setText('title', site.title || profile.name || 'Academic Homepage');
    setAttr('meta-description', 'content', site.description || '');
    setAttr('meta-author', 'content', site.author || profile.name || '');
    setHTML('copyright-text', site.copyright || '');

    setText('brand-name', profile.name || '');
    setText('hero-name', profile.name || '');
    setText('hero-name-secondary', profile.name_secondary || '');
    setHTML('hero-tagline', profile.tagline || '');

    const photo = document.getElementById('hero-photo');
    if (photo) {
        if (profile.photo) {
            photo.src = profile.photo;
            photo.alt = profile.name || '';
        } else {
            const fig = photo.closest('.portrait');
            if (fig) fig.remove();
        }
    }

    setHTML('publications-note', (CONFIG.publications || {}).note || '');

    buildNav();
    buildFooterLinks();
    buildVisitorMap();
}

function setText(id, v) { const el = document.getElementById(id); if (el) el.textContent = v; }
function setHTML(id, v) { const el = document.getElementById(id); if (el) el.innerHTML = v; }
function setAttr(id, a, v) { const el = document.getElementById(id); if (el) el.setAttribute(a, v); }

function buildNav() {
    const box = document.getElementById('topnav');
    if (!box) return;
    const items = CONFIG.nav || [];
    box.innerHTML = items
        // Skip entries whose section is not on the page, so a half-deleted
        // section never leaves a dead link in the navbar.
        .filter(it => it && it.id && document.getElementById(it.id))
        .map(it => `<a class="topnav-link" href="#${esc(it.id)}">${esc(it.label || it.id)}</a>`)
        .join('');
}

function buildFooterLinks() {
    const box = document.getElementById('footer-links');
    if (!box) return;
    box.innerHTML = (CONFIG.footer_links || [])
        .filter(l => l && l.url)
        .map(l => {
            const ext = /^https?:/i.test(l.url) ? ' target="_blank" rel="noopener"' : '';
            return `<a href="${esc(l.url)}"${ext}>${esc(l.label || l.url)}</a>`;
        }).join('');
}

/* Visitor maps embed a script URL containing a key tied to one account, so the
   section stays off until the site owner supplies their own. */
function buildVisitorMap() {
    const cfg = CONFIG.visitors || {};
    const sec = document.getElementById('visitor');
    const box = document.getElementById('visitor-wrap');
    if (!sec || !box) return;
    if (!cfg.enabled || !cfg.script_src) return;   // section stays hidden
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = cfg.script_src;
    box.appendChild(s);
    sec.hidden = false;
}

function safe(fn) { try { fn(); } catch (e) { console.log('enhance:', e); } }

function enhance(name) {
    switch (name) {
        case 'home': buildHeroLinks(); break;
        case 'publications': buildPublications(); break;
        case 'news': buildFeed('news-md', 'para', Infinity); break;
        case 'activities': buildFeed('activities-md', 'list', Infinity); break;
        case 'awards': buildAwards(); break;
        case 'talks': buildTalks(); break;
        case 'funding': buildPlain('funding-md'); break;
        case 'service': buildService(); break;
        case 'books': buildBooks(); break;
        case 'collaborators': /* CSS grid handles it */ break;
    }
}

/* ---------------- Chrome: topbar, nav, back-to-top ---------------- */
function initChrome() {
    const bar = document.getElementById('topbar');
    const onScroll = () => { if (bar) bar.classList.toggle('scrolled', scrollY > 6); };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // mobile nav
    const menu = document.getElementById('menu-btn');
    const nav = document.getElementById('topnav');
    if (menu && nav) {
        menu.addEventListener('click', () => {
            menu.setAttribute('aria-expanded', String(nav.classList.toggle('open')));
        });
        nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            nav.classList.remove('open');
            menu.setAttribute('aria-expanded', 'false');
        }));
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && nav.classList.contains('open')) {
                nav.classList.remove('open');
                menu.setAttribute('aria-expanded', 'false');
                menu.focus();
            }
        });
    }

    // scroll-spy
    const links = Array.from(document.querySelectorAll('.topnav-link'));
    const secs = links.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
    if ('IntersectionObserver' in window && secs.length) {
        const spy = new IntersectionObserver(es => {
            es.forEach(e => {
                if (e.isIntersecting) {
                    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
                }
            });
        }, { rootMargin: '-40% 0px -55% 0px' });
        secs.forEach(s => spy.observe(s));
    }

    // back to top
    const fab = document.getElementById('back-to-top');
    if (fab) {
        addEventListener('scroll', () => fab.classList.toggle('show', scrollY > 600), { passive: true });
        fab.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
    }
}

/* ---------------- Hero links ----------------
   Built from the `links:` list in config.yml. Each entry names an icon;
   unrecognised names fall back to a generic link glyph.
   ------------------------------------------------------------------------- */
const LINK_ICONS = {
    scholar: 'M12 3L1 9l11 6 9-4.9V17h2V9L12 3zM5 13.2V17c0 1.7 3.1 3 7 3s7-1.3 7-3v-3.8l-7 3.8-7-3.8z',
    github: 'M12 2a10 10 0 00-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 015 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .3.3.6.9.6 1.8v2.7c0 .3.2.6.7.5A10 10 0 0012 2z',
    cv: 'M6 2h9l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zm8 1.5V8h4.5L14 3.5z',
    mail: 'M2 5h20v14H2V5zm2 2v.5l8 5 8-5V7H4zm16 3.2l-8 5-8-5V17h16v-6.8z',
    orcid: 'M12 2a10 10 0 100 20 10 10 0 000-20zM8.2 6.2a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2zM7.4 9.6H9v7.8H7.4V9.6zm3.3 0h3.1c2.5 0 4 1.6 4 3.9s-1.6 3.9-4.1 3.9h-3V9.6zm1.6 1.4v5h1.4c1.7 0 2.5-1 2.5-2.5s-.8-2.5-2.5-2.5H12.3z',
    linkedin: 'M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.75-1.95 4 0 4.4 2.5 4.4 5.9V21h-4v-5.6c0-1.35-.03-3.1-1.9-3.1-1.9 0-2.2 1.45-2.2 3v5.7h-4V9z',
    x: 'M18.9 2H22l-7.1 8.1L23.2 22h-6.5l-5.1-6.7L5.7 22H2.6l7.6-8.7L1.5 2H8l4.6 6.1L18.9 2zm-1.1 18h1.7L7.3 3.8H5.5L17.8 20z',
    wechat: 'M8.5 4C4.9 4 2 6.5 2 9.6c0 1.8 1 3.4 2.5 4.4L4 16l2.2-1.2c.7.2 1.5.3 2.3.3h.6a5 5 0 01-.2-1.4c0-3 2.9-5.3 6.4-5.3h.6C15.5 5.9 12.3 4 8.5 4z',
    link: 'M3.9 12a3.1 3.1 0 013.1-3.1h4V7H7a5 5 0 100 10h4v-1.9H7A3.1 3.1 0 013.9 12zM8 13h8v-2H8v2zm9-6h-4v1.9h4a3.1 3.1 0 010 6.2h-4V17h4a5 5 0 000-10z'
};
function heroIcon(kind) {
    const d = LINK_ICONS[kind] || LINK_ICONS.link;
    return `<svg class="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${d}"/></svg>`;
}

function buildHeroLinks() {
    const box = document.getElementById('hero-links');
    if (!box) return;
    box.innerHTML = (CONFIG.links || [])
        .filter(l => l && l.url)
        .map(l => {
            // mailto: and relative URLs should stay in the same tab
            const ext = /^https?:/i.test(l.url) ? ' target="_blank" rel="noopener"' : '';
            return `<a href="${esc(l.url)}"${ext}>${heroIcon(l.icon)} ${esc(l.label || l.url)}</a>`;
        }).join('');
}

/* ---------------- Publications ----------------
   Rendered from a custom delimited markdown format (window.__pubsRaw):
     #### SECTION NAME  <!--SHOW|HIDDEN-->
     - TITLE ||| AUTHORS ||| VENUE ||| YEAR ||| HONORS ||| LINKS ||| BIBKEY
   Each field may be empty. LINKS is markdown "[Label](url) ...". BIBKEY refers
   to a <div id="bib_..."> kept (hidden) at the end of the same file, verbatim.
   ------------------------------------------------------------------------- */

function buildPublications() {
    const root = document.getElementById('publications-md');
    const raw = window.__pubsRaw;
    if (!root || !raw) return;

    // 1. Extract the hidden bibtex store, map id → text.
    const bibMap = {};
    const store = raw.match(/<div style="display:none" id="bib-store">([\s\S]*?)<\/div>\s*$/);
    if (store) {
        const re = /<div id="(bib_[^"]+)"[^>]*>([\s\S]*?)<\/div>/g;
        let m;
        while ((m = re.exec(store[1]))) bibMap[m[1]] = m[2].trim();
    }
    const body = store ? raw.slice(0, store.index) : raw;

    // 2. Walk lines into sections + entries.
    const groups = [];
    body.split('\n').forEach(line => {
        const hm = line.match(/^####\s*(.+?)\s*(?:<!--(SHOW|HIDDEN)-->)?\s*$/);
        if (hm) {
            groups.push({ title: hm[1].trim(), hidden: hm[2] === 'HIDDEN', cat: catOf(hm[1]), items: [] });
            return;
        }
        if (line.startsWith('- ') && groups.length) {
            groups[groups.length - 1].items.push(line.slice(2));
        }
    });
    if (!groups.length) return;

    // 3. Render.
    const out = document.createElement('div');
    out.className = 'pubs-inner';
    groups.forEach(g => {
        if (g.hidden || !g.items.length) return;   // skip the hidden "Under Review" store
        const h = document.createElement('div');
        h.className = 'pub-group-title';
        h.textContent = g.title;
        h.dataset.cat = g.cat;
        out.appendChild(h);
        g.rows = g.items.map((entry, i) => {
            const r = pubRow(entry, g.cat, bibMap);
            r.dataset.idx = i;
            out.appendChild(r);
            return r;
        });
    });

    root.innerHTML = '';
    root.appendChild(out);
    if ((CONFIG.publications || {}).filters !== false) {
        buildFilters(groups.filter(g => !g.hidden && g.items.length));
    }
    applyPubView('all');
}

/* Central visibility controller for publications. */
function applyPubView(filter) {
    const rows = Array.from(document.querySelectorAll('.pub-row'));
    const titles = Array.from(document.querySelectorAll('.pub-group-title'));

    rows.forEach(r => {
        const cat = r.dataset.cat;
        let show;
        if (filter === 'all') show = true;
        else if (filter === 'first') show = r.dataset.first === '1';
        else show = cat === filter;
        r.classList.toggle('hidden', !show);
    });

    // hide group titles with no visible rows
    titles.forEach(t => {
        const cat = t.dataset.cat;
        const any = rows.some(r => r.dataset.cat === cat && !r.classList.contains('hidden'));
        t.style.display = any ? '' : 'none';
    });
}

function catOf(text) {
    const t = text.toUpperCase();
    if (t.includes('JOURNAL')) return 'journal';
    if (t.includes('CONFERENCE PAPER') || t.includes('PROCEEDING')) return 'conference';
    if (t.includes('ABSTRACT')) return 'abstract';
    if (t.includes('REVIEW') || t.includes('MANUSCRIPT')) return 'review';
    return 'other';
}

/* escape user text for safe HTML injection */
function esc(s) {
    return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ---------------- Author-name matching ----------------
   Built once from profile.name_aliases in config.yml. Whitespace inside an
   alias matches any run of spaces, so "A. Rivera" also matches "A.  Rivera".
   If no aliases are configured, nothing is highlighted and no publication is
   counted as first-authored.
   ------------------------------------------------------------------------- */
let _meRe = null;
function meRegex() {
    if (_meRe !== null) return _meRe;
    const aliases = ((CONFIG.profile || {}).name_aliases || [])
        .filter(a => typeof a === 'string' && a.trim())
        // Longest first, so "Alex Rivera" wins over a shorter overlapping alias.
        .sort((a, b) => b.length - a.length)
        .map(a => a.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+'));
    _meRe = aliases.length ? new RegExp('(' + aliases.join('|') + ')', 'g') : false;
    return _meRe;
}

/* Render authors: escape, then bold every spelling of the site owner's name. */
function renderAuthors(s) {
    const h = esc(s);
    const re = meRegex();
    if (!re) return h;
    re.lastIndex = 0;
    return h.replace(re, m => `<span class="author-me">${m}</span>`);
}

/* Is this author list led by the site owner, or does their name carry a "#"? */
function isFirstAuthor(authors) {
    const re = meRegex();
    if (!re) return false;
    const src = re.source;
    return new RegExp('^\\s*' + src).test(authors) ||
        new RegExp(src + '\\s*#').test(authors);
}

/* Parse a "[Label](url) [Label](url)" string into button/link HTML. */
function renderLinks(s) {
    const links = [];
    const re = /\[([^\]]+)\]\(([^)]+)\)/g;
    let m;
    while ((m = re.exec(s))) links.push({ label: m[1].trim(), href: m[2].trim() });
    return links;
}

function pubRow(entry, cat, bibMap) {
    const parts = entry.split('|||').map(s => s.trim());
    const [title, authors, venue, year, honors, linksStr, bibKey] = [
        parts[0] || '', parts[1] || '', parts[2] || '', parts[3] || '',
        parts[4] || '', parts[5] || '', parts[6] || ''
    ];

    const row = document.createElement('div');
    row.className = 'pub-row';
    row.dataset.cat = cat;
    row.dataset.year = year;

    // First / co-first authorship drives the "First-author" filter and counter.
    row.dataset.first = isFirstAuthor(authors) ? '1' : '0';

    // meta column (year)
    const meta = document.createElement('div');
    meta.className = 'pub-meta';
    meta.innerHTML = year ? `<span class="pub-year">${esc(year)}</span>` : '&mdash;';

    // body column
    const body = document.createElement('div');
    body.className = 'pub-body';

    // line 1: title
    if (title) {
        const t = document.createElement('div');
        t.className = 'pub-title-line';
        t.innerHTML = esc(title);
        body.appendChild(t);
    }
    // line 2: authors
    if (authors) {
        const a = document.createElement('div');
        a.className = 'pub-authors';
        a.innerHTML = renderAuthors(authors);
        body.appendChild(a);
    }
    // line 3: venue + year only
    const venueLine = document.createElement('div');
    venueLine.className = 'pub-venue-line';
    let vhtml = '';
    if (venue) vhtml += `<span class="pub-venue">${esc(venue)}</span>`;
    if (year) vhtml += `<span class="pub-vyear">, ${esc(year)}</span>`;
    venueLine.innerHTML = vhtml;
    body.appendChild(venueLine);

    // line 4: honors + links + BibTeX (quiet row, OpenReview meta style)
    const links = renderLinks(linksStr);
    if (honors || links.length || bibKey) {
        const extra = document.createElement('div');
        extra.className = 'pub-extra';
        if (honors) extra.innerHTML += `<span class="pill-honor">${esc(honors)}</span>`;
        const lc = document.createElement('span');
        lc.className = 'pub-links';
        links.forEach(l => {
            lc.innerHTML += `<a class="lnk" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)}</a>`;
        });
        if (bibKey && bibMap[bibKey]) {
            const id = 'bibx_' + Math.abs(hashStr(bibKey)).toString(36);
            lc.innerHTML += `<button class="lnk lnk-bib" data-target="${id}">BibTeX</button>`;
            extra.appendChild(lc);
            body.appendChild(extra);
            const box = document.createElement('pre');
            box.className = 'bib-box';
            box.id = id;
            box.hidden = true;
            box.textContent = bibMap[bibKey];
            body.appendChild(box);
        } else {
            extra.appendChild(lc);
            body.appendChild(extra);
        }
    }

    row.appendChild(meta);
    row.appendChild(body);

    // wire bibtex toggle
    row.querySelectorAll('.lnk-bib').forEach(btn => {
        btn.addEventListener('click', () => {
            const box = document.getElementById(btn.dataset.target);
            if (box) { box.hidden = !box.hidden; btn.classList.toggle('is-open', !box.hidden); }
        });
    });

    return row;
}

function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; } return h; }

function buildFilters(groups) {
    const box = document.getElementById('pub-filters');
    if (!box) return;
    const cats = [
        { key: 'all', label: 'All' },
        { key: 'journal', label: 'Journal' },
        { key: 'conference', label: 'Conference' },
        { key: 'abstract', label: 'Abstracts' },
        { key: 'review', label: 'Manuscripts' }
    ];
    const rows = () => Array.from(document.querySelectorAll('.pub-row'));
    const titles = () => Array.from(document.querySelectorAll('.pub-group-title'));
    box.innerHTML = cats.map(c => {
        const n = c.key === 'all' ? rows().length : rows().filter(r => r.dataset.cat === c.key).length;
        if (n === 0 && c.key !== 'all') return '';
        return `<button class="filter-chip${c.key === 'all' ? ' active' : ''}" aria-pressed="${c.key === 'all'}" data-f="${c.key}">${c.label}<span class="cnt">${n}</span></button>`;
    }).join('') +
        `<button class="filter-chip" aria-pressed="false" data-f="first">First / co-first author<span class="cnt">${rows().filter(r => r.dataset.first === '1').length}</span></button>`;

    box.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            box.querySelectorAll('.filter-chip').forEach(c => {
                c.classList.toggle('active', c === chip);
                c.setAttribute('aria-pressed', String(c === chip));
            });
            applyPubView(chip.dataset.f);
        });
    });
}

/* ---------------- Feed (news / activities) ---------------- */
function buildFeed(id, mode, initial) {
    const root = document.getElementById(id);
    if (!root) return;
    const scope = root.querySelector('div') || root;
    const items = [];

    if (mode === 'para') {
        scope.querySelectorAll(':scope > p').forEach(p => {
            const strong = p.querySelector('strong');
            if (!strong || !/\d{4}\.\d{2}/.test(strong.textContent)) return;
            const date = strong.textContent.replace(/:\s*$/, '').trim();
            strong.remove();
            items.push(feedItem(date, p.innerHTML.replace(/^\s*[:：]?\s*/, ''), p.textContent));
        });
    } else {
        scope.querySelectorAll(':scope > ul > li, :scope > li').forEach(li => {
            const em = li.querySelector('em');
            const date = em ? em.textContent.trim() : '';
            if (em) em.remove();
            items.push(feedItem(date, li.innerHTML.replace(/^\s*,?\s*/, ''), li.textContent));
        });
    }
    if (!items.length) return;

    const box = document.createElement('div');
    box.className = 'feed-inner';
    items.forEach((it, i) => { if (i >= initial) it.classList.add('feed-hidden'), it.style.display = 'none'; box.appendChild(it); });

    root.innerHTML = '';
    root.appendChild(box);

    if (items.length > initial) {
        const more = document.createElement('div');
        more.className = 'feed-more';
        const btn = document.createElement('button');
        const rest = items.length - initial;
        btn.textContent = `Show ${rest} more`;
        let expanded = false;
        btn.addEventListener('click', () => {
            expanded = !expanded;
            box.querySelectorAll('.feed-hidden').forEach(el => el.style.display = expanded ? '' : 'none');
            btn.textContent = expanded ? 'Show less' : `Show ${rest} more`;
        });
        more.appendChild(btn);
        root.appendChild(more);
    }
}

function feedItem(date, html, raw) {
    const el = document.createElement('div');
    el.className = 'feed-item';
    if (/★|🎉|🎈|🏆|Award|Winner|Prize|accepted|Accept/i.test(raw)) el.classList.add('starred');
    el.innerHTML = `<div class="feed-date">${date}</div><div class="feed-body">${html}</div>`;
    return el;
}


/* Pull the first link whose text matches `re` out of a list item and return its
   href, removing it from the item. Every link is searched, not just the first,
   so also linking the title doesn't stop the button from being found. */
function extractLink(li, re) {
    const a = Array.from(li.querySelectorAll('a')).find(x => re.test(x.textContent));
    if (!a) return '';
    const href = a.href;
    a.remove();
    return href;
}

/* ---------------- Awards ---------------- */
function buildAwards() {
    const root = document.getElementById('awards-md');
    if (!root) return;
    const lis = root.querySelectorAll('li');
    if (!lis.length) return;
    const box = document.createElement('div');
    Array.from(lis).forEach(li => {
        const row = document.createElement('div');
        row.className = 'award-row';

        const cert = extractLink(li, /certificate/i);

        // year (italic *2026* → <em>)
        const em = li.querySelector('em');
        const year = em ? em.textContent.trim() : '';
        if (em) em.remove();

        // clean leading separators
        let html = li.innerHTML.replace(/^[\s,\-–—:]+/, '').replace(/<br\s*\/?>\s*/i, '§SUB§');
        const parts = html.split('§SUB§');
        const title = parts[0].trim();
        const sub = parts[1] ? parts[1].trim() : '';

        row.innerHTML =
            `<div class="award-year">${year}</div>` +
            `<div class="award-title">${title}${sub ? `<span class="award-sub">${sub}</span>` : ''}</div>` +
            (cert ? `<a class="award-cert" href="${cert}" target="_blank" rel="noopener">Certificate</a>` : `<span></span>`);
        box.appendChild(row);
    });
    root.innerHTML = '';
    root.appendChild(box);
}

/* ---------------- Talks ---------------- */
function buildTalks() {
    const root = document.getElementById('talks-md');
    if (!root) return;
    const lis = root.querySelectorAll('li');
    if (!lis.length) return;
    const box = document.createElement('div');
    Array.from(lis).forEach(li => {
        const row = document.createElement('div');
        row.className = 'talk-row';
        const slides = extractLink(li, /slides/i);
        const em = li.querySelector('em');
        const year = em ? em.textContent.trim() : '';
        if (em) em.remove();
        const ttl = li.innerHTML.replace(/^[\s,\-–—:]+/, '').trim();
        row.innerHTML =
            `<div class="yr">${year}</div><div class="ttl">${ttl}</div>` +
            (slides ? `<a class="slides" href="${slides}" target="_blank" rel="noopener">Slides</a>` : `<span></span>`);
        box.appendChild(row);
    });
    root.innerHTML = '';
    root.appendChild(box);
}

/* ---------------- Plain year/title list (funding) ---------------- */
function buildPlain(id) {
    const root = document.getElementById(id);
    if (!root) return;
    const lis = root.querySelectorAll('li');
    if (!lis.length) return;
    const box = document.createElement('div');
    Array.from(lis).forEach(li => {
        const row = document.createElement('div');
        row.className = 'plain-row';
        const em = li.querySelector('em');
        const year = em ? em.textContent.trim() : '';
        if (em) em.remove();
        const ttl = li.innerHTML.replace(/^[\s,\-–—:]+/, '').trim();
        row.innerHTML = `<div class="yr">${year}</div><div class="ttl">${ttl}</div><span></span>`;
        box.appendChild(row);
    });
    root.innerHTML = '';
    root.appendChild(box);
}

/* ---------------- Service (bold heading + list → cards) ---------------- */
function buildService() {
    const root = document.getElementById('service-md');
    if (!root) return;
    const cards = [];
    let cur = null;
    Array.from(root.childNodes).forEach(n => {
        if (n.nodeType !== 1) return;
        // Heading paragraphs are <p><strong>…</strong></p>
        const isHead = n.tagName === 'P' && n.children.length === 1 && n.querySelector('strong');
        if (isHead) {
            cur = { title: n.querySelector('strong').textContent.trim(), html: '' };
            cards.push(cur);
        } else if (n.tagName === 'UL' && cur) {
            cur.html += n.outerHTML;
        }
    });
    if (!cards.length) return;
    root.innerHTML = cards.map(c =>
        `<div class="svc-card"><h5>${c.title}</h5>${c.html}</div>`
    ).join('');
}

/* ---------------- Books ---------------- */
function buildBooks() {
    const root = document.getElementById('books-md');
    if (!root) return;
    const lis = root.querySelectorAll('li');
    if (!lis.length) return;
    const box = document.createElement('div');
    Array.from(lis).forEach(li => {
        const row = document.createElement('div');
        row.className = 'book-row';
        const em = li.querySelector('em');
        const span = em ? em.textContent.trim() : '';
        if (em) em.remove();
        // A link whose text is exactly "Book" is the cover image, not the title.
        const ext = extractLink(li, /^\s*book\s*$/i);
        const bk = li.innerHTML.replace(/^[\s,\-–—:]+/, '').trim();
        row.innerHTML =
            `<div class="span">${span}</div><div class="bk">${bk}</div>` +
            (ext ? `<a href="${ext}" target="_blank" rel="noopener">cover</a>` : `<span></span>`);
        box.appendChild(row);
    });
    root.innerHTML = '';
    root.appendChild(box);
}

/* ---------------- Stats ----------------
   The counters are described in config.yml but their values are always counted
   from the rendered markdown, so they cannot drift away from the content.
   ------------------------------------------------------------------------- */
function buildStats() {
    const cfg = CONFIG.stats || {};
    const box = document.getElementById('metrics');
    if (!box) return;
    if (cfg.enabled === false || !(cfg.items || []).length) { box.remove(); return; }

    // "review" rows are the hidden under-review group; they don't count as publications.
    const rows = Array.from(document.querySelectorAll('.pub-row'))
        .filter(r => r.dataset.cat !== 'review');
    const counts = {
        journal: rows.filter(r => r.dataset.cat === 'journal').length,
        conference: rows.filter(r => r.dataset.cat === 'conference').length,
        abstract: rows.filter(r => r.dataset.cat === 'abstract').length,
        publications: rows.length,
        first_author: rows.filter(r => r.dataset.first === '1').length,
        awards: document.querySelectorAll('#awards-md .award-row').length,
        talks: document.querySelectorAll('#talks-md .talk-row').length
    };

    const items = cfg.items.filter(it => it && counts[it.source] !== undefined);
    box.innerHTML = items.map((it, i) =>
        `<div class="metric">` +
        `<span class="metric-num" id="stat-${i}">0</span>` +
        `<span class="metric-cap">${esc(it.label || it.source)}</span>` +
        `</div>`
    ).join('');

    items.forEach((it, i) => animateNum('stat-' + i, counts[it.source], it.plus !== false));
}

function animateNum(id, target, plus) {
    const el = document.getElementById(id);
    if (!el) return;
    const suffix = plus && target > 0 ? '<span class="plus">+</span>' : '';
    // Keep the reference site's quiet, static presentation and accurate counts.
    el.innerHTML = target + suffix;
}

/* ---------------- Reveal ---------------- */
function initReveal() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((es, o) => es.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); }
    }), { threshold: .06, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.section, .metrics').forEach(el => { el.classList.add('reveal'); io.observe(el); });
}
