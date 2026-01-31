import { Connection, Client } from '@temporalio/client';
import { nanoid } from 'nanoid';
import 'dotenv/config';

async function run() {
  const connection = await Connection.connect({ 
    address: process.env.TEMPORAL_ADDRESS || 'localhost:7233' 
  });
  const client = new Client({ 
    connection,
    namespace: process.env.TEMPORAL_NAMESPACE || 'default'
  });

  const workflowId = `workflow-${nanoid()}`;
  const inputData = process.argv[2] || 'hello world';

  const handle = await client.workflow.start('multiServerWorkflow', {
    taskQueue: process.env.TEMPORAL_TASK_QUEUE || 'multi-server-tasks',
    workflowId,
    args: [inputData]
  });

  console.log(`Started workflow ${workflowId}`);

  const result = await handle.result();
  console.log('Workflow result:', JSON.stringify(result, null, 2));
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});