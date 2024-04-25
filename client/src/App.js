import { createContext, useContext, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import Nav from './components/Nav'
import Footer from './components/Footer'
import './styles.css';
export const UserContext = createContext()

function App() {
  const [user, setUser] = useState(null)
  const login = (user) => setUser(user)
  const logout = () => {
		try {
			fetch('/logout', { method: 'DELETE' }).then((res) => {
				if (res.status === 204) {
					setUser(null)
					toast.success('All logged out!')
				} else {
					toast.error('Something whent wrong while logging out. Please try again.')
				}
			})
		} catch (err) {
			throw err
  }}

  useEffect(() => {
    fetch('/me')
    .then(resp => {
        if (resp.ok) {
        resp.json().then(setUser)
        
        } else {
        toast.error('Please log in')
        }
    })
}, [])
 

  return (

    <UserContext.Provider value={{user, login, logout}}>

      <main className='h-screen cormorant-garamond p-6  flex-col min-h-screen"'>
        <Toaster
          position='top-center'
          containerClassName='toaster-style'
        />
        <Nav />
        <Outlet/>
        <Footer />
      </main>

    </UserContext.Provider>


  );
}

export default App;
