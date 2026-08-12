const clean = (value) => String(value ?? '').trim();

function normalizeSource(source) {
  const sourceUrl = clean(source?.sourceUrl ?? source?.url);
  if (!/^https?:\/\//i.test(sourceUrl)) throw new Error(`First-party source requires an http(s) URL; received '${sourceUrl}'.`);
  return {
    sourceName: clean(source?.sourceName) || 'Official first-party source',
    sourceUrl,
    sourceType: source?.sourceType ?? 'first-party-official',
    purpose: 'first-party',
    firstParty: true,
    ...(clean(source?.evidenceUrl) ? { evidenceUrl: clean(source.evidenceUrl) } : {}),
    ...(clean(source?.evidenceName) ? { evidenceName: clean(source.evidenceName) } : {}),
  };
}

function dedupeSources(sources) {
  const seen = new Set();
  return sources.filter((source) => {
    const key = clean(source?.sourceUrl).replace(/\/$/, '').toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function enrichEntitiesWithFirstPartySources(places = [], things = [], entries = []) {
  if (!Array.isArray(entries)) throw new Error('First-party enrichment shard must export a firstPartySources array.');
  const byId = new Map([...places, ...things].map((entity) => [entity.id, entity]));
  const touched = new Set();

  for (const entry of entries) {
    const entityId = clean(entry?.entityId);
    if (!entityId) throw new Error('First-party enrichment entry requires entityId.');
    const entity = byId.get(entityId);
    if (!entity) throw new Error(`First-party enrichment references unknown entity '${entityId}'.`);
    const normalized = (entry.sources ?? []).map(normalizeSource);
    if (!normalized.length) throw new Error(`First-party enrichment for '${entityId}' has no sources.`);
    entity.firstPartySources = dedupeSources([...(entity.firstPartySources ?? []), ...normalized]);
    touched.add(entityId);
  }

  return { places, things, enrichedEntityIds: [...touched] };
}
