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
        <>
            <h1 className='text-2xl font-bold'>Profile</h1>

            <h1 className='text-xl'>{user.username}</h1>

            <button className='bg-green-500 hover:bg-transparent' onClick={handleEdit}>Edit</button>

            <button className='bg-green-500 hover:bg-transparent' onClick={handleDelete}>DELETE ACCOUNT</button>
        </>
    )
}

export default Profile