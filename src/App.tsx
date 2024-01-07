import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import Action from './components/Action'
import Spline from '@splinetool/react-spline';

function App() {

  return (
    <>
      <Header/>
      <Hero/>
      <Action/>
      <div className="spline-container">
      <Spline scene="https://prod.spline.design/7xbjlBkVVxdgT4gV/scene.splinecode" />
      </div>
    </>
  )
}

export default App
