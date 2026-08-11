// Reads editable site content from Firestore, falling back to the bundled JSON
// that used to be imported directly. The public page must keep rendering even
// if Firestore is unreachable or a doc has not been seeded yet, so every read
// is best-effort and the fallback is always what ships in the bundle.
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

export const CONTENT_COLLECTION = "content";

// Doc ids in the `content` collection, one per editable dataset.
export const CONTENT_DOCS = {
  links: "links",
  social: "social",
  blog: "blog",
};

// A link card's destination for a given traffic source. The base `link` is the
// default; `linkInstagram` / `linkThread` optionally override it so the same
// card can carry a source-specific UTM short-link. Click attribution on the
// linktree itself comes from the route (/#/instagram vs /#/thread), not from
// the data — the overrides only matter for the destination site's analytics.
export function resolveLink(item, source) {
  if (source === "instagram" && item.linkInstagram) return item.linkInstagram;
  if (source === "thread" && item.linkThread) return item.linkThread;
  return item.link;
}

// Every content doc has the shape { data: <payload>, updatedAt, updatedBy }.
export async function fetchContent(docId, fallback) {
  const snap = await getDoc(doc(db, CONTENT_COLLECTION, docId));
  if (snap.exists() && snap.data().data !== undefined) {
    return snap.data().data;
  }
  return fallback;
}

export async function saveContent(docId, data, user) {
  await setDoc(doc(db, CONTENT_COLLECTION, docId), {
    data,
    updatedAt: Timestamp.now(),
    updatedBy: user?.email || "unknown",
  });
}

export function useContent(docId, fallback) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchContent(docId, fallback)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        // Keep the bundled fallback that is already in state.
        console.warn(`[content] "${docId}" read failed, using bundled JSON`, err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docId]);

  return { data, loading };
}
