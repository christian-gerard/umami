import { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Nav from './components/Nav'
import Footer from './components/Footer'
import './styles.css';

function App() {
  return (
    <main>
      <Toaster
        position='top-center'
        containerClassName='toaster-style'
      />
      <Nav />
      <Outlet context={{}} />
      <Footer />
    </main>
  );
}

export default App;
