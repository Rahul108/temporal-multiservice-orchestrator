import axios from 'axios';
import 'dotenv/config';

const SERVER_A_URL = process.env.SERVER_A_URL || 'http://localhost:3001';
const SERVER_B_URL = process.env.SERVER_B_URL || 'http://localhost:3002';

export async function processLocalData(inputData, workflowId) {
  const response = await axios.post(`${SERVER_A_URL}/process-internal`, {
    data: inputData,
    workflowId
  });
  return response.data.result;
}

export async function processRemoteData(dataFromServerA, workflowId) {
  const response = await axios.post(`${SERVER_B_URL}/process-external`, {
    data: dataFromServerA,
    workflowId
  });
  return response.data.result;
}

export async function validateData(data) {
  const response = await axios.post(`${SERVER_A_URL}/validate`, { data });
  return response.data;
}

export async function enrichData(data) {
  const response = await axios.post(`${SERVER_B_URL}/enrich`, { data });
  return response.data.enrichedData;
}

export function combineResults(localResult, remoteResult, workflowId) {
  return {
    workflowId,
    processedAt: new Date().toISOString(),
    localProcessing: localResult,
    remoteProcessing: remoteResult,
    status: 'completed'
  };
}


