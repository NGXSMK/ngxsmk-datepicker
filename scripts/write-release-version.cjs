const fs = require('node:fs');
const path = require('node:path');

module.exports = function writeReleaseVersion(version) {
  const workspace = path.resolve(__dirname, '..');
  for (const relativePath of ['package.json', 'projects/ngxsmk-datepicker/package.json', 'mcp-server/package.json', 'package-lock.json']) {
    const filePath = path.join(workspace, relativePath);
    const original = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(original);
    data.version = version;
    if (relativePath === 'package-lock.json') data.packages[''].version = version;

    const updated = JSON.stringify(data, null, 2) + '\n';
    fs.writeFileSync(filePath, original.includes('\r\n') ? updated.replaceAll('\n', '\r\n') : updated);
  }
};
