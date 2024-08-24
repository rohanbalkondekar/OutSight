import axios from 'axios';
import { getCurrentUser } from '@/lib/actions/index';
import { AgentRequest } from '@/lib/models/request';
import { headers } from 'next/headers';

const API_BASE_URL = 'http://localhost:8000';

// Function to create a new job
export async function postData(Data: any, endpoint:string) {
  const { token } = await getCurrentUser();

  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await axios.post(`${API_BASE_URL}/${endpoint}/`, Data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

// Function to get jobs for the current user
export async function getData(endpoint:string, token:any) {
  // const { token } = await getCurrentUser();

  if (!token) {
    throw new Error('User not authenticated');
  }



  const response = await axios.get(`${API_BASE_URL}/${endpoint}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
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


export async function runAgent(agentData: AgentRequest) {
  const response = await postData(agentData, "agent/run_agent")

  return response.data
}