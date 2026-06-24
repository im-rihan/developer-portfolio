# developer-portfolio

Personal portfolio website, resume, and GitHub profile README for **Rihan Mohammed**.

**Live site:** [im-rihan.github.io/developer-portfolio](https://im-rihan.github.io/developer-portfolio)

## What's included

| File / Folder | Description |
|---------------|-------------|
| `index.html` | Portfolio website (GitHub Pages) |
| `assets/` | CSS & JavaScript |
| `resume.html` | Printable resume |
| `resume.pdf` / `resume.docx` | Downloadable resume |
| `github-profile-README.md` | GitHub profile README |
| `generate_resume.py` | Regenerate PDF + Word |

## GitHub Pages deployment

This repo uses **GitHub Actions** to deploy automatically on every push to `main`.

### One-time setup

1. Go to **Settings → Pages** in your GitHub repo
2. Under **Build and deployment → Source**, select **GitHub Actions**
3. Push to `main` — the workflow deploys automatically

Your site will be live at:

```
https://im-rihan.github.io/developer-portfolio/
```

### Custom URL (optional)

For `https://im-rihan.github.io` (no `/developer-portfolio` path):

1. Create a **public** repo named `im-rihan.github.io`
2. Copy `index.html`, `assets/`, and resume files into it
3. Enable GitHub Pages from the `main` branch

> **Note:** Free GitHub Pages requires a **public** repo. Private repos need GitHub Pro for Pages.

## Local preview

Open `index.html` in your browser, or use a local server:

```powershell
cd "d:\HomeAbroad Main\code\developer-portfolio"
python -m http.server 8080
```

Then visit `http://localhost:8080`

## Regenerate resume

```powershell
pip install python-docx playwright
python -m playwright install chromium
python generate_resume.py
```

## Edit portfolio content

- **Website:** edit `index.html`
- **Styles:** edit `assets/css/style.css`
- **Resume data:** edit `generate_resume.py` and `resume.html`
