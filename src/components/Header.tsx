import './Header.css';
import logo from '../assets/Outsight.png';

const Header = () => {
  return (
    <div className="container"> {/* Added the container div */}
      <img src={logo} className="logo" alt="Site Logo" />
      <h2 className='slogan'>Out of the Box Insights For your Business</h2>
      <h2 className='update'>❤️</h2>
    </div>
  );
};

export default Header;
