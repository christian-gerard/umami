import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../App'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import { object, string } from 'yup'


function Profile() {
    const { user } = useContext(UserContext)
    const [editMode, setEditMode] = useState(false)
    const nav = useNavigate()
    const handleEdit = () => {
        console.log("EDIT")
        setEditMode(!editMode)
    }

    const handleDelete = () => {
        fetch(`/users/${user.id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then((res) => {
			if (res.ok) {

				nav('/')
				toast.success("Account Deleted")
			} else {
				return res
					.json()
					.then((errorObj) => toast.error(errorObj.message))
			}
		})
		.catch((error) => console.error('Error:', error))
        
    }


    const recipeSchema = object({
        name: string(),
        steps: string()
    })

    const initialValues = {
        name: '',
        steps: ''
    }

	const formik = useFormik({
		initialValues,
		validationSchema: recipeSchema,
		onSubmit: (formData) => {
			fetch('/entries', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: formData.name
				})
			})
				.then((res) => {
					if (res.ok) {
						return res.json().then((data) => {


							nav('/cookbook')
							toast.success("Entry Submited")
						})
					} else {
						return res
							.json()
							.then((errorObj) => toast.error(errorObj.message))
					}
				})
		}
	})


    return (

        <div className='text-lg bg-green-200 p-6 flex flex-col m-10 rounded-lg'>

            <h1 className='text-4xl font-bold m-1'>Profile</h1>

            <h1 className='m-1'>{user.username}</h1>

            <h3 className='m-1'>{user.email}</h3>

            <p>CookBook Size: {user.recipes.length}</p>

            <button className=' bg-shittake text-white rounded-lg hover:text-black p-1 m-2 mt-3 ' onClick={handleEdit}>EDIT</button>

            <button className=' bg-white border-2 border-red text-shittake rounded-lg hover:text-black p-1 m-2 ' onClick={handleDelete}>DELETE ACCOUNT</button>

            {
                    editMode ? 
                    <div className='fixed inset-0 flex justify-center items-center transition-colors backdrop-blur'> 

						<form className=' bg-white p-12  flex flex-col text-lg rounded-xl border-2 border-shittake'>
						<button className='bg-shittake text-white rounded-xl 'type='button' onClick={() => setEditMode(!editMode)} >X</button>
							<label htmlFor='name'>User Name</label>
							<input
								type='text'
								name='username'
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.name}
								id = 'name'
								placeholder={user.username}
							/>
							{formik.errors.name && formik.touched.name && (
								<div className='error-message show'>{formik.errors.name}</div>
							)}

							<label htmlFor='steps'>email</label>
							<input
								type='text'
								name='steps'
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.steps}
								id = 'steps'
								placeholder={user.email}
							/>
							{formik.errors.steps && formik.touched.steps && (
								<div className='error-message show'>{formik.errors.steps}</div>
							)}

							{/* <label htmlFor='ingredients'>Ingredients</label>
							<input
								type='text'
								name='ingredients'
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.ingredients}
								id = 'steps'
								placeholder={currentRecipe.steps}
							/>
							{formik.errors.ingredients && formik.touched.ingredients && (
								<div className='error-message show'>{formik.errors.ingredients}</div>
							)} */}

							<button>
								Update Profile
							</button>
						</form>


					</div>
                    
                    : 
                    
                    <></>
                    
                }

        </div>

    )
}

export default Profile