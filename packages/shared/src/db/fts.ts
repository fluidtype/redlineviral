export function buildKitsFTSQuery(q: string) {
  // very simple sanitization for TS-level usage (server-side only)
  const term = q.trim().replace(/[':]/g, " ");
  // to_tsvector computed via trigger; just provide plainto_tsquery here
  return { tsQuery: term };
}
