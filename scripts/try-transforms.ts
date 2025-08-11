import { generatePage, demoContent, demoBrand } from '@/lib/generate-page';
import { HistoryManager, interpretChat, analyzeTransform } from '@/lib/transforms';

(async () => {
  const { primary } = await generatePage(demoContent, demoBrand, 'bold', ['hero','features','cta']);
  const history = new HistoryManager(primary.sections);

  const commands = [
    'make the hero more dramatic',
    'increase contrast',
    'tighten above the fold',
    'optimize for conversion',
    'add urgency banner: Ends Friday at midnight',
    'update cta description: Get started in minutes',
  ];

  for (const cmd of commands) {
    const before = history.current();
    const { transforms, intents, warnings } = interpretChat(cmd, before);
    const after = history.apply(transforms);
    const plan = analyzeTransform(before, after);
    console.log('\n>', cmd);
    console.log('intents:', intents.join(', ') || '(none)');
    if (warnings.length) console.log('warnings:', warnings.join(' | '));
    console.log('summary:', plan.summary.join(' '));
    console.log('impact:', plan.estImpact);
  }

  console.log('\nUndoing last change...');
  history.undo();
  console.log('Can redo?', history.canRedo());
})().catch(err => {
  console.error(err);
  process.exit(1);
});
