# Admin page

Edit the Linktree content at `/#/admin` — link cards, social icons and blog
entries — without a rebuild or redeploy.

## How it works

Content lives in a Firestore collection called `content`, one doc per dataset:

| Doc              | Edits           | Bundled fallback    |
| ---------------- | --------------- | ------------------- |
| `content/links`  | Link cards      | `src/DataLinks.json` |
| `content/social` | Social icon row | `src/Social.json`    |
| `content/blog`   | Blog entries    | `src/blog.json`      |

There is one shared list of link cards for every route.

## How tracking works

Cards store the **real destination URL** — no more generating a `/#/ga4`
short-link per card per source. Attribution happens automatically, based on
where the visitor came from (`src/tracking.js`, `resolveSource`):

1. **A dedicated route** — `/#/instagram` and `/#/thread` are the two bio
   links, and the app already knows the source from the route.
2. **A `?utm_source=` on the real URL** — for every other platform, one
   reusable link with a query param handed out once. This is the standard
   way to tag a link and works because HashRouter only ever looks at the part
   after `#`; the query string in front of it is untouched and both our own
   code and GA4 itself can read it. The three ready-made links:

   | Platform    | Link to paste (once) |
   | ----------- | --------------------- |
   | YouTube     | `https://links.investingwithrain.com/?utm_source=youtube&utm_medium=description&utm_campaign=organic#/` |
   | Email       | `https://links.investingwithrain.com/?utm_source=email&utm_medium=signature&utm_campaign=organic#/` |
   | X / Twitter | `https://links.investingwithrain.com/?utm_source=twitter&utm_medium=bio&utm_campaign=organic#/` |

   Route source always wins if somehow both are present. No query param and
   no route (e.g. someone typing the bare URL) resolves to `direct`.

   Adding another platform later needs no code change — pick a source name
   and hand out `?utm_source=<name>#/`.

Once resolved, the source flows two places:

- **Linktree side** — every card click sends a GA event tagged with the
  resolved source.
- **Destination side** — for `investingwithrain.com` destinations,
  `utm_source=<resolved>`, `utm_medium=linktree` and `utm_campaign=organic`
  are appended to the destination URL at click time. Affiliate links and other
  domains are left untouched — their own ref codes do the attribution. A URL
  that already carries `utm_` parameters is also left untouched, so a
  hand-crafted campaign link wins over the defaults.

Google Search needs no link at all — GA4 detects the referrer automatically
and reports it as Organic Search in Traffic acquisition. Anyone reposting your
link elsewhere is untaggable by definition, since you never touch that link.

The `/#/link-generator` + `/#/ga4` short-link system is still the right tool
when a link needs to stay editable *after* posting — e.g. you want to redirect
an already-published video's link to a different page later without editing
the video. Each short-link doc in `Links` also keeps a `clickCount` and
`lastClickedAt`, updated on every redirect, so click totals don't depend on
the GA event surviving the redirect race.

Each doc is `{ data, updatedAt, updatedBy }`.

The public page reads Firestore first and falls back to the bundled JSON if the
doc is missing or the read fails — so the site keeps rendering even if Firestore
is down, and it works unchanged before anything has ever been saved. The first
save in the admin seeds Firestore from the JSON you already ship.

The JSON files stay in the repo as that fallback. They are no longer the live
source of truth once a doc has been saved.

## One-time setup

1. **Enable Google sign-in.** Firebase console → Authentication → Sign-in method
   → enable **Google**.

2. **Authorise the domains.** Authentication → Settings → Authorized domains.
   Add `localhost` and `links.investingwithrain.com`.

3. **Set the admin allowlist** in `.env`:

   ```
   VITE_ADMIN_EMAILS=you@gmail.com,someone-else@gmail.com
   ```

   Restart the dev server after editing — Vite only reads `.env` at startup.

4. **Publish the Firestore rules.** Copy `firestore.rules` into the Firebase
   console (Firestore Database → Rules), replacing `your-google-account@gmail.com`
   with the same emails as step 3, then Publish.

   Read `firestore.rules` before pasting — publishing replaces the *entire*
   ruleset for the project, so merge in anything you already have.

`VITE_ADMIN_EMAILS` gates the UI only. The Firebase config is public, so the
Firestore rules are the actual security boundary. Both lists must match, or you
will either be locked out of the UI or get a permission error on save.

## Using it

- Local: <http://localhost:5174/#/admin>
- Live: <https://links.investingwithrain.com/#/admin>

Each tab saves independently; a tab with pending edits shows an "unsaved" chip.
**Reload** discards unsaved changes and re-reads from Firestore.

Changes go live on the next page load. No `npm run deploy` needed — deploying is
only required for code changes.
