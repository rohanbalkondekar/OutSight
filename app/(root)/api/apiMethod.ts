import axios from 'axios';
import { getCurrentUser } from '@/lib/actions/index';
import { SendAgentRequest } from '@/lib/models/request';

// Use environment variable for API base URL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';

/**
 * Helper function to get authorization headers
 */
async function getAuthHeaders() {
  const { token } = await getCurrentUser();

  if (!token) {
    throw new Error('User not authenticated');
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Post data to the specified endpoint
 */
export async function postData(data: any, endpoint: string, isFileDownload = false) {
  const headers = await getAuthHeaders();

  const response = await axios.post(`${API_BASE_URL}/${endpoint}/`, data, {
    headers,
    responseType: isFileDownload ? 'blob' : 'json',
  });

  return response.data;
}

/**
 * Get data from the specified endpoint
 */
export async function getData(endpoint: string) {
  const headers = await getAuthHeaders();

  try {
    const response = await axios.get(`${API_BASE_URL}/${endpoint}/`, {
      headers,
    });
    return response.data;
  } catch (error: any) {
    const status = error.response?.status;
    const message = error.response?.data || error.message;
    console.error(`Error: ${status} - ${message}`);
    throw new Error(`Failed to fetch data from ${endpoint}`);
  }
}

/**
 * Get data for a folder from the specified endpoint
 */
export async function getDataFolder(endpoint: string, inputPath: string) {
  const headers = await getAuthHeaders();

  // Encode the inputPath to ensure it's safely passed in the URL
  const encodedInputPath = encodeURIComponent(inputPath);

  const response = await axios.get(`${API_BASE_URL}/${endpoint}/?input_path=${encodedInputPath}`, {
    headers,
  });

  return response.data;
}

/**
 * Put data to the specified endpoint
 */
export async function putData(data: any, endpoint: string) {
  const headers = await getAuthHeaders();

  const response = await axios.put(`${API_BASE_URL}/${endpoint}/`, data, {
    headers,
  });

  return response.data;
}

/**
 * Delete data at the specified endpoint
 */
export async function deleteData(endpoint: string) {
  const headers = await getAuthHeaders();

  const response = await axios.delete(`${API_BASE_URL}/${endpoint}/`, {
    headers,
  });

  return response.data;
}

/**
 * Run agent with the provided data
 */
export async function runAgent(agentData: SendAgentRequest) {
  return await postData(agentData, 'agent/run_agent');
}
