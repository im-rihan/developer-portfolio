# developer-portfolio

Private portfolio kit for **Rihan Mohammed** — resume, GitHub profile README, and document generators.

## Contents

| File | Description |
|------|-------------|
| `resume.html` | Modern two-column resume (browser preview) |
| `resume.pdf` | PDF export |
| `resume.docx` | Microsoft Word export |
| `github-profile-README.md` | GitHub profile README — copy to `im-rihan/im-rihan` repo |
| `generate_resume.py` | Regenerate PDF + Word from Python |

## Regenerate documents

```powershell
pip install python-docx playwright
python -m playwright install chromium
python generate_resume.py
```

## GitHub profile README

Copy `github-profile-README.md` → your profile repo:

```
https://github.com/im-rihan/im-rihan
```

Rename it to `README.md` in that repository.

## Edit personal info

Update the `PERSONAL`, `EDUCATION`, and `CERTIFICATIONS` sections in `generate_resume.py`, then edit matching sections in `resume.html`.
