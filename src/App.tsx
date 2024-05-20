import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Action from './components/Action';

function App() {
  const handleEmailSubmit = (email: string) => {
    // Handle the submitted email value here
    console.log('Submitted email:', email);
    // You can add additional logic or API calls here
  };

  return (
    <>
      <Header />
      <Hero />
      <Action onSubmit={handleEmailSubmit} />
      <div className="spline-container"></div>
    </>
  );
}

export default App;