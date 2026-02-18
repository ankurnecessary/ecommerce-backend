import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const distRoot = path.join(projectRoot, 'dist');

const toPosix = (value) => value.replaceAll(path.sep, '/');

const toRelativeImport = (fromFile, aliasTarget) => {
  const targetPath = path.join(distRoot, aliasTarget);
  let relativePath = path.relative(path.dirname(fromFile), targetPath);
  relativePath = toPosix(relativePath);
  if (!relativePath.startsWith('.')) relativePath = `./${relativePath}`;
  return relativePath;
};

const rewriteFile = (filePath) => {
  const source = fs.readFileSync(filePath, 'utf8');
  const rewritten = source
    .replace(
      /(\bfrom\s*['"])@\/([^'"]+)(['"])/g,
      (_, prefix, target, suffix) => {
        return `${prefix}${toRelativeImport(filePath, target)}${suffix}`;
      }
    )
    .replace(
      /(\bimport\s*\(\s*['"])@\/([^'"]+)(['"]\s*\))/g,
      (_, prefix, target, suffix) => {
        return `${prefix}${toRelativeImport(filePath, target)}${suffix}`;
      }
    );

  if (rewritten !== source) fs.writeFileSync(filePath, rewritten, 'utf8');
};

const walk = (dirPath) => {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (fullPath.endsWith('.js') || fullPath.endsWith('.mjs'))
      rewriteFile(fullPath);
  }
};

if (fs.existsSync(distRoot)) walk(distRoot);
