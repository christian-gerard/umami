import { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import { object, string } from 'yup'
import { date as yupDate } from 'yup'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../App'
import RecipeForm from '../recipes/RecipeForm'


function Recipe({name, steps, ingredients, cookbooks}) {
    const route = useParams()
    const [editMode, setEditMode] = useState(false)
    const nav = useNavigate()

    const handleEdit = () => {
        setEditMode(!editMode)
    }

    const handleDelete = () => {
        console.log('DELETE TRIGGERED')
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
        <>
        { route.id ? 
        
            <div>
                <button onClick={handleEdit}>Edit</button>
                <p>{name}</p>
                <p>{steps}</p>
                {
                    editMode ? 
                    
                    <form>
                        <label htmlFor='name'>Name</label>
                        <input
							type='text'
							name='name'
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.name}
							id = 'name'
							placeholder='Existing Name here'
						/>
                        {formik.errors.name && formik.touched.name && (
							<div className='error-message show'>{formik.errors.name}</div>
						)}

                        <label htmlFor='steps'>Steps</label>
                        <input
							type='text'
							name='steps'
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.steps}
							id = 'steps'
							placeholder='Existing Steps here'
						/>
                        {formik.errors.steps && formik.touched.steps && (
							<div className='error-message show'>{formik.errors.steps}</div>
						)}

                        <label htmlFor='ingredients'>Ingredients</label>
                        <input
							type='text'
							name='ingredients'
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.ingredients}
							id = 'steps'
							placeholder='Existing Steps here'
						/>
                        {formik.errors.ingredients && formik.touched.ingredients && (
							<div className='error-message show'>{formik.errors.ingredients}</div>
						)}

                        <button>
                            Add Recipe
                        </button>
                    </form>
                    
                    : 
                    
                    <></>
                    
                }
            </div>

            : 

            <div className='p-4'>
                <button className='text-lg bg-green-500 hover:bg-transparent' onClick={handleDelete}>Delete</button>
                <p className='text-2xl'>{name}</p>
                <p className='text-lg'>{steps}</p>
                
            </div>

        }
        
        </>
    )
}

export default Recipe