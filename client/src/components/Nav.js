import { NavLink, useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import { UserContext } from '../App'

function Nav () {
    const {user, logout} = useContext(UserContext)
    const [viewMenu, setViewMenu] = useState(false)

    const handleMenu = () => {
        setViewMenu(!viewMenu)
    }
    return (
        <div onClick={handleMenu} className='text-6xl'>
            <h1 className='hover:text-green-500' >UMAMI</h1>

            {
            user && viewMenu ? 
            <div className='text-2xl flex flex-col '>
                <NavLink id='link' to='/cookbook' className='hover:text-green-500' > Cookbook </NavLink>
                <NavLink id='link' to='/findrecipes' className='hover:text-green-500' > Find Recipe </NavLink>
                <NavLink id='link' to='/profile' className='hover:text-green-500'  > Profile </NavLink>
                <NavLink id='link' to='/' className='hover:text-green-500' onClick={logout} > Logout </NavLink>
            </div>
            :
                <></>
         }


        </div>
    )
}

export default Nav