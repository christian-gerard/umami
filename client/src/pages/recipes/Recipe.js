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
			console.log(formData)

			fetch(`/recipes/${currentRecipe.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			}).then((res) => {

				if (res.ok) {
					return res.json().then((data) => {
						nav('/cookbook')
						toast.success("Recipe Updated")
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

	}, [route.id])



    
    return (
        <>
        { route.id ? 
        
            <div>
				<div>
					<button className='bg-shittake rounded-lg p-2 text-white' onClick={handleEdit}>Edit</button>
					<button className='bg-white rounded-lg p-2 text-shittake ' onClick={handleDelete}>Delete</button>
					<p className='text-4xl'>{currentRecipe.name}</p>
					<p className='text-lg'>{currentRecipe.steps}</p>

				</div>
                {
                    editMode ? 
                    <div className='fixed inset-0 flex justify-center items-center transition-colors backdrop-blur'> 

						<form className=' bg-white p-12  flex flex-col text-lg rounded-xl border-2 border-shittake' onSubmit={formik.handleSubmit}>
						<button className='bg-shittake text-white rounded-xl 'type='button' onClick={() => setEditMode(!editMode)} >X</button>
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
								Update Recipe
							</button>
						</form>


					</div>
                    
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

					{/* <p className='text-lg'>{ingredients ? ingredients.map((ingredient) => <p>{ingredient.name}</p>) : <p>Loading...</p>}</p> */}
					
				</div>

			</NavLink>

        }
        
        </>
    )
}

export default Recipe