const path = require('node:path');
const fs = require('node:fs');
const sharedRoot = path.resolve(__dirname, '../..');
module.exports = {
  reactStrictMode: true,
  experimental: { cpus: 2 },
  outputFileTracingRoot: fs.existsSync(path.join(sharedRoot, 'student.json')) ? sharedRoot : __dirname,
  outputFileTracingIncludes: { '/api/profiles': ['./data/profiles.json'], '/api/getAnimals': ['./public/animal-types.json'] }
};
