const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'src', 'api', 'wuwa-data.json');
const placeholder = 'NO_IMAGE_PLACEHOLDER';

function get(obj, ...keys) {
  for (const k of keys) {
    if (!obj || k == null) continue;
    if (k.includes('.')) {
      const parts = k.split('.');
      let cur = obj;
      let ok = true;
      for (const p of parts) {
        if (cur && Object.prototype.hasOwnProperty.call(cur, p)) {
          cur = cur[p];
        } else {
          ok = false; break;
        }
      }
      if (ok && cur != null) return cur;
    } else if (Object.prototype.hasOwnProperty.call(obj, k)) {
      const v = obj[k];
      if (v != null && v !== '') return v;
    }
  }
  return undefined;
}

function normalizeUrl(url) {
  if (!url) return '';
  if (typeof url !== 'string') return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `https://api.encore.moe${url}`;
  return url;
}

function normalizeCharacter(character) {
  const source =
    get(character, 'PreviewRoleCard', 'Preview_Role_Card', 'previewRoleCard', 'preview_role_card') ||
    (character.Skins && character.Skins[0] && (character.Skins[0].PreviewRoleCard || character.Skins[0].previewRoleCard)) ||
    get(character, 'RolePortrait', 'rolePortrait', 'role_portrait') ||
    get(character, 'Card', 'card') ||
    get(character, 'RoleHeadIconLarge', 'roleHeadIconLarge', 'role_head_icon_large') ||
    get(character, 'RoleHeadIcon', 'roleHeadIcon', 'role_head_icon');

  const elementIcon = get(character, 'ElementIcon', 'ElementIcon6', 'elementIcon', 'element_icon');

  return {
    id: get(character, 'Id', 'id') ?? get(character, 'PropertyId'),
    name: get(character, 'Name.Content', 'Name.content', 'name', 'Name') ?? 'Unknown',
    element: get(character, 'ElementName', 'elementName', 'element') ?? 'Unknown',
    elementIcon: normalizeUrl(elementIcon) || placeholder,
    weapon: get(character, 'WeaponTypeName', 'weaponTypeName', 'weapon') ?? 'Unknown',
    quality: get(character, 'QualityName', 'qualityName', 'Quality', 'quality') ?? 'Unknown',
    priority: get(character, 'Priority', 'priority') ?? 0,
    tags: get(character, 'Tags', 'tags') || [],
    image: normalizeUrl(source) || placeholder,
    fallback: normalizeUrl(get(character, 'RoleHeadIconLarge', 'Card', 'RoleHeadIcon', 'roleHeadIconLarge', 'card', 'role_head_icon_large') || ''),
  };
}

try {
  const raw = fs.readFileSync(dataPath, 'utf8');
  const arr = JSON.parse(raw);
  const results = arr.map(normalizeCharacter);
  const missing = results.filter(r => !r.image || r.image === placeholder || !r.name || r.name === 'Unknown');
  console.log('Total characters:', results.length);
  console.log('Missing images/names count:', missing.length);
  if (missing.length) {
    console.table(missing.map(m => ({ id: m.id, name: m.name, image: m.image, fallback: m.fallback })));
  }
} catch (e) {
  console.error('Failed:', e.message);
}
