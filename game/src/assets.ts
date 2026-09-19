// Asset loader — 2× source sprites drawn 1:1 at logical scale.
// Contract: one sprite set under day/night; lighting is a layer, never new art.

export type AssetKey =
  | 'watchfire' | 'boltThrower' | 'frostCondenser' | 'bombard' | 'rootCrawler';

export type Assets = Record<AssetKey, HTMLImageElement>;

export const ASSET_FILES: Record<AssetKey, string> = {
  watchfire: 'assets/watchfire-2x.png',
  boltThrower: 'assets/bolt-thrower-2x.png',
  frostCondenser: 'assets/frost-condenser-2x.png',
  bombard: 'assets/bombard-2x.png',
  rootCrawler: 'assets/root-crawler-2x.png',
};

export function loadAssets(): Promise<Assets> {
  const entries = Object.entries(ASSET_FILES) as [AssetKey, string][];
  return Promise.all(entries.map(([key, src]) => new Promise<[AssetKey, HTMLImageElement]>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve([key, img]);
    img.onerror = () => reject(new Error(`failed to load ${src}`));
    img.src = src;
  }))).then(pairs => Object.fromEntries(pairs) as Assets);
}