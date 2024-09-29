import React from 'react';
import { postData } from '../api/apiMethod';
import { SendAgentRequest } from '@/lib/models/request';



const DownloadCode: React.FC<{project: SendAgentRequest}> = ({project}) => {
    const downloadFile = async() => {

        try{

            const data = {output_path: project.output_path}

            const blob = await postData(data, "file/download_migrated_code", true);

            const url = window.URL.createObjectURL(new Blob([blob], {type: 'application/zip'}));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'migrated_code.zip';
            a.click();
            window.URL.revokeObjectURL(url);

        }catch(error:any){
            console.error("error downloading file:", error);
        }

    }

    return (
        <button onClick={downloadFile}
        className='text-white bg-green-600 p-2 rounded-lg hover:bg-gray-600'
        >Download Migrated Code</button>
    );

}

export default DownloadCode