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

There is one shared list of link cards for every route. Click attribution on
the linktree side comes from the route the visitor used (`/#/instagram` vs
`/#/thread`) — the GA event and pageview already carry it — so the cards do
not need to be duplicated per source.

A card can still carry a different UTM short-link per source for the
*destination* site's analytics: the optional **Instagram link** / **Threads
link** fields override the destination link on that route only. Leave them
empty for the ~normal case where one URL serves every source.

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
