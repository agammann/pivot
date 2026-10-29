import { readFile } from 'node:fs/promises';
import { assess } from './geometry.mjs';
try {
  const path = process.argv[2];
  if (!path) throw new Error('Usage: node pivot.mjs example.json');
  const data = JSON.parse(await readFile(path, 'utf8'));
  const result = assess(data);
  console.log(JSON.stringify(result, null, 2));
  console.log('\nMeasurement checklist: outer rigid length and width including protrusions; clear doorway with door open; both clear corridor widths; measurement uncertainty; adjacent space, height, obstacles and route details.');
  console.log('This is not a route or a safety assessment. Unknown does not mean it fits.');
} catch (e) { console.error(e.message); process.exitCode = 1; }
