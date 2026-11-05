const fs = require('fs');
const path = require('path');

const localesDir = path.resolve(__dirname, '../locales');
const enPath = path.join(localesDir, 'en.json');
const tePath = path.join(localesDir, 'te.json');
const hiPath = path.join(localesDir, 'hi.json');

function loadJson(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Locale file not found: ${filePath}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys = keys.concat(getAllKeys(value, fullPath));
    } else {
      keys.push({ key: fullPath, value });
    }
  }
  return keys;
}

const en = loadJson(enPath);
const te = loadJson(tePath);
const hi = loadJson(hiPath);

const enEntries = getAllKeys(en);
const teEntries = getAllKeys(te);
const hiEntries = getAllKeys(hi);

const enKeyMap = new Map(enEntries.map(e => [e.key, e.value]));
const teKeyMap = new Map(teEntries.map(e => [e.key, e.value]));
const hiKeyMap = new Map(hiEntries.map(e => [e.key, e.value]));

let errors = [];

// 1. Check all EN keys exist in TE and HI
for (const [key, enVal] of enKeyMap.entries()) {
  if (!teKeyMap.has(key)) {
    errors.push(`Missing key in Telugu (te.json): "${key}"`);
  }
  if (!hiKeyMap.has(key)) {
    errors.push(`Missing key in Hindi (hi.json): "${key}"`);
  }
}

// 2. Check no extraneous keys in TE or HI
for (const key of teKeyMap.keys()) {
  if (!enKeyMap.has(key)) {
    errors.push(`Extraneous key in Telugu (te.json): "${key}"`);
  }
}

for (const key of hiKeyMap.keys()) {
  if (!enKeyMap.has(key)) {
    errors.push(`Extraneous key in Hindi (hi.json): "${key}"`);
  }
}

// 3. Check for untranslated strings (unless it's an intentional technical code, e.g. "GM27", "112", "CSV", etc.)
const allowedUntranslatedSubstrings = ['112', '100', '108', '1098', '2027', 'CSV', 'JSON', 'GPS', 'ID', 'PIN', 'DPDP', 'RTIH', 'PS-03', 'v1.0.0'];

function looksLikeEnglish(str) {
  // If text contains mostly Latin words and is > 10 chars
  const latinCount = (str.match(/[a-zA-Z]/g) || []).length;
  const nonLatinCount = (str.match(/[^\x00-\x7F]/g) || []).length;
  return latinCount > 15 && nonLatinCount === 0;
}

for (const [key, teVal] of teKeyMap.entries()) {
  if (typeof teVal === 'string' && looksLikeEnglish(teVal)) {
    const isAllowed = allowedUntranslatedSubstrings.some(sub => teVal.includes(sub));
    if (!isAllowed) {
      errors.push(`Untranslated English string detected in Telugu (te.json) -> "${key}": "${teVal}"`);
    }
  }
}

for (const [key, hiVal] of hiKeyMap.entries()) {
  if (typeof hiVal === 'string' && looksLikeEnglish(hiVal)) {
    const isAllowed = allowedUntranslatedSubstrings.some(sub => hiVal.includes(sub));
    if (!isAllowed) {
      errors.push(`Untranslated English string detected in Hindi (hi.json) -> "${key}": "${hiVal}"`);
    }
  }
}

if (errors.length > 0) {
  console.error(`\n❌ i18n Parity Validation Failed with ${errors.length} error(s):`);
  errors.slice(0, 20).forEach(err => console.error(`  - ${err}`));
  if (errors.length > 20) console.error(`  ... and ${errors.length - 20} more.`);
  process.exit(1);
} else {
  console.log(`\n✅ i18n Parity Validation Passed!`);
  console.log(`   - English keys: ${enKeyMap.size}`);
  console.log(`   - Telugu keys:  ${teKeyMap.size} (100% match)`);
  console.log(`   - Hindi keys:   ${hiKeyMap.size} (100% match)\n`);
  process.exit(0);
}
