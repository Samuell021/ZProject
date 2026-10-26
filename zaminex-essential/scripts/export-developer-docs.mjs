import { writeFileSync } from 'node:fs';
import { exportDeveloperReference } from '../src/features/developerGuide/reference.js';
import { exportHandoff, exportWorkflow, exportBackendStatus } from '../src/features/developerGuide/handoff.js';
import { exportBackendGap } from '../src/features/developerGuide/backendGap.js';
const documents = {
 'BACKEND_REFERENCE.md': exportDeveloperReference(),
 'DEVELOPER_HANDOFF.md': exportHandoff() + '\n\n' + exportBackendStatus() + '\n\n' + exportBackendGap(),
 'WORKFLOW.md': exportWorkflow(),
 'ZAMINEXB_STATUS.md': exportBackendStatus(),
 'ZAMINEXB_MIGRATION_GUIDE.md': '# نقشه تغییرات ZaminexB برای تیم توسعه\n\n' + exportBackendGap(),
};
for (const [name, content] of Object.entries(documents)) {
 writeFileSync(new URL('../' + name, import.meta.url), content + '\n');
}
console.log(`Exported ${Object.keys(documents).length} developer documents.`);
