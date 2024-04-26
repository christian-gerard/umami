import { useState, useContext } from 'react'
import { UserContext } from '../../App'

function Profile() {
    const { user } = useContext(UserContext)
    const [editMode, setEditMode] = useState(false)

    const handleEdit = () => {
        console.log("EDIT")
        setEditMode(!editMode)
    }

    const handleDelete = () => {
        console.log("DELETE")
    }

    return (

        <div className='text-lg bg-green-200 p-6 flex flex-col m-10 rounded-lg'>

            <h1 className='text-4xl font-bold m-1'>Profile</h1>

            <h1 className='m-1'>{user.username}</h1>

            <h3 className='m-1'>{user.email}</h3>

            <p>CookBook Size: {user.recipes.length}</p>

            <button className=' bg-white text-green-500 rounded-lg hover:text-black p-1 m-2 mt-3 ' onClick={handleEdit}>EDIT</button>

            <button className=' bg-white text-red-500 rounded-lg hover:text-black p-1 m-2 ' onClick={handleDelete}>DELETE ACCOUNT</button>

        </div>

    )
}

export default Profile