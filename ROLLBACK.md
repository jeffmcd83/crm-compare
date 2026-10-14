# ROLLBACK — Cardiac Rhythm Management (CRM) guide

Current known-good live state is tagged **`stable`** (also `stable-2026-10-14`). List tags: `git tag -l`.

```bash
cd /workspace/crm-compare-site
git checkout stable -- index.html data favicon.svg sw.js manifest.webmanifest   # or any vX.Y tag
sed -i "s/const P='crm-root-',C=P+'/const P='crm-root-',C=P+'rb-/" sw.js           # new cache name so phones refresh
git add -A && git commit -qm "Rollback to stable" && git push -q
```
Without the box: on GitHub, open the repo → Tags → `stable` → browse files; or `git revert` the bad commit from any clone. Older per-version one-liners: `/workspace/crm-specs/app/ROLLBACK.md`.

Verify: open https://jeffmcd83.github.io/crm-compare/ (refresh once), check the version/pass label in the header.

---

## Earlier version-by-version notes

# Rollback v1.4 → v1.3 (current)

One-liner (run in /workspace/crm-compare-site):

```bash
git checkout 45d87ef -- index.html data favicon.svg sw.js && sed -i "s/const P='crm-root-',C=P+'/const P='crm-root-',C=P+'rb-/" sw.js && git add -A index.html data favicon.svg sw.js && git commit -qm "Rollback to v1.3 (45d87ef)" && git push -q
```

- `v1.3` = 45d87ef. The cache gets a new name (`crm-root-rb-…`), so browsers refresh.
- Re-promote: `git checkout v1.4 -- index.html data favicon.svg sw.js && git commit -qm "Re-promote v1.4" && git push -q`

---

# Rollback v1.3 → v1.2.1

One-liner (run in /workspace/crm-compare-site). Restores the live v1.2.1 build at commit 1c3406b, which includes its cache bump; the `v1.2.1` tag itself points at 5913e70:

```bash
git checkout 1c3406b -- index.html data favicon.svg sw.js && sed -i "s/const P='crm-root-',C=P+'/const P='crm-root-',C=P+'rb-/" sw.js && git add -A index.html data favicon.svg sw.js && git commit -qm "Rollback to v1.2.1 (1c3406b)" && git push -q
```

- Re-promote: `git checkout v1.3 -- index.html data favicon.svg sw.js && git commit -qm "Re-promote v1.3" && git push -q`

---

# Rollback v1.2.1 → v1.2

One-liner (run in /workspace/crm-compare-site):

```bash
git checkout v1.2 -- index.html data favicon.svg sw.js && sed -i "s/const P='crm-root-',C=P+'/const P='crm-root-',C=P+'rb-/" sw.js && git add -A index.html data favicon.svg sw.js && git commit -qm "Rollback to v1.2" && git push -q
```

- The cache gets a new name (`crm-root-rb-…`), so browsers replace their worker and delete the old cache.
- Re-promote: `git checkout v1.2.1 -- index.html data favicon.svg sw.js && git commit -qm "Re-promote v1.2.1" && git push -q`

---

# Rollback v1.2 → v1.1.1

One-liner (run in /workspace/crm-compare-site):

```bash
git checkout v1.1.1 -- index.html data favicon.svg sw.js && git rm -q --cached data/nomen.json 2>/dev/null; rm -f data/nomen.json; sed -i "s/const P='crm-root-',C=P+'/const P='crm-root-',C=P+'rb-/" sw.js && git add -A index.html data favicon.svg sw.js && git commit -qm "Rollback to v1.1.1" && git push -q
```

- Restores v1.1.1's `index.html`, `data/`, `favicon.svg` and `sw.js` and removes `data/nomen.json`.
- The `sed` gives the cache a new name (`crm-root-rb-…`), so browsers holding v1.2 replace their worker and delete the old `crm-root-*` cache. The worker is network-first anyway.
- `/preview/` is left alone.
- Re-promote afterwards: `git checkout v1.2 -- index.html data favicon.svg sw.js && git commit -qm "Re-promote v1.2" && git push -q`

---

# Rollback (live site → v1.0-stable), from any v1.x

One-liner (run in /workspace/crm-compare-site):

```bash
git checkout v1.0-stable -- index.html && git rm -rq --cached data favicon.svg sw.js && rm -rf data favicon.svg sw.js && printf "self.addEventListener('install',()=>self.skipWaiting());self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('crm-root-')).map(x=>caches.delete(x)))).then(()=>self.registration.unregister())));\n" > sw.js && git add index.html sw.js && git commit -qm "Rollback to v1.0-stable" && git push -q
```

- Restores the v1.0 single-file `index.html` (tag `v1.0-stable` = 93d6da6) and removes v1.1's `data/` and `favicon.svg`.
- Replaces `sw.js` with a self-destroying worker: browsers that visited v1.1 fetch it, delete the `crm-root-*` caches and unregister. v1.1's worker is network-first anyway, so v1.0 would show up online even without this.
- `/preview/` is left alone.
- To go back to v1.1 afterwards: `git checkout v1.1 -- index.html data favicon.svg sw.js && git commit -qm "Re-promote v1.1" && git push -q`
- Rebuild from source instead: `python3 /workspace/crm-specs/app/build_app.py --out root` (v1.1) or `--out preview` (staging).
