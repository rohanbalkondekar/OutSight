import axios from 'axios';
import { getCurrentUser } from '@/lib/actions/index';
import { SendAgentRequest } from '@/lib/models/request';
import { headers } from 'next/headers';

const API_BASE_URL = 'http://localhost:8000';


// export async function postData(Data: any, endpoint:string) {
//   const { token } = await getCurrentUser();

//   if (!token) {
//     throw new Error('User not authenticated');
//   }

//   const response = await axios.post(`${API_BASE_URL}/${endpoint}/`, Data, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   return response.data;
// }

export async function postData(Data: any, endpoint: string, isFileDownload = false) {
  const { token } = await getCurrentUser();

  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await axios.post(`${API_BASE_URL}/${endpoint}/`, Data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: isFileDownload ? 'blob' : 'json', // Handle blob for file download
  });

  // If it's a file download, return the blob, otherwise return the JSON data
  return isFileDownload ? response.data : response.data;
}



export async function getData(endpoint: string, token: string) {
  if (!token) {
    throw new Error('User not authenticated');
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/${endpoint}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Adjust this according to the structure of your response
  } catch (error: any) {
    // Handle error cases like 401, 403, or network errors
    if (error.response) {
      // Server responded with a status other than 200 range
      console.error(`Error: ${error.response.status} - ${error.response.data}`);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Error: No response received from server');
    } else {
      // Something else went wrong
      console.error('Error:', error.message);
    }

    throw new Error(`Failed to fetch data from ${endpoint}`);
  }
}


export async function getDataFolder(endpoint: string, token: any, inputPath: string) {
  if (!token) {
    throw new Error('User not authenticated');
  }

  // Encode the inputPath to ensure it's safely passed in the URL
  const encodedInputPath = encodeURIComponent(inputPath);

  const response = await axios.get(`${API_BASE_URL}/${endpoint}/?input_path=${encodedInputPath}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}




export async function putData(data:any, endpoint:string) {
    const { token } = await getCurrentUser()

    if (!token){
        throw new Error('User not authenticated');
    }

    const response = await axios.put(`${API_BASE_URL}/${endpoint}/`, data, {
        headers:{
            Authorization: `Bearer ${token}`,
        }

    });
    return response.data
}

export async function deleteData(endpoint:string) {
    const { token } = await getCurrentUser()

    if (!token){
        throw new Error('User not authenticated');
    }

    const response = await axios.delete(`${API_BASE_URL}/${endpoint}/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    return response.data;
}

// export async function runAgent(agentData: AgentRequest) {
//   const { token } = await getCurrentUser();

//   if (!token) {
//     throw new Error('User not authenticated');
//   }

//   const response = await axios.post('${API_BASE_URL}/agent/run_agent', agentData, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   return response.data;
// }


export async function runAgent(agentData: SendAgentRequest) {
  const response = await postData(agentData, "agent/run_agent")

  return response.data
}