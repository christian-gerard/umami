import { useContext, useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import { object, string } from 'yup'
import { date as yupDate } from 'yup'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../App'
import RecipeForm from '../recipes/RecipeForm'
import Nav from '../../components/Nav'


function Recipe({id, name, steps, ingredients, cookbooks}) {
	const { user } = useContext(UserContext)
    const route = useParams()
    const [editMode, setEditMode] = useState(false)
	const [currentRecipe, setCurrentRecipe] = useState({})
    const nav = useNavigate()


    const handleEdit = () => {
        setEditMode(!editMode)
    }

    const handleDelete = () => {
		fetch(`/recipes/${route.id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then((res) => {
			if (res.ok) {


				nav('/cookbooks')
				toast.success("Deleted")
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


	useEffect(() => {
		if (route.id) {
			fetch(`/recipes/${route.id}`)
			.then((res) => {
				if (res.ok) {
					res.json()
						.then((data) => {
							setCurrentRecipe(data)
						})
						.then(() => {
							
						})
				} else if (res.status === 422) {
					toast.error('Invalid Login')
				} else {
					return res
						.json()
						.then((errorObj) => toast.error(errorObj.Error))}
			})
		}

	}, [])






    
    return (
        <>
        { route.id ? 
        
            <div>
                <button onClick={handleEdit}>Edit</button>
                <p>{currentRecipe.name}</p>
                <p>{currentRecipe.steps}</p>
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
							placeholder={currentRecipe.name}
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
							placeholder={currentRecipe.steps}
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
                            Add Recipe
                        </button>
                    </form>
                    
                    : 
                    
                    <></>
                    
                }
            </div>

            : 

			<NavLink to={`/recipes/${id}`}>

				<div className='p-4' >

					<div className='flex flex-row justify-between'>

						<p className='text-3xl'>{name}</p>

					</div>

					<p className='text-lg'>{steps}</p>
					
				</div>

			</NavLink>

        }
        
        </>
    )
}

export default Recipe