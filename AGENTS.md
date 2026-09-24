# Personal homepage maintenance

This directory is the user's working checkout for the personal academic homepage.

- Remote: `https://github.com/Lthinker/zihanli.github.io.git`
- Branch: `main`, tracking `origin/main`.
- Public homepage: `https://lthinker.github.io/zihanli.github.io/`
- GitHub Pages source: `main`, `/ (root)`. Keep `index.html`, `contents/`, `static/`, and `.nojekyll` at the repository root. Do not put the site inside another upload folder.

The user has requested an ongoing edit-and-publish workflow: when they ask for homepage changes in this project, pull, edit, validate, commit, and push the requested changes, unless they explicitly ask for a draft or local-only work. No extra publication confirmation is needed for these requested homepage edits.

1. Inspect `git status` and the remote before changing anything. Preserve unrelated user edits. When clean, run `git pull --ff-only`; if it fails, inspect divergence rather than forcing a reset or push. Save or reconcile local changes safely before integrating remote changes.
2. Personal information lives in `contents/config.yml`; content is in the Markdown files under `contents/`. Keep `cv.html` in sync when modifying facts it contains. `contents/research.md` is an unused historical draft; current research text is in `contents/home.md`.
3. Keep the reference site's compact OpenReview appearance. Do not guess publication status, authorship, exact dates, or personal information. Keep unpublished work distinguished from published papers and abstracts.
4. For content-only changes, check the relevant rendered content and links. For layout or JavaScript changes, check desktop/mobile layouts and affected interactions. Use a local HTTP server; `file://` does not support the Markdown fetches. Port 8765 has been used for local previews.
5. Review the diff and stage only intended changes. Commit descriptively, then `git push origin main`. Never force-push. Check the deployment and the live site when network access allows; disclose any authentication, build, or verification limitation.
6. `.local/`, `.template-source/`, and `homepage-upload.zip` are local-only artifacts, excluded by `.gitignore`. Do not commit CV source documents, credentials, temporary snapshots, or the local profile form.

The existing `.local/check_site.cjs` is a local browser smoke test, if available. It contains content counts and runtime paths that may need updating as the homepage changes. Do not assume a missing local test script means the project cannot be validated.
