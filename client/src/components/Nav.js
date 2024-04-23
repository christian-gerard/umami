import { NavLink, useNavigate } from 'react-router-dom'

function Nav () {

    return (
        <>
            <h1>
                UMAMI || 旨味
            </h1>

            <NavLink id='link' to='/recipes' className='nav-link' > Recipes </NavLink>
            <NavLink id='link' to='/findrecipes' className='nav-link' > Find Recipe </NavLink>
            <NavLink id='link' to='/' className='nav-link' > Logout </NavLink>
                

        </>
    )
}

export default Nav