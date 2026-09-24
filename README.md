# Arthur Montandon — portfolio

A responsive, dependency-free portfolio for Arthur Montandon. Content is based on the current résumé packet supplied by the owner. The expense lab is an original illustrative exercise using fictional data, not employer records. It is not presented as a past professional achievement.

## Preview

Open `index.html` directly, or run `python -m http.server 8000` from this folder and open `http://localhost:8000`.

## GitHub Pages

The site has no build step. It supports a root site or a repository path using relative asset URLs.

After the owner confirms public visibility and connects GitHub:

1. Create an appropriate repository without overwriting an existing portfolio.
2. Place these files at the root of its `main` branch.
3. In repository Settings → Pages, select **Deploy from a branch**, **main**, **/(root)**.
4. Wait for the Pages deployment to finish, then check the exact URL returned by GitHub.

A user site is usually `https://USERNAME.github.io/` with a repository named `USERNAME.github.io`. A project site is usually `https://USERNAME.github.io/REPOSITORY/`. These are templates, not a live deployment URL.

Standard personal GitHub Pages sites are public even if a paid plan permits a private source repository. Do not assume a private repository makes the website private. No site has been published by preparing this folder.

Official setup: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## Content

- `index.html`: portfolio, contact email, education, experience, finance-lab dialog
- `styles.css`: responsive layout and reduced-motion support
- `app.js`: expense validation, integer-cent calculations, CSV export, modal behavior
- `assets/Arthur_Montandon_Resume.pdf`: one-page résumé adapted from the owner's current résumé

The site does not collect submissions, include analytics, or call third-party services. The contact link opens the visitor's email app. No credentials or employer financial information are included. Contact email is visible in the HTML.
