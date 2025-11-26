// Generate a version file with build timestamp for cache busting
const fs = require('fs');
const path = require('path');

const version = Date.now().toString();
const versionFile = path.join(__dirname, '..', 'public', 'version.json');

fs.writeFileSync(versionFile, JSON.stringify({ version, buildTime: new Date().toISOString() }), 'utf8');
console.log(`Generated version file: ${version} (${new Date().toISOString()})`);

