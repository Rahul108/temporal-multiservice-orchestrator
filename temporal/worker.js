import { Worker } from '@temporalio/worker';
import 'dotenv/config';
import * as activities from './activities.js';

async function run() {
  const worker = await Worker.create({
    workflowsPath: new URL('./workflow.js', import.meta.url).pathname,
    activities,
    taskQueue: process.env.TEMPORAL_TASK_QUEUE || 'multi-server-tasks'
  });

  console.log('Worker started');
  await worker.run();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
