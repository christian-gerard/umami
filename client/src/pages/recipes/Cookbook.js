import Recipe from './Recipe'
import { useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import { UserContext } from '../../App'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import { object, string } from 'yup'
import { date as yupDate } from 'yup'

function Cookbook() {
    const nav = useNavigate()
    const { user } = useContext(UserContext)
    const [pages, setPages] = useState(1)
    const [recipeForm, setRecipeForm] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const startIndex = (currentPage - 1) * 10
    const endIndex = currentPage * 10

    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage((currentPage) => currentPage - 1)
    }}

    const handleNext = () => {
        if (pages > currentPage) {
            setCurrentPage((currentPage) => currentPage + 1)
    }}

    const newRecipe = () => {
        setRecipeForm(!recipeForm)
    }

    const handleRecipeDelete = () => {

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
        <div className='p-6'>
            <div className='flex flex-row'>
                <h1 className='text-3xl'>Cookbook</h1>
                <button className='text-2xl bg-green-500 hover:bg-transparent ' onClick={newRecipe}>New +</button>
            </div>
            {user.recipes.slice(startIndex, endIndex).map((recipe) => <Recipe key={recipe.id} {...recipe} />)}
            <div>
                <button className='all-entries' onClick={handlePrev}>Prev</button>
                    &nbsp; {currentPage} of {pages} &nbsp;
                <button className='all-entries' onClick={handleNext}>Next</button>
            </div> 
            {
                recipeForm ?

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

                <button className='text-2xl bg-green-500 hover:bg-transparent'>
                    Add Recipe
                </button>
            </form>
            :
            <></>

            }
        </div>
    )
}

export default Cookbook