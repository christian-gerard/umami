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
        <div onClick={handleMenu} className='text-6xl flex flex-row items-end tracking-widest '>
            <h1 className='hover:text-shittake' >UMAMI 🍄</h1>
            {
            user && viewMenu ? 
            <div className='text-2xl pl-3 '>
                <NavLink id='link' to='/cookbook' className='hover:text-shittake  m-2 italic' > Cookbook </NavLink>
                <NavLink id='link' to='/findrecipes' className='hover:text-shittake m-2 italic' > Find Recipe </NavLink>
                <NavLink id='link' to='/profile' className='hover:text-shittake m-2 italic'  > Profile </NavLink>
                <NavLink id='link' to='/' className='hover:text-shittake m-2 italic' onClick={logout} > Logout </NavLink>
            </div>
            :
                <></>
         }


        </div>
    )
}

export default Nav