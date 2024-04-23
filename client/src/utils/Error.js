import { NavLink } from 'react-router-dom'

function Error() {

    return (
        <>
            <h1>Something went wrong... 🤔</h1>
            <NavLink to='/'>Return Home</NavLink>
        </>
    )
}

export default Error