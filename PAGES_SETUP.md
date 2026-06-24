# Fix GitHub Pages 404

Your site files are deployed correctly. GitHub Pages is **not turned on** in repository settings yet.

## Enable Pages (2 minutes)

1. Open: **https://github.com/im-rihan/developer-portfolio/settings/pages**

2. Under **Build and deployment**:
   - **Source:** `Deploy from a branch`
   - **Branch:** `gh-pages`
   - **Folder:** `/ (root)`

3. Click **Save**

4. Wait **2–5 minutes**. Refresh:
   **https://im-rihan.github.io/developer-portfolio/**

---

## Verify before enabling

| Check | Status |
|-------|--------|
| Repo is public | Yes |
| `gh-pages` branch exists | Yes |
| `index.html` on `gh-pages` | Yes |
| Pages enabled in Settings | **No — you must do step above** |

---

## Alternative: deploy from `main` (no workflow needed)

If you prefer not to use the `gh-pages` branch:

1. **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: **`main`** → **`/ (root)`**
4. Save

`index.html` is already on `main`, so the site works immediately.

---

## Correct URL

Project site (this repo):

```
https://im-rihan.github.io/developer-portfolio/
```

NOT `https://im-rihan.github.io/` — that URL only works with a repo named **`im-rihan.github.io`**.

---

## Still 404 after 10 minutes?

1. **Settings → Actions → General** → Workflow permissions → **Read and write**
2. Re-run workflow: **Actions → Deploy Portfolio to GitHub Pages → Run workflow**
3. Check **Settings → Pages** shows: *Your site is live at...*
