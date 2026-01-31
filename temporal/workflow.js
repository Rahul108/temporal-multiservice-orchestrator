import { proxyActivities } from '@temporalio/workflow';

const { validateData, processLocalData, processRemoteData, enrichData, combineResults } = proxyActivities({
  startToCloseTimeout: '30s',
  retry: {
    maximumAttempts: 3
  }
});

export async function multiServerWorkflow(inputData) {
  const workflowId = `workflow-${Date.now()}`;
  
  const validation = await validateData(inputData);
  if (!validation.valid) {
    throw new Error(`Validation failed: ${validation.message}`);
  }
  
  const localResult = await processLocalData(inputData, workflowId);
  const remoteResult = await processRemoteData(localResult, workflowId);
  const enrichedData = await enrichData(remoteResult);
  
  return combineResults(localResult, enrichedData, workflowId);
}
