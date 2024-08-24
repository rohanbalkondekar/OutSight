import Reach from 'react';
import NewProject from '../components/CreateProject';

const NewProjectPage: React.FC = () => {
    return(
        <div className="flex items-center justify-center h-screen">
            <div className="w-full max-w-md mx-auto">
                <NewProject />
            </div>
        </div>
    )
}

export default NewProject;