import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { modelCatalog } from '../features/developerGuide/models.js';
import { backendGap, exportBackendGap } from '../features/developerGuide/backendGap.js';
import { exportDeveloperReference } from '../features/developerGuide/reference.js';

test('every proposed model has an explicit migration path from actual backend source', () => {
  assert.deepEqual(Object.keys(backendGap).sort(), Object.keys(modelCatalog).sort());
  for (const [name, gap] of Object.entries(backendGap)) {
    assert.ok(gap.current && gap.change && gap.migration, name);
    if (gap.source.startsWith('django.')) continue;
    const sourceFile = gap.source.split(' · ')[0];
    if (sourceFile.endsWith('.py')) {
      const source = readFileSync(new URL(`../../../ZaminexB/apps/${sourceFile}`, import.meta.url), 'utf8');
      for (const className of gap.source.split(' · ')[1].split(' / ')) {
        if (className.includes('.')) continue;
        assert.ok(source.includes(`class ${className}(`), `${name}: ${className}`);
      }
    }
  }
  const reference = exportDeveloperReference();
  assert.ok(reference.includes(exportBackendGap()));
  assert.ok(reference.includes('ConsultantProfile / AdminProfile'));
  assert.ok(reference.includes('PropertyAppraisalReport'));
});
