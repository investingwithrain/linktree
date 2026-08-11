// Click-time UTM tagging for the link cards, plus figuring out which
// platform a visitor arrived from in the first place.
//
// Two ways a visit carries a source:
//  1. A dedicated route — /#/instagram, /#/thread. Bio links on those two
//     platforms point here; the app already knows the source for free.
//  2. A ?utm_source= query param on the real URL, e.g.
//     https://links.investingwithrain.com/?utm_source=youtube#/
//     This is the standard way to tag a single reusable link handed out on a
//     platform we don't get a dedicated route for — YouTube description,
//     email signature, X/Twitter bio. It works because HashRouter only ever
//     looks at the part after "#"; the query string in front of it is
//     invisible to routing and survives untouched. It also means GA4 picks
//     it up automatically for its own Traffic acquisition report — gtag.js
//     parses standard utm_ params off the real page URL on load, no extra
//     code required for that part.
//
// Route source takes priority when both are present, since the two hardcoded
// routes are the most reliable signal we have.
const ROUTE_SOURCES = { instagram: "instagram", thread: "threads" };
const DEFAULT_UTM_SOURCE = "direct";

export function resolveSource(routeSource) {
  if (routeSource && ROUTE_SOURCES[routeSource]) return ROUTE_SOURCES[routeSource];
  const querySource = new URLSearchParams(window.location.search).get("utm_source");
  return querySource || DEFAULT_UTM_SOURCE;
}

const UTM_MEDIUM = "linktree";
const UTM_CAMPAIGN = "organic";

// Only tag destinations whose analytics we own. Affiliate links (Seeking
// Alpha, IBKR) get their attribution from their own ref codes, and foreign
// query params could even break them. links.investingwithrain.com is
// deliberately absent: /#/ga4 short-links pass through untouched.
const UTM_HOSTS = ["www.investingwithrain.com", "investingwithrain.com"];

// `source` here is already resolved (see resolveSource above) — this only
// decides whether and how to stamp it onto an outbound link.
export function appendUtm(link, source) {
  let url;
  try {
    url = new URL(link);
  } catch {
    return link;
  }
  if (!UTM_HOSTS.includes(url.hostname)) return link;
  // A hand-crafted campaign URL wins over the defaults.
  for (const key of url.searchParams.keys()) {
    if (key.startsWith("utm_")) return link;
  }
  url.searchParams.set("utm_source", source || DEFAULT_UTM_SOURCE);
  url.searchParams.set("utm_medium", UTM_MEDIUM);
  url.searchParams.set("utm_campaign", UTM_CAMPAIGN);
  return url.toString();
}
