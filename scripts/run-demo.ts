import { runDemo } from '@/lib/generate-page';

runDemo('bold').then(({ primary, alternates, renderTime }) => {
  console.log(`✅ Generated in ${renderTime.toFixed(2)}ms`);
  console.log(`Sections: ${primary.sections.length}`);
  console.log('Section order:', primary.sections.map(s => `${s.meta.kind}-${s.meta.variant}`).join(' -> '));
}).catch(err => {
  console.error(err);
  process.exit(1);
});
