import { NavLink } from 'react-router-dom'

function Error() {

    return (
        <div className='border bg-shittake flex justify-center flex-col m-10 text-white text-4xl rounded-xl p-2 cormorant-garamond '>
            <h1 className='flex justify-center m-10'>Something went wrong... 🤔</h1>
            <NavLink to='/' className='hover:text-black flex justify-center m-10 italic'>` {'>'} Return Home {'<'}`</NavLink>
        </div>
    )
}

export default Error