import './Profile.css'; 
import Rohan_Photo from '../assets/Photograph - Rohan Balkondekar.jpg';
import Shashwat_Photo from '../assets/Shashwat.jpeg';


const Profile = () => {
  return (
    <div className='profiles'>
    <div className="profile-container">
      <img className="profile-photo" src={Rohan_Photo} alt="Rohan's headshot" />
      <h2 className="profile-name">Rohan</h2>
      <p className="profile-description">Engineering</p>
    </div>
    <div className="profile-container">
      <img className="profile-photo" src={Shashwat_Photo} alt="Rohan's headshot" />
      <h2 className="profile-name">Shashwat</h2>
      <p className="profile-description">Product</p>
    </div>
    </div>
  );
};

export default Profile;
